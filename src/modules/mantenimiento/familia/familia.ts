import { ref } from "vue";
import { onMounted } from "vue";
import Swal from "sweetalert2";
import srvFamilia from "../../../services/mantenimiento/MantenimientoService";
import { FamiliaEntity } from "../../../interfaces/IntFamilia";
import { useQuasar } from "quasar";
import HandlerError from "@/services/error/HandlerError";
const appFamilia = {
  name: "ViewFamilia",
  setup() {
    let columns: any = ref([]);
    let rows: any = ref([]);
    let visible = ref(true);
    let onLoading = useQuasar();
    let modelo: FamiliaEntity = {
      cod_familia_cat: 0,
      descripcion_familia: " ",
      estado: true,
    };
    let forData = ref(modelo);
    let $dataError = {descripcion_familia:[]}
    let dataError = ref($dataError);
    let isValidDescription = ref(true);
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
          
          srvFamilia.$srvListaDataFamilia().then((rpt) => {
            if (rpt.status === 200) {
                rows.value = [];
              for (let i = 0; i < rpt.data.length; i++) {
                rows.value.push({
                  name: rpt.data[i].cod_familia_cat,
                  descripcion: rpt.data[i].descripcion_familia,
                  estado: rpt.data[i].estado,
                });
              }
            }
            visible.value = false;
        });
    }

    function OnEdit(id: number) {
        __onLoading('Buscando registro....');
        srvFamilia.$srvObtenerFamilia(id)
        .then((rpt) => {
            onLoading.loading.hide();
            if(rpt.status === 200){
              forData.value = {cod_familia_cat:rpt.data.cod_familia_cat,descripcion_familia:rpt.data.descripcion_familia,estado:(rpt.data.estado === 1 ? true : false)};
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
        srvFamilia.$srvSaveDataFamilia(forData.value)
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
            let status:number = 0;
            const _err = {
                data:{},
                status,
           } = error.response;    
           if(_err.status === 409){
            $dataError = _err.data.data;
            dataError.value = _err.data.data;
            console.log( dataError);
            isValidDescription.value = (_err.data.data.hasOwnProperty('descripcion_familia') == false ? true : false);
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
              srvFamilia.$srvDeleteFamilia(id)          
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
            cod_familia_cat: 0,
            descripcion_familia: " ",
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

    onMounted(() => {
        OnInitData();
    });
    return {
      columns,
      rows,
      visible,
      forData,
      dataError,
      isValidDescription,
      filterdata,
      OnInitData,
      OnEdit,
      OnCreate,
      OnDelete,
      onReset
    };
  },
};

export default appFamilia;