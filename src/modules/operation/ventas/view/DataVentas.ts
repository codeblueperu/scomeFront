import { onMounted, Ref, ref } from "vue";
import srvVenta from '@/services/operation/VentaService';
import { useQuasar } from "quasar";
import srvReporte from '@/services/report/VentaReporteService';
import Swal from "sweetalert2";
import moment from "moment";


const appDataVenta = {
    setup(){
        const quasar = useQuasar();
        let row:Ref<any []> = ref([]), column = ref(), isLoadingTable = ref(false), filterdata = ref(''),
        visiblecolumn = ref(['estado_pago','cliente','numero_comprobante','fecha_venta','monto_subtotal','monto_descuento','monto_total','estado_venta','actions']);

        let now = moment(new Date()).format('yyyy-MM-DD');
        let anteriofecha = moment(new Date()).add(-1,'d').format('yyyy-MM-DD');
        let fechainicio = ref(anteriofecha);      
        let fechafin = ref(now);

        /* LISTA TODA LAS VENTAS */
        const onDataVentas = (async () => {
            isLoadingTable.value = true;
            row.value = [];
            await srvVenta.getDataVentas(fechainicio.value,moment(fechafin.value).add(1,'d').format('yyyy-MM-DD'))
            .then(({data}) =>{
                data.forEach((item:any) => {
                    row.value.push({
                        name:item.cod_venta,
                        sucursal:item.sucursal,
                        cliente:item.cliente,
                        numero_comprobante:item.numero_comprobante,
                        fecha_venta: moment(item.fecha_venta).format("DD/MM/yy H:mm"),
                        monto_subtotal:formatMoney(parseFloat(item.monto_subtotal) + parseFloat(item.monto_igv)),
                        monto_igv:formatMoney(item.monto_igv),
                        monto_descuento:formatMoney(-item.monto_descuento),
                        monto_total:formatMoney(item.monto_total),
                        estado_pago: item.estado_pago,
                        estado_venta:item.estado_venta
                    })
                });
                isLoadingTable.value = false;
            })
            .catch((error) => {
                isLoadingTable.value = false;
                console.log(error);
                
            })
        });

           /* GENERAR COMPROBANTE */
        const printComprobante = (async (codventa:any) => {
            __onLoading("imprimiendo comprobante......");
            await srvReporte.getComprobanteVenta(codventa)
            .then((rpt) => {
            quasar.loading.hide();
            window.open(URL.createObjectURL(rpt), "",
            "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no,scrollbars=yes,width=700,height=540");        
            })
            .catch((error) => {
            console.log(error);
            quasar.loading.hide();
            
            })
        });

        /* DAR DE BAJA A LA VENTA */
        const deleteVenta = (async (codventa:any) => {
            //Swal.fire({title:'Upss',text:'Modulo en mantenimiento',icon:'info'})
            await Swal.fire({
                icon: 'warning',
                title: 'Estas seguro de dar de baja esta venta?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, dar de Baja',
                cancelButtonText: `No, cancelar`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    __onLoading("procesando operacion......");
                    srvVenta.postDarBajaVenta(codventa)
                    .then(({message}) => {
                        quasar.loading.hide();
                        onDataVentas()
                        Swal.fire({title:'Muy Bien!',text:message,icon:'success'})
                    })
                    .catch((error) => {
                        quasar.loading.hide();
                        console.log(error);                
                    })
                } else if (result.isDenied) {
                  Swal.fire('operacion cancelada', 'Upps', 'info')
                }
              })
            
        });

        /* OLOADING */
        const __onLoading = ((message:string) => {
            quasar.loading.show({
                  html:true,
                  message: '<b class="fm-poppis">'+message+'</b>',
                  boxClass: 'bg-grey-2 text-grey-9',
                  spinnerColor: 'primary',
                  customClass:'fm-poppis'
              })
          });

         /* FORMATO PARA MONEDAS */
         const formatMoney = function(number:number){
            return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
        };

        /* FUNCTION INIT */
        onMounted(() => {
           
            column.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "sucursal",label: "SUCURSAL",align: "left",field: 'sucursal',sortable: true},
                {name: "cliente",label: "CLIENTE",align: "left",field: 'cliente',sortable: true},
                {name: "numero_comprobante",label: "N° COMPROBANTE",align: "left",field: 'numero_comprobante',sortable: true},
                {name: "fecha_venta",label: "FECHA VENTA",align: "left",field: 'fecha_venta',sortable: true},
                {name: "monto_subtotal",label: "SUBTOTAL",align: "left",field: 'monto_subtotal',sortable: true},
                {name: "monto_igv",label: "IVG",align: "left",field: 'monto_igv',sortable: true},
                {name: "monto_descuento",label: "DESCUENTO",style:"color:#FF5722;font-weight:bold;",align: "left",field: 'monto_descuento',sortable: true},
                {name: "monto_total",label: "TOTAL",style:"color:#1B5E20;font-weight:bold;",align: "left",field: 'monto_total',sortable: true},
                {name: "estado_pago",label: "TIP. PAGO",align: "left",field: 'estado_pago',sortable: true},
                {name: "estado_venta",label: "ESTADO",align: "left",field: 'estado_venta',sortable: true},
                { name: 'actions', label: 'ACCIONES' }
            ];
            
            onDataVentas()
        });

        return {
            row,column,isLoadingTable,filterdata,visiblecolumn,
            printComprobante,deleteVenta,onDataVentas,
            fechainicio,fechafin
        }
    }
}

export default appDataVenta;