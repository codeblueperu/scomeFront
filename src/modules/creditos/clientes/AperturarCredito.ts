import { onMounted, Ref, ref } from "vue";
import srvcliente from "@/services/cliente/ServiceCliente";
import srvcredito from "@/services/credito/ServiceCredito";
import DetalleCreditoComp from "@/components/tablas/detallecredito/DetalleCreditoComp.vue";
import { useQuasar } from "quasar";
import Swal from "sweetalert2";
const appAperturarCredito = {
    props:["showmodal"],
    components: {
        DetalleCreditoComp,
    },
    setup(){
        let quasar = useQuasar();
        let form = ref({cod_deuda:0,monto_credito:0.0,monto_deuda:0.0,estado:true,cod_cliente:''});
        let cbocliente = ref();
        let row:Ref<any []> = ref([]), column = ref(),isLoadingTable = ref(false), filterdata = ref('');
        let refcomponentedetalledeuda = ref(DetalleCreditoComp);

        /* DATOS_CLIENTE */
        const onDataCliente = (async () => {
            await srvcliente.getDataCliente()
            .then(({data}) => {  
                cbocliente.value = data;             
            })
        });

        /* DATA FILTER CBO CLIENTE */
        const filtrarCliente =  (val:any, update:any) => {
            if (val === '') {
              update(() => {
                onDataCliente();
              })
              return
            }

            update(() => {
              const needle = val.toLowerCase()
              cbocliente.value = cbocliente.value.filter((v:any) => v.apellidos_nombres.toLowerCase().indexOf(needle) > -1)
            })
        }

        /* LISTA DATA CREDITO */
        const onDataCredito = (async () => {
            isLoadingTable.value = true;
            row.value = [];
            await srvcredito.getDataCredito()
            .then(({data})=>{
                
                
                data.forEach((item:any) => {
                    row.value.push({
                        name: item.cod_deuda,
                        cliente: item.cliente.apellidos_nombres,
                        dni: item.cliente.numero_documento,
                        telefono: item.cliente.telefono,
                        monto_credito: item.monto_credito,
                        monto_deuda: item.monto_deuda,
                        estado: item.estado
                    })
                });
                isLoadingTable.value = false;
                console.log(row.value);
            })
            .catch((err) => {
                console.log(err);
                
            })
        });

        /* GUARDAMOS CREDITO */
        const saveCredito = (async () => {
            console.log(form.value);
            
            __onLoading("un momento, se esta procesando.....");
            await srvcredito.postSavecredito(form.value)
            .then(({data}) => {
                console.log(data);
                
                Swal.fire({html:`Operación procesada.`, title:'Excelente!', icon:'success'});
                quasar.loading.hide();
                onDataCredito();
                limpiarCajas();
            })
            .catch((err) => {
                quasar.loading.hide();
                console.log(err);            
            })
        });

        /* OBTENER REGISTRO CREDITO ID */
        const onEdit = (async (row:any) => {
            __onLoading("un momento, buscando registro.....");
            srvcredito.getCreditoID(row.name)
            .then(({data}) => {
                quasar.loading.hide();
                form.value = data;
                form.value.estado = (data.estado == 1 ? true : false);                
            })
            .catch((error) => {
                quasar.loading.hide();
                console.log(error);                
            })
        });

        /* ELIMINAR REGISTRO CREDITO ID */
        const onDelete = (async (row:any) => {
            Swal.fire({
                title: 'Estas seguro de eliminar?',
                html:`Credito del Sñr(a): <b>${row.cliente}</b>`,
                showDenyButton: true,
                confirmButtonText: 'Si, eliminar',
                denyButtonText: `No, cancelar`,
              }).then((result) => {
                if (result.isConfirmed) {
                    __onLoading("un momento, eliminando registro.....");
                    srvcredito.deleteCredito(row.name)
                    .then((rpt) => {
                        quasar.loading.hide();
                        onDataCredito();
                        Swal.fire('Credito eliminado!', '', 'success');
                    })
                    .catch((error) => {
                        quasar.loading.hide();
                        console.log(error);                        
                    })
                  
                } else if (result.isDenied) {
                  Swal.fire('Tu operación fue cancelada.', '', 'info');
                }
              })
        });

        /* LOADDING........ */
        function __onLoading(message:string){
            quasar.loading.show({
                html:true,
                message: '<b class="fm-poppis">'+message+'</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        }

        /* LIMPIAR CAJAS */
        const limpiarCajas = () => {
            form.value = {cod_deuda:0,monto_credito:0.0,monto_deuda:0.0,estado:true,cod_cliente:''};
        }

        /* MOSTRAR MODAL DETALLE DEUDA POR CREDITO */
        const showmodaldetalle = ((row:any) => {
            
            refcomponentedetalledeuda.value.openModal(true,row.name);
        });
        
        /* FORMATO PARA MONEDAS */
        const formatMoney = function(number:number){
            return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
        };

        /* RECIBIR EVENTO */
        const onloadDataEvent = (flat:boolean) => {
            if(flat){
                onDataCredito();
            }
        }

        /* DATOS INICIALES */
        onMounted( () => {
            column.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "cliente",label: "CLIENTE",align: "left",field: 'cliente',sortable: true},
                {name: "dni",label: "DNI",align: "left",field: 'dni',sortable: true},
                {name: "telefono",label: "Celular",align: "left",field: 'telefono',sortable: true},
                {name: "monto_credito",label: "Monto Credito",align: "left",field: 'monto_credito',sortable: true},
                {name: "monto_deuda",label: "Monto Deuda",style:"color:#FF5722;font-weight:bold;",align: "left",field: 'monto_deuda',sortable: true},
                {name: "estado",label: "Estado",align: "left",field: 'estado',sortable: true},
                { name: 'actions', label: 'ACCIONES' }
            ];
            onDataCredito();
            onDataCliente();

        });

        /* RETORNAMOS LOS DATOS  */
        return{
            form,cbocliente,row,column,isLoadingTable,filterdata,
            saveCredito,filtrarCliente,onEdit,onDelete,showmodaldetalle,
            refcomponentedetalledeuda,onloadDataEvent
        }
    }
}

export default appAperturarCredito;