import { ref } from "vue";
import productService from "@/services/operation/ProductService";
import { useQuasar } from "quasar";

const componentAddProductQR = {
    emits: ['productocodbarra'],
    setup(props:any, context:any){

        const quasar = useQuasar();
        let codigobarra = ref();
        let loadingproducto = ref(false);
        

        const searchsProducto = ( () => {
            console.log(codigobarra.value);  
           // e.preventDefault()
          /*  if(e.target.value.length < 3){
                return false;
           }   */
           
           loadingproducto.value= true;
             productService.addCodigoBarraFilter(codigobarra.value)
            .then(({data}) => {  
                codigobarra.value = '';
                let tallas:any[] = [];
                /* data.tallas.forEach((element:any) => {
                    if(element.cantidad > 0){
                        tallas.push({label:element.talla,value: element.cod_talla,stock:element.cantidad})
                    } data.cod_compra
                } ); */

                let json = {
                    name: data.cod_producto,
                    cod_compra: 0,
                    producto: data.nombre_producto + ' ' + data.descripcion_corta,
                    sotck: data.stock_egreso,
                    presentacion: tallas,
                    preciounitario: data.precio_venta_unidad,
                    preciomayor: data.precio_venta_cantidad,
                    cantidad: 1,
                    cantidad_venta_mayor:data.cantidad_venta_mayor
                }
                context.emit('productocodbarra',json);
                loadingproducto.value = false;           
            })
            .catch((err) => {
                loadingproducto.value = false;  
                const {data, status} = err.response;
                if(status === 404){
                    onNotification("negative","top-right",4000,data.message);
                }else{
                    onNotification("negative","bottom-right",1000,data.message);
                }
                codigobarra.value = '';
                console.log(err);
                
            });            
        });

        const onNotification = (
            type: string,
            position: any,
            time: number,
            message: string
          ) => {
            quasar.notify({
              progress: true,
              type: type,
              position: position,
              timeout: time,
              message: message,
            });
          };

        return {
            codigobarra,searchsProducto,loadingproducto
        }
    }
}

export default componentAddProductQR;