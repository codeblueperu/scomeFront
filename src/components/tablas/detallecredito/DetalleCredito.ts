import { useQuasar } from "quasar";
import { onMounted, ref, Ref} from 'vue';
import srvcredito from '@/services/credito/ServiceCredito';
import moment from "moment";
import Swal from "sweetalert2";

const componentDettaleCredito = {
    props:{
        onloadData:Boolean
    },
    emits: ['update:onloadData'], 
    setup(props:any, context:any){
        let quasar = useQuasar();
        let nowfecha = moment(new Date()).format('yyyy-MM-DD  H:mm:ss');
        let rows:Ref<any []> = ref([]), columns = ref(), isLoadingTable = ref(true), filterdata = ref('');
        let isOpen = ref(false)
        let iscolumnvisible = ['apellidos_nombres','fecha_venta','monto_adelanto','monto_debe','total_deuda','actions'];
        let montoadelanto:Ref<any> = ref(0.0);
        let propmodal = ref(false);
        let dataform = ref();
        //const emit = defineEmits(['onloadData']);

        const openModal = (flat:boolean,coddeuda:any) => {
            isOpen.value = flat;
            onDataDetalleDeuda(coddeuda);
        }

        const onDataDetalleDeuda = ( async (coddeuda:any) => {
            isLoadingTable.value = true;
            rows.value = [];
            await srvcredito.getDetalledeudaCreditoID(coddeuda)
            .then(({data}) => {
                data.forEach((item:any) => {
                    rows.value.push({
                        name: item.cod_detalle,
                        apellidos_nombres: item.apellidos_nombres,
                        telefono: item.telefono,
                        fecha_venta: moment(item.fecha_venta).format('DD/MM/yyyy H:mm:ss'),
                        monto_adelanto: item.monto_adelanto,
                        monto_debe: formatMoney(-item.monto_debe),
                        total_deuda: item.total_deuda,
                        cod_deuda: item.cod_deuda,
                        cod_venta: item.cod_venta
                    });
                });
                isLoadingTable.value = false;                
            })
            .catch((error) => {
                isLoadingTable.value = false;   
                console.log(error);                
            })
        });

        const onSumarAdelanto = ((row:any) => {
            propmodal.value = true;
            dataform.value = row;          
        });

        const onSaveAdelanto = (async () => {
            let now = moment(new Date()).format('yyyy-MM-DD  H:mm:ss');
            if(parseFloat(montoadelanto.value) > parseFloat(dataform.value.monto_debe)){
                onNotification("negative","top-left",4000,"Ingrese un monto menor a su deuda.");
                montoadelanto.value = 0;
                return;
            }

            if(isNaN(parseFloat(montoadelanto.value))){
                onNotification("negative","top-left",4000,"Ingrese un valor numerico.");
                montoadelanto.value = 0;
                return;
            }
            propmodal.value = false;
            __onLoading("Un momento se esta procesando...");
            let data = {
                coddetalle: dataform.value.name,
                montoadelanto: montoadelanto.value,
                codcredito: dataform.value.cod_deuda,
                codventa: dataform.value.cod_venta,
                fecha_adelanto: now
            }
            await srvcredito.postGuardarNuevoAdelante(data)
            .then((response) => {
                quasar.loading.hide();
                onNotification("positive","top-right",4000,response.message);
                onDataDetalleDeuda(dataform.value.cod_deuda);
                resetdatosiniciales();
                context.emit('update:onloadData',true);
            })
            .catch((error) => {
                quasar.loading.hide();
                console.log(error);
                if(error.response.status === 409){
                    isOpen.value = false;
                    Swal.fire({icon:'warning',title:'Upps!',html:error.response.data.message})
                }                
            })
        });

        const resetdatosiniciales = () => {
            dataform.value = null;
            propmodal.value = false;
            montoadelanto.value = 0.0;
        }

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

        /* NOTIFICACION */
        const onNotification = (type: string,position: any,time: number,message: string) => {
            quasar.notify({
              progress: true,
              type: type,
              position: position,
              timeout: time,
              message: message,
            });
        };

        /* FORMATO DE MONEDA PERUANO */
        const formatMoney = function(number:number){
            return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
        };

        onMounted(  () => {
            columns.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "apellidos_nombres",label: "CLIENTE",align: "left",field: 'apellidos_nombres',sortable: true},
                {name: "telefono",label: "TELEFONO",align: "left",field: 'telefono',sortable: true},
                {name: "fecha_venta",label: "FECHA",align: "left",field: 'fecha_venta',sortable: true},
                {name: "total_deuda",label: "TTL. DEUDA",style:"font-weight:bold;",align: "left",field: 'total_deuda',sortable: true},
                {name: "monto_adelanto",label: "MT. ADELANTO",align: "left",style:"color:#1B5E20;font-weight:bold;",field: 'monto_adelanto',sortable: true},
                {name: "monto_debe",label: "MT. DEBE",style:"color:#FF5722;font-weight:bold;",format: (val: any) => `${val}`,align: "left",field: 'monto_debe',sortable: true},
                {name: "cod_deuda",label: "cod_deuda",align: "left",field: 'cod_deuda',sortable: true},
                {name: "cod_venta",label: "cod_venta",align: "left",field: 'cod_venta',sortable: true},
                { name: 'actions', label: 'ACCIONES' }
            ];
        })

        return {
            rows,columns,isLoadingTable,isOpen,iscolumnvisible,filterdata,propmodal,montoadelanto,
            openModal,onSumarAdelanto,onSaveAdelanto
        }
    }
}

export default componentDettaleCredito;