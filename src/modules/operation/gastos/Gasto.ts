import moment from "moment";
import srvgasto from "@/services/operation/GastoService";
import { onMounted, ref, Ref } from 'vue';
import { useQuasar } from "quasar";
import Swal from "sweetalert2";

const appGasto = {
    setup(){
        let now = moment(new Date()).format('yyyy-MM-DD');
        let anteriofecha = moment(new Date()).add(-1,'d').format('yyyy-MM-DD');
        let quasar = useQuasar();
        let form = ref({
            cod_gasto:0,
            descripcion_gasto:'',
            monto_gasto:0.0,
            fecha_registro: '',
            cod_sucursal:1
        });
        let row:Ref<any []> = ref([]), column = ref(),isLoadingTable = ref(false), filterdata = ref('');

        let fechainicio = ref(anteriofecha);        
        let fechafin = ref(now);

        /* LISTA DATA DE GASTOS DEL DIA O POR FECHA */
        const getListaGasto = ( async () => {            
            isLoadingTable.value = true;
            row.value = [];
           await srvgasto.getListaDataGasto(fechainicio.value,moment(fechafin.value).add(1,'d').format("yyyy-MM-DD"))
            .then(({data}) => {
                data.forEach((item:any) => {
                    row.value.push({
                        name: item.cod_gasto,
                        descripcion_gasto: item.descripcion_gasto,
                        monto_gasto: item.monto_gasto,
                        fecha_registro: moment(item.fecha_registro).format('DD/MM/yyyy H:mm:ss')
                    });
                });
                isLoadingTable.value = false;
            })
            .catch(({response}) => {
                isLoadingTable.value = false;
                console.log(response);     
             });
        });

        /* FUNCION GUARDAR DATOS DEL GASTO */
        const saveGasto = (async () =>{
            __onLoading("un momento, se esta procesando.....");
        
           form.value.fecha_registro = moment(new Date()).format('yyyy-MM-DD H:mm:ss');
           await srvgasto.postSavegasto(form.value)
           .then((rpt) => {
            Swal.fire({text:'Operación procesada', title:'Excelente!', icon:'success'});
            quasar.loading.hide();
            limpiarCajas();
            getListaGasto();
           })
           .catch((err) => {
            quasar.loading.hide();
            console.log(err);            
           })
        });

        /* OBTENER REGISTRO GASTO ID */
        const onEdit = (async (row:any) => {
            __onLoading("un momento, buscando registro.....");
            srvgasto.getBuscargastoID(row.name)
            .then(({data}) => {
                quasar.loading.hide();
                form.value = data;                
            })
            .catch((error) => {
                quasar.loading.hide();
                console.log(error);                
            })
        });

        /* ELIMINAR REGISTRO GASTO ID */
        const onDelete = (async (row:any) => {
            Swal.fire({
                title: 'Estas seguro de eliminar este gasto?',
                showDenyButton: true,
                confirmButtonText: 'Si, eliminar',
                denyButtonText: `No, eliminar`,
              }).then((result) => {
                if (result.isConfirmed) {
                    __onLoading("un momento, eliminando registro.....");
                    srvgasto.deleteGastoID(row.name)
                    .then((rpt) => {
                        quasar.loading.hide();
                        getListaGasto();
                        Swal.fire('Gasto eliminado!', '', 'success');
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

        /* FUNCION DE LIMPIAR CAJAS */
        const limpiarCajas = () => {
            form.value = {cod_gasto:0,descripcion_gasto:'',monto_gasto:0.0,fecha_registro: '',cod_sucursal:1}
        }

        /* METODOS INICIALES */
        onMounted(() => {
            column.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "descripcion_gasto",label: "DESCRIPCIÓN GASTO",align: "left",field: 'descripcion_gasto',sortable: true},
                {name: "monto_gasto",label: "MONTO GASTO",align: "left",field: 'monto_gasto',sortable: true},
                {name: "fecha_registro",label: "FECHA",align: "left",field: 'fecha_registro',sortable: true},
                { name: 'actions', label: 'ACCIONES' }
            ];
            getListaGasto();
        })

        return{
            form,column,row,isLoadingTable,filterdata,
            getListaGasto,saveGasto,onEdit,onDelete,
            fechainicio,fechafin
        }
    }
}

export default appGasto;