import { onBeforeMount, onMounted, ref } from "vue";
import srvProducto from '@/services/operation/ProductService';
import srvCaja from '@/services/operation/CajaService';
import Swal from "sweetalert2";
import HandlerError from "@/services/error/HandlerError";


const appProduct = {    
    emits: ['addCard'],
    setup() {
        let isModalCatalogo = ref(false), isLoadingTable = ref(true), bloquedBtn = ref(false);
        let rows:any = ref([]), columns:any = ref([]);
        let filterdata = ref('')

        const getCatalogo = ( async () => {
            isLoadingTable.value = true;
            rows.value = [];
            await srvProducto.getCatalogoProducto('KARDEX')
            .then((rpt) => {
               //console.log(rpt.data);
                for (let i = 0; i < rpt.data.length; i++){
                    let tallas:any[] = [];
                   /*  rpt.data[i].tallas.forEach((element:any) => {
                        if(element.cantidad > 0){
                            tallas.push({label:element.talla,value: element.cod_talla,stock:element.cantidad})
                        }  rpt.data[i].cod_compra
                    }); */
                    rows.value.push({
                        name: rpt.data[i].cod_producto,
                        cod_compra: 0,
                        producto: rpt.data[i].nombre_producto + ' ' + rpt.data[i].descripcion_corta,
                        sotck: rpt.data[i].stock_egreso,
                        presentacion: tallas,
                        preciounitario: rpt.data[i].precio_venta_unidad,
                        preciomayor: rpt.data[i].precio_venta_cantidad,
                        cantidad: 1,
                        cantidad_venta_mayor:rpt.data[i].cantidad_venta_mayor
                    });
                }
                isLoadingTable.value = false;
            })
            .catch(error => {
                console.log(error);                
                HandlerError.errorGlobal(error.response);
            });

            
        });

        const openComponet = (() => {
            isModalCatalogo.value= true;
           // getCatalogo();
        });

        const validCaja = (async() => {
           await srvCaja.srvEstadoCaja()
            .catch((e) => {
                let err = e.response;

                if(err.status === 409){
                    Swal.fire({icon:'warning', text:err.data.message, title: 'Upps!'});
                    isModalCatalogo.value = false;
                    bloquedBtn.value=true;
                }else{
                    Swal.fire({icon:'error', text:err, title: 'Error!'})
                }
            })
        })

        onBeforeMount(() => {
            getCatalogo();
        })
        
        onMounted( () => {
            
            columns.value = [
                {name:'id',label:'#',align: "left",field: (row: { name: any }) => row.name},
                {name: "producto",label: "Producto", field: "producto", align: "left"},
                {name: "sotck",label: "Stock", field: "sotck", align: "left"},
                {name: "presentacion",label: "Presentación", field: "presentacion", align: "left",style:'50px'},
                {name: "istalla",label: "istalla", field: "istalla", align: "left"},
                {name: "preciounitario",label: "Pre. Unid", field: "preciounitario", align: "left"},
                {name: "preciomayor",label: "Pre. x Mayor", field: "preciomayor", align: "left"},
                {name: "cantidad",label: "Cantidad", field: "cantidad", align: "left"}
            ]
            validCaja();
            //getCatalogo();                       
        })

        return{
            isModalCatalogo, getCatalogo,isLoadingTable,bloquedBtn,
            rows, columns,openComponet,filterdata
        }
    }
}

export default appProduct;