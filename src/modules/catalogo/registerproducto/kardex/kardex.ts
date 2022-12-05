import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import srvProducto from '@/services/mantenimiento/MantenimientoService';
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import moment from "moment";

const appkardex = {
    name:'ListView',
    setup(){
        let onLoading = useQuasar();
        let columns: any = ref([]);
        let rows: any = ref([]);
        let visible = ref(true);
        let filterdata = ref('');
        const router = useRouter();
        let visibleColumns = ['code_barra','titulo_producto','stock_compra','precio_venta_cantidad',
                            'stock_salida','saldos','precio_compra','precio_unitario'];

        const  listData = (() => {
            visible.value=true;
            rows.value = [];
            columns.value =[
                {name: "id",label: "COD.",align: "left",field: (row: { name: any }) => row.name,format: (val: any) => `${val}`,sortable: true},
                {name: "code_barra",label: "COD. BARRA",align: "left",field: "code_barra",sortable: true},
                {name: "titulo_producto",label: "DESCRIPCION DEL PRODUCTO",align: "left",field: "titulo_producto",sortable: true},
                {name: "descripcion_categoria",label: "CATEGORIA",align: "left",field: "descripcion_categoria",sortable: true},
                {name: "descripcion_marca",label: "MARCA",align: "left",field: "descripcion_marca",sortable: true},
                {name: "fecha_compra",label: "FECHA COMPRA",align: "left",field: "fecha_compra",sortable: true},
                {name: "precio_compra",label: "PR. COMPRA",align: "left",field: "precio_compra",sortable: true},
                {name:"stock_compra", label:"INGRESO",align: "left",field: "stock_compra",sortable: true},
                {name: "precio_unitario",label: "PRECIO UNIDAD",align: "left",field: "precio_unitario",sortable: true},
                {name: "precio_venta_cantidad",label: "PRECIO MAYOR",align: "left",field: "precio_venta_cantidad",sortable: true},
                {name: "stock_salida", label: "SALIDA",align: "left",field: "stock_salida",sortable: true},
                {name: "saldos",label: "SALDO",align: "left",field: "saldos",sortable: true},            
                {name: "estado",label: "ESTADO",align: "left",field: "estado",sortable: true},                
            ];

            srvProducto.$srvListdataProducto('KARDEX')
            .then((rpt) => {
                console.log(rpt);                
                for (let i = 0; i < rpt.data.length; i++) {
                    let egreso = 0;
                    egreso =  (rpt.data[i].stock_ingreso - rpt.data[i].stock_egreso);
                    rows.value.push({
                        name: rpt.data[i].cod_producto,
                        code_barra: rpt.data[i].code_barra,
                        titulo_producto: rpt.data[i].nombre_producto,
                        descripcion_categoria: rpt.data[i].descripcion_categoria,
                        descripcion_marca: rpt.data[i].descripcion_marca,
                        stock_compra: rpt.data[i].stock_ingreso,
                        stock_salida: egreso,
                        saldos: rpt.data[i].stock_egreso,
                        precio_compra: formatMoney(rpt.data[i].precio_compra),
                        precio_unitario: formatMoney(rpt.data[i].precio_venta_unidad),
                        estado: rpt.data[i].estado_compra,
                        fecha_compra: moment(rpt.data[i].fecha_compra).format('DD/MM/yyyy'),
                        precio_venta_cantidad: formatMoney(rpt.data[i].precio_venta_cantidad)
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

export default appkardex;