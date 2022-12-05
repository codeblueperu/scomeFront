import { Colores, Producto, Tallas , DataErrorProducto, FichaTecnica} from "@/interfaces/IntProducto";
import { onMounted, ref } from "vue";
import srvProducto from '@/services/mantenimiento/MantenimientoService';
import moment from 'moment'
import { useQuasar } from "quasar";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import productService from '@/services/operation/ProductService';
import HandlerError from "@/services/error/HandlerError";

const appAdd = {
  name: "ViewAdd",
  components:{

  },
  props:{
    id:String
  },
  setup(props:any) {
    let now = moment(new Date()).format('yyyy-MM-DD');
    let onLoading = useQuasar();
    const router = useRouter();
    let modelo: Producto = {
      code_barra: "",titulo_producto: "",descripcion_corta: "",cod_producto:0,
      cod_categoria: "---: SELECCIONE :---",cod_marca: "---: SELECCIONE :---",stock: 1,
      estado: true,fecha_caduca:now ,fecha_compra: now,
      fecha_elaboracion: now,numero_lote: "",precio_compra: 0.0,precio_mayor: 0.0,precio_unitario: 0.0,
      cantidad_venta_mayor:100,stock_egreso:0
    };
    let formData = ref(modelo), modeloTalla: Tallas = {cantidad:1,cod_producto:0,talla:'',estado:true};
    let formDataTalla = ref(modeloTalla), modeloColor: Colores = {cod_producto:0,color:'#333333',cantidad:1,estado:true};
    let formDataColor = ref(modeloColor);
    let cbocodfamilia = ref("---: SELECCIONE :---");
    let optionsFamilia:any = ref([]) , optionscategoria:any = ref([]), optionmarcas = ref([]);
    let openModalFicha = ref(false);
    let modeloFicha:FichaTecnica = {cod_ficha:0,body_ficha:'Sin contenido'}, descripcionFicha = ref(modeloFicha);
    let colores:Colores[] = [], listColores = ref(colores);
    let talla:Tallas[] = [], listTallas = ref(talla);
    let isdense = ref(false);
    const files = ref([]);
    let $error:DataErrorProducto = {};
    let dataError = ref($error);
    dataError.value.titulo_producto =[(val: string | null) => (val?.length !== null && val !== '') || 'Ingrese un máximo de 30 caracteres'];
    let action = ref('INSERT');
    let disable = ref(true);

    /* CREAMOS LAS REGLAS DE VALIDACION */
    let validations = [
      [ (val:any) => val.length <= 25 || 'Ingrese máximo 12 digitos'],
      [ (val:any) => val.length > 2 || 'Ingrese minimo 3 caracteres ', (val:any) => val.length <= 30 || 'Ingrese un máximo de 30 caracteres'],
      [ (val:any) => val.length <= 60 || 'Ingrese un máximo de 60 caracteres'],
      [ (val:any) => val  !== "---: SELECCIONE :---" || 'Este campo es requerido'],
      [ (val:any) => val > -1 || 'El Stock no puede ser menor a 0 ó vacio'],
      [ (val:any) => val.length <= 10 || 'Ingrese máximo 10 digitos'],
    ];

    /* GUARDAR Y EDITAR */
    function onSave() {
      __onLoading('Procesando, espere....');  

      let newformData = new FormData(); 
      newformData.append('producto',JSON.stringify(formData.value));
      for (let x = 0; x < files.value.length; x++) {
        newformData.append('images[]',files.value[x]);
      }      
      newformData.append('tallas',JSON.stringify(listTallas.value));
      newformData.append('colores',JSON.stringify(listColores.value));
      newformData.append('fichaproducto',JSON.stringify(descripcionFicha.value));
      
      srvProducto.$srvSaveDataproducto(newformData,formData.value.cod_producto,action.value)
      .then((rpt) => {
        //console.log(rpt);
        
        onLoading.loading.hide();        
        let msg = rpt.message;
        onClear();
        Swal.fire({
          icon: 'success',
          title:'Excelente!',
          text:  msg,
          confirmButtonColor: '#2b3344',
        });
        router.push({name:'add'})        
      })
      .catch((err) => {
        let status:number = 0;
        const _err = {
          data:{},
          status,
        } = err.response;  
        onLoading.loading.hide();        
        console.log(err);  
        if(_err.status === 409) {
          Swal.fire({icon:'warning', title:'Upps!', html: _err.data.message});
        }else{
          HandlerError.errorGlobal(err.response)
        }
            
      })
    }

    /* LIMPIAR TODO */
    function onClear() {
      formData.value = {
        code_barra: "",titulo_producto: "",descripcion_corta: "",cod_producto:0,
        cod_categoria: "---: SELECCIONE :---",cod_marca: "---: SELECCIONE :---",stock: 1,
        estado: true,fecha_caduca:now ,fecha_compra: now,
        fecha_elaboracion: now,numero_lote: "",precio_compra: 0.0,precio_mayor: 0.0,precio_unitario: 0.0,
        cantidad_venta_mayor:100,stock_egreso:0
      };  
      cbocodfamilia.value = "---: SELECCIONE :---";
      listColores.value = [];  
      listTallas.value = [];   
      descripcionFicha.value.body_ficha="";
      files.value = [];
      action.value ='INSERT';
    }

    /* BUSCAR PRODUCTO COD-BARRA */
    const onKeyBuscarProducto = (async (e:any) => {
      if(e.which == 13){
        __onLoading("Buscando producto......");
          await productService.searchproductocodigobarra(formData.value.code_barra)
          .then(({data}) => {
            console.log(data.categoria);
          onChangeCategoria(data.categoria.cod_familia_cat);
          onchageMarca(data.categoria.cod_categoria);
          cbocodfamilia.value = data.categoria.cod_familia_cat;        
          formData.value.cod_marca=data.marca.cod_marca;
          formData.value.cod_categoria = data.categoria.cod_categoria;
          formData.value.cod_producto = data.cod_producto;
          formData.value.descripcion_corta = data.descripcion_corta;
          formData.value.titulo_producto=data.nombre_producto;
          onLoading.loading.hide();
          action.value ='INSERT';
          })
          .catch((error) => {
            onLoading.loading.hide();
            HandlerError.errorGlobal(error.response)
          })
      }
    });

    /* LISTA DATA CATEGORIA */
    async function onChangeCategoria(codigo:any){
      optionscategoria.value = []; 
      formData.value.cod_categoria = "---: SELECCIONE :---";
      optionmarcas.value = [];
      formData.value.cod_marca = "---: SELECCIONE :---";

      await srvProducto.$srvListaFamiliaCategoria(codigo).then((rpt) => {              
        optionscategoria.value = rpt.data;        
      })
    }

    /* ADD COLOR INPUT*/
    function addColor(color:string,cantidad:number){
      if(color.length > 0 && cantidad > 0){
        for (let i = 0; i < listColores.value.length; i++) {
          if(listColores.value[i].color === color){
            return
          }                      
        }
        listColores.value.push({cod_color:0,color:color,cantidad:cantidad,estado:true});
      }
      formDataColor.value.cantidad = 1;   formDataColor.value.color='#333333'   
    }

    /* ADD TALLA INPUT */
    function addTalla(talla:string,cantidad:number){
      if(talla.length > 0 && cantidad > 0){
        for (let i = 0; i < listTallas.value.length; i++) {
          if(listTallas.value[i].talla === talla){
            return;
          }          
        }      
        listTallas.value.push({cod_talla:0,talla:talla,cantidad:cantidad,estado:true});             
      }
      formDataTalla.value.talla=''; formDataTalla.value.cantidad=1;
    }

    /* ELIMINAR COLOR INPUT */
    function deleteColor(color:string){
      listColores.value = listColores.value.filter((item) => item.color !== color );
    }
    /* ELIMINAR TALLA INPUT */
    function deleteTalla(talla:string){
      listTallas.value = listTallas.value.filter((item) => item.talla !== talla );
    }

    /* EFECTO ONLOADING */
    function __onLoading(message:string){
      onLoading.loading.show({
          html:true,
          message: '<b class="fm-poppis">'+message+'</b>',
          boxClass: 'bg-grey-2 text-grey-9',
          spinnerColor: 'primary',
          customClass:'fm-poppis'
      })
    }

    /* LISTA MARCA */
    async function onchageMarca(codcategoria:any){
      optionmarcas.value = [];
      await srvProducto.$srvListaDataMarcaCategoria(codcategoria).then((rpt) => {
        optionmarcas.value = rpt.data;
      });
    }

    /* LSIAT FAMILIA DATA */
    const onDataFamilia = (async () => {
      await srvProducto.$srvListaDataFamilia().then((resp) => {
        optionsFamilia.value = resp.data;
      });
    });

    /* FILTRAR FAMILIA */
    const filtrarFamilia =  (val:any, update :any, abort:any) => {
      setTimeout(() => {
        update(() => {
          if (val === '') {
            onDataFamilia();
          }
          else {
            const needle = val.toLowerCase()
            optionsFamilia.value = optionsFamilia.value.filter((v:any) => v.descripcion_familia.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 300)
    }
    
    /* FILTRAR CATEGORIA */
    const filtrarCategoria =  (val:any, update :any, abort:any) => {
      setTimeout(() => {
        update(() => {
          if (val === '') {
            onChangeCategoria(cbocodfamilia.value);
          }
          else {
            const needle = val.toLowerCase()
            optionscategoria.value = optionscategoria.value.filter((v:any) => v.descripcion_categoria.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 400)
    }

    onMounted(() => {

      onDataFamilia();

      if(props.id){
        __onLoading("Cargando datos, un momento...");
        srvProducto.$srvBuscarProductoID(props.id)
        .then((rpt) => {
          let {data} = rpt;
        // console.log(rpt)
          onChangeCategoria(data.cod_familia_cat);

          onchageMarca(data.cod_categoria);
          cbocodfamilia.value = data.cod_familia_cat;        
          formData.value.cod_marca=data.cod_marca;
          formData.value.cod_categoria = data.cod_categoria;
          formData.value.cod_producto = data.cod_compra;
          formData.value.code_barra=data.code_barra;
          formData.value.descripcion_corta = data.descripcion_corta;
          formData.value.estado = (data.estado_compra === "1" ? true : false);
          formData.value.fecha_caduca = data.fecha_caduca;
          formData.value.fecha_compra = data.fecha_compra;
          formData.value.fecha_elaboracion = data.fecha_elaboracion;
          formData.value.numero_lote = data.numero_lote;
          formData.value.precio_compra = data.precio_compra;
          formData.value.precio_mayor = data.precio_venta_cantidad;
          formData.value.precio_unitario = data.precio_venta_unidad;
          formData.value.cantidad_venta_mayor = data.cantidad_venta_mayor;
          formData.value.stock = data.stock_ingreso;
          formData.value.stock_egreso = data.stock_egreso;
          formData.value.titulo_producto=data.nombre_producto;
          listColores.value = rpt.colores;
          listTallas.value = rpt.tallas;
          descripcionFicha.value = (rpt.ficha === null ? modeloFicha : rpt.ficha);
          onLoading.loading.hide();
          action.value ='UPDATE';
          disable.value=false
         // console.log(listColores.value)
        })
        .catch((error) => {
          HandlerError.errorGlobal(error)
        });
      }

    });
    

    return {
      formData,
      formDataTalla,isdense,
      formDataColor,listColores,listTallas,deleteTalla,
      cbocodfamilia,openModalFicha,descripcionFicha,
      optionsFamilia,optionscategoria,optionmarcas,
      files,dataError,validations,disable,
      onSave,addColor,addTalla,deleteColor,
      onClear,onChangeCategoria,onchageMarca,
      filtrarFamilia,filtrarCategoria,
      onKeyBuscarProducto,
      preview(file:any){
        return URL.createObjectURL(file)
      }
    };
  },
};

export default appAdd;
