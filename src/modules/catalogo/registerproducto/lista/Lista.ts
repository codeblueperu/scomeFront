import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import srvProducto from '@/services/mantenimiento/MantenimientoService';
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const appLista = {
    name:'ListView',
    setup(){
        let onLoading = useQuasar();
        let columns: any = ref([]);
        let rows: any = ref([]);
        let visible = ref(true);
        let filterdata = ref('');
        const router = useRouter();
        let visibleColumns = ['code_barra','titulo_producto','stock','precio_unitario','precio_compra'];

        const  listData = (() => {
            visible.value=true;
            rows.value = [];
            columns.value =[
                {name: "id",label: "COD.",align: "left",field: (row: { name: any }) => row.name,format: (val: any) => `${val}`,sortable: true},
                {name: "code_barra",label: "COD. BARRA",align: "left",field: "code_barra",sortable: true},
                {name: "titulo_producto",label: "PRODUCTO | CATEGORIA | MARCA",align: "left",field: "titulo_producto",sortable: true},
                {name: "descripcion_categoria",label: "CATEGORIA",align: "left",field: "descripcion_categoria",sortable: true},
                {name: "descripcion_marca",label: "MARCA",align: "left",field: "descripcion_marca",sortable: true},
                {name:"stock_compra",label:"STOCK INGRESO",align: "left",field: "stock_compra",sortable: true},
                {name: "stock",label: "STOCK",align: "left",field: "stock",sortable: true},
                {name: "precio_compra",label: "PREC. COMPRA",align: "left",field: "precio_compra",sortable: true},
                {name: "precio_unitario",label: "PREC. VENTA",align: "left",field: "precio_unitario",sortable: true},
                {name: "estado",label: "ESTADO",align: "left",field: "estado",sortable: true},                
            ];

            srvProducto.$srvListdataProducto('2')
            .then(({data}) => {
                console.log(data);                
                for (let i = 0; i < data.length; i++) {
                    rows.value.push({
                        name: data[i].cod_compra,
                        code_barra: data[i].code_barra,
                        titulo_producto: data[i].nombre_largo_producto, 
                        descripcion_categoria: data[i].descripcion_categoria,
                        descripcion_marca: data[i].descripcion_marca,
                        stock_compra: data[i].stock_ingreso,
                        stock: data[i].stock_egreso,
                        precio_compra: formatMoney(data[i].precio_compra),
                        precio_unitario: formatMoney(data[i].precio_venta_unidad),
                        estado: data[i].estado_compra,
                    });
                }
                visible.value=false;
            })

        });

        const OnEdit = ((code:number) => {
            router.push({name:'addedit',params:{id:code}})
        });

        const OnDelete = ((code:number) => {
            Swal.fire({icon:'warning',title:'SCOME',text:'Estimado usuario, por el momento la función eliminar se encuentra en mantenimiento.'})
        });

        const formatMoney = function(number:number){
            return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
        };

        onMounted(() => {
            listData()
        });

        function __onLoading(message:string){
            onLoading.loading.show({
                html:true,
                message: '<b class="fm-poppis">'+message+'</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        }

        return {
            columns,rows,visible,filterdata,
            OnEdit,OnDelete,visibleColumns
        }
    }
}

export default appLista;