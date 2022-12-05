import { useQuasar } from "quasar";
import { onMounted, Ref, ref } from "vue";
import srvMarca from '@/services/mantenimiento/MantenimientoService'
import { MarcaEntity } from "@/interfaces/IntMarca";
import Swal from "sweetalert2";
import HandlerError from "@/services/error/HandlerError";

const appMarca = {
    name:'ViewMarca',
    setup(props:any) {
        let columns:any = ref([]);
        let rows:any = ref([]);
        let visibleLoading = ref(true);
        let onLoading = useQuasar();
        let filterdata = ref('');
        let fileLogo= ref(null);
        let modelo:MarcaEntity = {cod_marca:0,descripcion_marca:'',logo:null,cod_categoria:''}, formData = ref(modelo);
        let $dataError = {descripcion_marca:[],logo:[],cod_categoria:[]}, dataError = ref($dataError);
        let isValidaMarca = ref(true), isValidLogo = ref(true), isValidCocategoria = ref(true);
        let options:any = ref([]);

        function OnInitData(){
            visibleLoading.value = true;
            columns.value = [{name: "id",label: "COD.",align: "left",field: (row: { name: any }) => row.name,format: (val: any) => `${val}`,sortable: true},
            {name: "categoria",label: "Categoria",field: "categoria",align: "left",sortable: true},
            {name: "descripcion_marca",label: "Descripcion Marca",field: "descripcion_marca",align: "left",sortable: true},
            {name: "logo",label: "Logo",field: "logo",align: "left",sortable: true}
            ]

            srvMarca.$srvListaDataMarca()
            .then((rpt) => {
                console.log(rpt);
                    rows.value = [];
                    for (let i = 0; i < rpt.data.length; i++) {
                        rows.value.push({
                          name: rpt.data[i].cod_marca,
                          categoria:rpt.data[i].categoria.descripcion_categoria,
                          descripcion_marca:rpt.data[i].descripcion_marca,
                          logo: rpt.data[i].urlLogo,
                        });
                    }
                visibleLoading.value = false;
            })
        }

        async function OnDataCategoria(){
           await srvMarca.$srvListaDataCategoria()
            .then((rpt) => { 
                if(rpt.status === 200){
                  options.value = rpt.data;
                }
            })
        }
        
        function OnEdit(id: number) {
            __onLoading('Buscando registro....');
            srvMarca.$srvObtenerMarca(id)
            .then((rpt) => {
                onLoading.loading.hide();
                formData.value = {cod_marca:rpt.data.cod_marca
                    ,descripcion_marca:rpt.data.descripcion_marca,logo:rpt.data.logo,cod_categoria: rpt.data.cod_categoria};
                
            })
            .catch((error) => {
                HandlerError.errorGlobal(error.response);
            })
        }

        function OnCreate() {
            __onLoading('Procesando, espere....');
            dataError.value = $dataError;
            isValidaMarca.value = true;
            isValidLogo.value = true; 
            isValidCocategoria.value = true;           
            srvMarca.$srvSaveDataMarca(formData.value)
            .then((rpt) => {                 
                
                    onLoading.loading.hide();
                    onReset();
                    OnInitData();
                    Swal.fire({
                        icon: 'success',
                        text:  rpt.message,
                        confirmButtonColor: '#2b3344',
                    });
                
            })
            .catch((error) => {
                onLoading.loading.hide();
                console.log(error);   
                let status:number = 0;
                    const _err = {
                        data:{},
                        status,
                } = error.response;    
                if(_err.status === 409){
                    $dataError = _err.data.data;
                    dataError.value = _err.data.data;
                    console.log( dataError);
                    isValidaMarca.value = (_err.data.data.hasOwnProperty('descripcion_marca') == false ? true : false);
                    isValidLogo.value = (_err.data.data.hasOwnProperty('logo') == false ? true : false);
                    isValidCocategoria.value = (_err.data.data.hasOwnProperty('cod_categoria') == false ? true : false);
                } else{
                    HandlerError.errorGlobal(error.response);
                }  
            })
        }

        function OnDelete(id:number){
            Swal.fire({
                title: 'Estas seguro de eliminar este Item?',
                text: "una vez eliminado  no podra recuperarlo!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7b1fa2',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    __onLoading('Eliminado registro....');
                srvMarca.$srvDeleteMarca(id)          
                .then((rpt) => {
                    onLoading.loading.hide();
                    if (rpt.status === 200) {
                        OnInitData();
                        Swal.fire(
                            'Excelente!',
                            rpt.message,
                            'success'
                        )
                    }                
                }).catch((error) => {    
                    HandlerError.errorGlobal(error.response);  
                    onLoading.loading.hide();     
                })
                
                }
            })
        }

        function onReset(){
            formData.value =  {
                cod_marca: 0,
                descripcion_marca: " ",
                logo: null,
                cod_categoria:''
            };
            formData.value.logo=null;
            isValidaMarca.value = true;
            isValidLogo.value = true;
            fileLogo.value = null
        }

        function __onLoading(message:string){
            onLoading.loading.show({
                html:true,
                message: '<b class="fm-poppis">'+message+'</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        }

        /* FILTRAR CBO DATA*/
        const filtrarData =  (val:any, update:any) => {
            if (val === '') {
                update(() => {
                   OnDataCategoria();
                })
                return
            }
    
            update(() => {
            const needle = val.toLowerCase()
            options.value = options.value.filter((v:any) => v.descripcion_categoria.toLowerCase().indexOf(needle) > -1)
            })
        }
        
        const abortFilterFn =  () =>{
            // console.log('delayed filter aborted')
          }

        onMounted(() => {
            OnInitData();
            OnDataCategoria();
        })

        return {
            columns,
            rows,
            visibleLoading,
            filterdata,
            dataError,
            formData,
            isValidaMarca,
            isValidLogo,
            isValidCocategoria,
            options,
            OnEdit,
            OnCreate,
            OnDelete,
            onReset,
            OnDataCategoria,
            fileLogo,
            filtrarData,abortFilterFn
        }
    }
}

export default appMarca;