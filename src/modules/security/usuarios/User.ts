import { useQuasar } from "quasar";
import { onMounted, Ref, ref } from "vue";
import NewUserComponent from '@/components/alerts/adduserModal/NewUserComponent.vue';
import srvsecurity from '@/services/security/ServiceSecurity'
import HandlerError from "@/services/error/HandlerError";
import Swal from "sweetalert2";

const appUsers = {
    components:{
       NewUserComponent
    },
    setup(){
        let quasar = useQuasar()
        let row:Ref<any []> = ref([]), column = ref(),
        isLoadingTable = ref(false), filterdata = ref(''),
        visiblecolumns = ['nombres','documento','telefono','cargo','sucursal','email','actions']
        let modaluser = ref(NewUserComponent)

        const onListaUsuarios = (async () => {
            isLoadingTable.value = true
            column.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "nombres",label: "NOMBRES",align: "left",field: 'nombres',sortable: true},
                {name: "documento",label: "DOCUMENTO",align: "left",field: 'documento',sortable: true},
                {name: "telefono",label: "TELEFONO",align: "left",field: 'telefono',sortable: true},
                {name: "cargo",label: "CARGO",align: "left",field: 'cargo',sortable: true},
                {name: "sucursal",label: "SUCURSAL",align: "left",field: 'sucursal',sortable: true},
                {name: "email",label: "EMAIL",align: "left",field: 'email',sortable: true},
                { name: 'actions', label: 'ACCIONES' }
            ]
            row.value = [];
            await srvsecurity.getListaDataUsuario()
            .then(({data}) => {
                isLoadingTable.value = false
                data.forEach((e:any) => {
                    row.value.push({
                        name: e.cod_persona,
                        nombres: e.nombres,
                        documento: e.numero_documento,
                        telefono: e.numero_telefono,
                        cargo: e.cargo.descripcion_cargo,
                        sucursal: e.sucursal.nombre_sucursal,
                        email: e.email                        
                    });
                });                
            })
            .catch((error) => {
                isLoadingTable.value = false
                HandlerError.errorGlobal(error.response)                
            })

            
        })

        const onShowModal = () => {
            modaluser.value.onModalshow(true)
        }

        const onEditModal  = (code:any) => {
            __onLoading('Buscando registro......')
            modaluser.value.onBuscarPersonaID(code)
        }

        const onDelete = (code:any) => {
            Swal.fire({
                title: 'Estas seguro de eliminar?',
                text: "Al eliminar la cuenta, el usuario ya no podra acceder al sistema!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#6A1B9A',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar',
                cancelButtonText: 'No, Eliminar'
              }).then((result) => {
                if (result.isConfirmed) {
                    modaluser.value.onEliminarCuenta(code)
                }
              })
        }

        const __onLoading = ((message:string) => {
            quasar.loading.show({
                html:true,
                message: '<b class="fm-poppis">'+message+'</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        })

        onMounted(() => {
            onListaUsuarios();
        })

        return{
            row,column,isLoadingTable,filterdata,
            visiblecolumns,modaluser,
            onListaUsuarios,onShowModal,
            onEditModal,onDelete
        }
    }
}

export default appUsers;