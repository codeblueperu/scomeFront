import { ref } from "vue";
import { onMounted } from "vue";
import Swal from "sweetalert2";
import srvCategoria from "../../../services/mantenimiento/MantenimientoService";
import { useQuasar } from "quasar";
import { CategoriaEntity } from "../../../interfaces/IntCategoria";
import HandlerError from "@/services/error/HandlerError";
const appCategoria = {
  name: "ViewCategoria",
  setup() {
    let columns: any = ref([]);
    let rows: any = ref([]);
    let visible = ref(true);
    let onLoading = useQuasar();
    let options:any = ref([]);
    let modelo: CategoriaEntity = {
      cod_categoria: 0,
      cod_familia_cat:'',
      descripcion_categoria: " ",
      estado: true,
    };
    let forData = ref(modelo);
    let $dataError = {descripcion_categoria:[],cod_familia_cat:[]}
    let dataError = ref($dataError);
    let isValidDescription = ref(true);
    let isValidCofFamilia = ref(true);
    let filterdata = ref('');

    function OnInitData(){
        visible.value=true
        columns.value = [
            {
              name: "id",
              label: "COD.",
              align: "left",
              field: (row: { name: any }) => row.name,
              format: (val: any) => `${val}`,
              sortable: true,
            },
            {
              name: "descripcion_familia",
              label: "Familia",
              field: "descripcion_familia",
              align: "left",
              sortable: true,
            },
            {
              name: "descripcion",
              label: "Descripcion",
              field: "descripcion",
              align: "left",
              sortable: true,
            },
            {
              name: "estado",
              label: "Estado",
              field: "estado",
              align: "left",
              sortable: true, 
            },
          ];
          
          srvCategoria.$srvListaDataCategoria().then((rpt) => {
            if (rpt.status === 200) {
                rows.value = [];
              for (let i = 0; i < rpt.data.length; i++) {
                rows.value.push({
                  name: rpt.data[i].cod_categoria,
                  descripcion_familia:rpt.data[i].familia.descripcion_familia,
                  descripcion: rpt.data[i].descripcion_categoria,
                  estado: rpt.data[i].estado,
                });
              }
            }
            visible.value = false;
        });
    }

    async function OnDataFamilia(){
       await srvCategoria.$srvListaDataFamilia()
        .then((rpt) => {
            if(rpt.status === 200){
              options.value = rpt.data;
            }
        })
    }

    function OnEdit(id: number) {
        __onLoading('Buscando registro....');
        srvCategoria.$srvObtenerCategoria(id)
        .then((rpt) => {
            onLoading.loading.hide();
            if(rpt.status === 200){
              forData.value = {cod_categoria:rpt.data.cod_categoria,
                cod_familia_cat:rpt.data.familia.cod_familia_cat
                ,descripcion_categoria:rpt.data.descripcion_categoria,estado:(rpt.data.estado === 1 ? true : false)};
            }
        })
        .catch((error) => {
          HandlerError.errorGlobal(error.response);
      })
    }

    function OnCreate() {
        __onLoading('Procesando, espere....');
        dataError.value = $dataError;
        isValidDescription.value = true;
        isValidCofFamilia.value = true;
        srvCategoria.$srvSaveDataCategoria(forData.value)
        .then((rpt) => {                 
            if (rpt.status === 200) {
                onLoading.loading.hide();
                onReset();
                OnInitData();
                Swal.fire({
                    icon: 'success',
                    text:  rpt.message,
                    confirmButtonColor: '#2b3344',
                });
            }
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
              isValidDescription.value = (_err.data.data.hasOwnProperty('descripcion_categoria') == false ? true : false);
              isValidCofFamilia.value = (_err.data.data.hasOwnProperty('cod_familia_cat') == false ? true : false);
          }else{
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
              srvCategoria.$srvDeleteCategoria(id)          
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
        forData.value =  {
            cod_categoria: 0,
            cod_familia_cat:'',
            descripcion_categoria: " ",
            estado: true,
        };
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
          OnDataFamilia();
          //options.value = options.value;
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        options.value = options.value.filter((v:any) => v.descripcion_familia.toLowerCase().indexOf(needle) > -1)
      })
    }

    onMounted(() => {
        OnInitData();
        OnDataFamilia();
    });

    return {
      columns,
      rows,
      visible,
      forData,
      dataError,
      isValidDescription,isValidCofFamilia,
      filterdata,
      options,
      OnInitData,
      OnDataFamilia,
      OnEdit,
      OnCreate,
      OnDelete,
      onReset,
      filtrarData
    };
  },
};

export default appCategoria;