import HandlerError from "@/services/error/HandlerError";
import { onMounted, Ref, ref } from "vue";
import SrvConfiguration from '@/services/setting/ConfiguracionService';
import ServiceSecurity from "@/services/security/ServiceSecurity";
import srvsecurity from '@/services/security/ServiceSecurity';
import Swal from "sweetalert2";
import { useQuasar } from "quasar";

const appPermiso = {
    setup(){
        let quasar = useQuasar();
        let cod_sucursal = ref('')
        let cod_usuario = ref('')
        let cod_cargo = ref('')
        let cod_menu_principal = ref('')
        let formData = ref({})
        let optionSucursal = ref([])
        let optionUsuario = ref([])
        let optionCargo = ref([])
        let optionMenuPrincipal= ref([])
        let row:Ref<any []> = ref([]), column = ref(),
        isLoadingTable = ref(false), filterdata = ref(''),
        visiblecolumns = ['menu','is_select','is_insert','is_update','is_delete','is_print']

        const onDataSucursal = (async () => {
            await SrvConfiguration.getListaSucursales()
            .then(({data}) => {
                optionSucursal.value = data
            })
            .catch((error) => {
                HandlerError.errorGlobal(error.response)
            })
        })

        const onDataUsuario = (async (value:any) => {
            await ServiceSecurity.getUsuarioSucursal(value)
            .then(({data}) => {
                console.log(data);                
                optionUsuario.value = data
            })
            .catch((error) => {
                HandlerError.errorGlobal(error.response)
            })
        })

        const onDataCargos = (async () => {
            await SrvConfiguration.getListaCargo()
            .then(({data}) => {
                optionCargo.value = data
            })
            .catch((error) => {
                HandlerError.errorGlobal(error.response)
            })
        })

        const onDataMenuPrincipal = (async () => {
            await srvsecurity.getListaMenuPrincipal()
            .then(({data}) => {
                optionMenuPrincipal.value = data
            })
            .catch((error) => {
                HandlerError.errorGlobal(error.response)
            })
        })

        const onDataSubMenu = (async (value:any) => {            
            if(cod_cargo.value.length === 0 || cod_menu_principal.value.length === 0){
                return false;
            }
            isLoadingTable.value = true;
            row.value = []
            await srvsecurity.getListaSubMenu(cod_cargo.value,cod_menu_principal.value)
            .then((response) => {
                let {data,permiso} = response;
              //  console.log(data,permiso);
                data.forEach((e:any) => {
                    let select = false, insert= false,update= false, delet= false,primt= false;
                    if(permiso.length > 0){
                        permiso.forEach((flat:any) => {
                            if(flat.cod_menu === e.cod_menu){
                                if(flat.is_select == 1){
                                    select = true;
                                }
                                if(flat.is_insert == 1){
                                    insert = true;
                                }
                                if(flat.is_update == 1){
                                    update = true;
                                }
                                if(flat.is_delete == 1){
                                    delet = true;
                                }
                                if(flat.is_print == 1){
                                    primt = true;
                                }
                            }
                        });
                    }

                    row.value.push({
                        name: e.cod_menu,
                        menu: e.descripcion_corta,
                        is_select: select,
                        is_insert: insert,
                        is_update: update,
                        is_delete: delet,
                        is_print : primt,                       
                    })
                });
                isLoadingTable.value = false;                
            })
            .catch((error) => {
                isLoadingTable.value = false;
                HandlerError.errorGlobal(error.response)
            })
        })

        const onProcesar = (async () => {
            __onLoading("Un momento, estamos procesando......");
            let newformData = new FormData();
            let permisos:any[] = [];
            row.value.forEach((e:any) => {
                permisos.push({
                    'cod_menu': e.name,
                    'cod_cargo': cod_cargo.value,
                    'is_select': (e.is_select === true ? 1 : 0),
                    'is_insert': (e.is_insert === true ? 1 : 0),
                    'is_update': (e.is_update === true ? 1 : 0),
                    'is_delete': (e.is_delete === true ? 1 : 0),
                    'is_print': (e.is_print === true ? 1 : 0)
                })
            });
           // console.log(permisos)
            newformData.append('permisos',JSON.stringify(permisos));

            await srvsecurity.postGuardarPermisoMenu(newformData)
            .then((rpt) => {
                quasar.loading.hide()
               // console.log(rpt);                
                Swal.fire({icon:'success',title:'Bien echo!',html:rpt.message})
            })
            .catch((error) => {
                quasar.loading.hide()
                HandlerError.errorGlobal(error.response)
            })
        })

        /* EFECTO ONLOADING */
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
            onDataSucursal()
            onDataCargos()
            onDataMenuPrincipal()
            column.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "menu",label: "MENU",align: "left",field: 'menu',sortable: true},
                {name: "is_select",label: "SELECT",align: "left",field: 'is_select',sortable: true},
                {name: "is_insert",label: "INSERT",align: "left",field: 'is_insert',sortable: true},
                {name: "is_update",label: "UPDATE",align: "left",field: 'is_update',sortable: true},
                {name: "is_delete",label: "DELETE",align: "left",field: 'is_delete',sortable: true},
                {name: "is_print",label: "PRINT",align: "left",field: 'is_print',sortable: true},
            ]
        })

        return{
            cod_sucursal, formData, optionSucursal,
            cod_usuario,optionUsuario,cod_cargo,optionCargo,
            cod_menu_principal,optionMenuPrincipal,
            onDataSucursal,onDataUsuario,onDataCargos,
            onDataMenuPrincipal,onDataSubMenu,onProcesar,
            row,column,isLoadingTable,filterdata,visiblecolumns
        }
    }
}

export default appPermiso;