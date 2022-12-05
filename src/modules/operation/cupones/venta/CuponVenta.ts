import moment from "moment";
import { onMounted, ref, Ref } from "vue";
import srvProducto from '@/services/operation/ProductService';
import Swal from "sweetalert2";

const appCuponVenta = {
   setup(){
    let fechaActual = moment(new Date()).format('yyyy-MM-DD');
    let anteriofecha = moment(new Date()).add(-2,'M').format('yyyy-MM-DD');
    let numeroCupo:Ref<string> = ref(''), montoDescuento:Ref<number> = ref(0), cod_descuento = ref(0), cod_usuario = ref(''),
    fechaExpira:Ref<any> = ref(fechaActual), limiteVenta:Ref<number> = ref(0), estado:Ref<boolean> = ref(true);
    let row = ref(), column = ref(),isLoadingTable = ref(false), filterdata = ref('');

    let fechainicio = ref(anteriofecha);       
    let fechafin = ref(moment(new Date()).add(2,'M').format('yyyy-MM-DD'));
    
    /* GUARDAMOS CUPON DE DESCUENTO */
    const saveCupon = (async () => {
        const json = {
            numero_cupon:numeroCupo.value,
            monto_descuento:montoDescuento.value,
            fecha_expiracion:moment(fechaExpira.value).format('yyyy-MM-DD'),
            stock:limiteVenta.value,
            estado:estado.value,
            cod_descuento:cod_descuento.value,
            cod_usuario:cod_usuario.value
        }        
        srvProducto.postCuponVenta(json)
        .then((response) => {
            listaData();
            limpiar();
           Swal.fire({icon:"success",title:"Excelente!",html:"El numero de cupon <b>" + response.data.numero_cupon + "</b> fue registrado con éxito."})  
        })
        .catch(({response}) => {
            const _er = response.data.errors
            console.log(response)
            if(response.status === 409){
                const campos = ['numero_cupon','monto_descuento','fecha_expiracion','stock','estado'];
                campos.forEach((item:any) => {
                    if(_er.hasOwnProperty(item)){    
                        Swal.fire({icon:"error",text: _er[item][0]});
                        return;                    
                    }               
                })  
            }else{
                console.log(_er)
            }
                                  
        })
    });

    /* LISTAR MIS CUPONES */
    const listaData =  (async () =>{
        isLoadingTable.value = true;
        row.value = [];
       await srvProducto.getListaCupones(fechainicio.value,moment(fechafin.value).add(2,'M').format('yyyy-MM-DD'))
         .then((rpt) => {
            isLoadingTable.value = false;
            rpt.data.forEach((el:any) => {
                row.value.push({
                    name: el.cod_descuento,
                    numero_cupon: el.numero_cupon,
                    monto_descuento: formatMoney(el.monto_descuento),
                    fecha_expiracion: moment(el.fecha_expiracion).format('DD/MM/yyyy'),
                    stock: el.stock,
                    estado: el.estado
                })
            });
         }).catch(({response}) => {
            isLoadingTable.value = false;
            console.log(response);     
         });
    });

    /* EDITAMOS EL CUPON */
    const OnEdit = (async (id:any) => {
        await srvProducto.getCuponVentaID(id)
        .then((rpt) => {
            numeroCupo.value = rpt.data.numero_cupon,
            montoDescuento.value = rpt.data.monto_descuento,
            fechaExpira.value = moment(rpt.data.fecha_expiracion).format('yyyy-MM-DD'),
            limiteVenta.value = rpt.data.stock,
            estado.value = (rpt.data.estado === 1 ? true : false),
            cod_descuento.value = rpt.data.cod_descuento,
            cod_usuario.value = rpt.data.cod_usuario

            console.log(rpt);            
        })
    });

    /* ELIMINAMOS CUPON */
    const OnDelete = ((id:any) => {
        Swal.fire({
            title: 'Estas seguro de eliminar este registro?',
            text: "una vez eliminado no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
                srvProducto.getEliminarCuponVenta(id)
                .then((rpt) => {
                    listaData();
                    console.log(rpt);    
                    Swal.fire(
                        'Muy Bien!',
                        rpt.message,
                        'success'
                      );        
                })              
            }
        });        
    })

    /* FORMATO E DE MONEDA */
    const formatMoney = function(number:number){
        return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
    };

    /* LIMPIAR CAJAS */
    const limpiar = () => {
        numeroCupo.value ='';
        montoDescuento.value = 0,
        fechaExpira.value = moment(new Date()).format('yyyy-MM-DD');
        limiteVenta.value = 0;
        estado.value = false;
        cod_descuento.value = 0
        cod_usuario.value = ''
    }
    /* INICIAMOS DATOS INIT */
    onMounted( () => {
        column.value = [
            {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
            {name: "numero_cupon",label: "N° CUPON",align: "left",field: 'numero_cupon',sortable: true},
            {name: "monto_descuento",label: "MONTO DESCUENTO",align: "left",field: 'monto_descuento',sortable: true},
            {name: "fecha_expiracion",label: "FECHA EXPIRACIÓN",align: "left",field: 'fecha_expiracion',sortable: true},
            {name: "stock",label: "STOCK",align: "left",field: 'stock',sortable: true},
            {name: "estado",label: "ESTADO",align: "left",field: 'estado',sortable: true},
        ];
        listaData();
    });

    return {
        numeroCupo,montoDescuento,fechaExpira,limiteVenta,estado,
        row,column,isLoadingTable,filterdata,
        saveCupon,OnEdit,OnDelete,listaData,fechainicio, fechafin
    }
   }
}

export default appCuponVenta;