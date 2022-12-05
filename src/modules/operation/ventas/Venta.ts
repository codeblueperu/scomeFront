import { onMounted, Ref, ref } from "vue";
import { useQuasar } from "quasar";
import BuscarProductoQR from "@/components/searchs/addproducto/BuscarProductoQR.vue";
import AdelantoComp from "@/components/alerts/adelantoModal/AdelantoComp.vue";
import OtherProductComp from '@/components/alerts/addotherproducto/OtherProductComp.vue'
import ProductComponent from '@/components/tablas/productos/ProductComponent.vue';
import srvProducto from '@/services/operation/ProductService';
import srvTipoPago from '@/services/operation/TipoPagoService';
import srvVenta from "@/services/operation/VentaService";
import srvReporte from "@/services/report/VentaReporteService";
import Swal from "sweetalert2";
import moment from "moment";
import HandlerError from "@/services/error/HandlerError";

const appVenta = {
  name: "Ventaview",
  props: ["addCard"],
  components: {
    ProductComponent,
    BuscarProductoQR,
    AdelantoComp,
    OtherProductComp
  },
  setup() {
    const quasar = useQuasar();
    
    let dniCliente = ref(),codCliente = ref(),
      numeroCupon = ref(), montocreditoadelanto = ref();
    let isdense = ref(true);
    let otionPago = [
      { label: "Cash", value: 1 },
      { label: "Credito", value: 2 },
      { label: "Otros medios", value: 0 },
    ];
    let bntpago = ref(1);
    let montoventa = ref(),montoIGV = ref(),montoTotal = ref(),montoDescuento = ref();
    let _montoventa = ref(),_montoIGV = ref(),_montoTotal = ref(),_montoDescuento = ref(0);
    let rows: any = ref([]),
      columns: any = ref([]),
      isLoadingTable = ref(true);

    let modaltipoPago = ref(false);
    let rowsPago: any = ref([]),
      columnsPago: any = ref([]);

    let compadelantoinput = ref(AdelantoComp);
    let compotherproducto = ref(OtherProductComp);

    let mdlcalcula = ref(false);
    let montoPaga:Ref<string> = ref('');
    let vuelto:Ref<string> = ref('');

    let mdlproducto = ref(ProductComponent);
    let habilitarInputPrecio = ref(true);
    let chkProducto = ref(false)

    /* ***************** AGREGAR AL CARRITO ************************* */
    const addCarrito = (item: any) => {
     //console.log(item);
      let validation = true;
      /* VALIDAMOS QUE SELECCIONE UNA PRESENTACION */
      if (item.presentacion.length > 0 && (item.istalla == null || item.istalla == "")) {
        onNotification("negative","top",4000,`Ey!, selecciona una presentación para ${item.producto}`);
        return false;
      }
      /* VALIDAMOS QUE EL STOCK DE LA TALLA NO SEA MAYOR AL PEDIDO */
      let istalla:any = null;
      item.presentacion.forEach((elem: any) => {
        if (elem.value === item.istalla) {
            if(parseInt(item.cantidad) > elem.stock){
                validation = false;
                onNotification("warning","top",6000,"En esta presentacion de "+elem.label+" solo tienes " + elem.stock +" en almacen.");
                return;
            }
            istalla = elem.label;
        }
      });

      /* VALIDAMOS QUE  PRECIO SE APLICARA SI AL X MAYOR O MENOR */

      let precioventa = parseInt(item.cantidad) >= parseInt(item.cantidad_venta_mayor) ? item.preciomayor : item.preciounitario;

      /* CALCULAMOS EL TOTAL DEL PRODUCTO */
      let totalitem = parseInt(item.cantidad) * parseFloat(precioventa);

      /* VALIDAMOS QUE NO SE REPITA EL PRODUCTO AGREGADO && istalla === elem.talla */
      rows._value.forEach((elem: any) => {
        if(item.producto === elem.producto && chkProducto.value === false){
          elem.cantidad= parseInt(elem.cantidad)  + parseInt(item.cantidad)
          updateTotal(elem);
          validation = false;          
          return;
        }
      });

      if(!validation){
        return false;
      }


      rows.value.push({
        name: item.name,
        producto: item.producto,
        talla: istalla,
        precio: precioventa,
        cantidad: parseInt(item.cantidad),
        total: totalitem.toFixed(2),
        cod_compra:item.cod_compra,
        precio_mayor:item.preciomayor,
        precio_unitario:item.preciounitario,
        cantidad_venta_mayor:item.cantidad_venta_mayor,
      });      
      
      onNotification("positive","bottom-right",1000,"Producto Agregado: " + item.producto);
      sumarTotal();
    };

    /* ****** NOTIFICACION *********** */
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

    /* ********** ACTUALIZA PRECIO X CANTIDAD ************ */
    const updateTotal = (item:any) =>{
      //console.log(item);
      let nuevomonto = 0;
      if(parseInt(item.cantidad) >= parseInt(item.cantidad_venta_mayor)){
        nuevomonto = parseInt(item.cantidad) *  parseFloat(item.precio_mayor);
        item.precio = item.precio_mayor;
      }else{
        nuevomonto = parseInt(item.cantidad) *  parseFloat(item.precio_unitario);
        item.precio = item.precio_unitario;
      }
           
      item.total = nuevomonto.toFixed(2) ; 
      sumarTotal();             
    }

    /* ************** ALTER PRECIO ************ */
    const alterprecio = (item:any) =>{
      let nuevomonto = 0;    
      nuevomonto = parseInt(item.cantidad) *  parseFloat(item.precio);
      item.precio = item.precio;     
      item.total = nuevomonto.toFixed(2) ; 
      sumarTotal();             
    }

    /* ********* ELIMINA ITEM DEL CARRITO ********** */
    const deleteItem = (index:any) => {
      rows.value = [ ...rows.value.slice(0, index), ...rows.value.slice(index + 1) ]
      sumarTotal();
    }

    /* *************** CALCULA EL MONTO TOTAL ************** */
    const sumarTotal = () => {
      console.log('sumar+++');
      
      let montovendido:number=0;
      rows._value.forEach((elem: any) => {
        montovendido +=  parseFloat(elem.total);
      });
      
      let subtotal:number = (montovendido/(1+0.18));
      let igv = montovendido - subtotal;
      let total = subtotal + igv - _montoDescuento.value;
           
      montoventa.value = formatMoney(subtotal);
      montoIGV.value = formatMoney(igv);
      montoTotal.value = formatMoney(total);
      _montoventa.value = subtotal.toFixed(2);
      _montoIGV.value = igv.toFixed(2);
      _montoTotal.value = total.toFixed(2);
    }

    /* ************ FROMATO DE MONEDA ********* */
    const formatMoney = function(number:number){
      return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
    };

    /* *************** BUSCAR CUPON DESCUENTO ********* */
    const buscarcupon = (async (e:any) => {
      if(e.which == 13){
        __onLoading("Buscando codigo de descuento, codigo N°: " + numeroCupon.value);
       await srvProducto.getbuscarcuponDescuento(numeroCupon.value)
        .then((response) => {
          quasar.loading.hide();
          montoDescuento.value = formatMoney(response[0].monto_descuento);
          _montoDescuento.value = parseFloat(response[0].monto_descuento);  
          sumarTotal();
        })
        .catch((err)=>{
          quasar.loading.hide();
          if(err.response.status === 404){
            Swal.fire({icon:'warning',html:err.response.data.message})
          }else if(err.response.status === 409){
            Swal.fire({icon:'info',html:err.response.data.message})
          }else{
            Swal.fire({icon:'error',html:err.response})
          }
          numeroCupon.value = "";
        })
      }
    });

    /* ********* BUSCAR CLIENTE ********** */
    const buscarcliente = (async (e:any) => {
      codCliente.value ='';
      if(e.which == 13 && dniCliente.value.length == 8){
        __onLoading("Buscando cliente con N° DNI: " + dniCliente.value);
       await srvProducto.getbuscarcuponCliente(dniCliente.value)
        .then((response) => {
          codCliente.value = response.cod_cliente;
          dniCliente.value =response.apellidos_nombres;   
          quasar.loading.hide();      
        })
        .catch((err)=>{
          quasar.loading.hide();    
          console.log(err);
          if(err.response.status === 404){
            Swal.fire({icon:'warning',text:err.response.data.message})
          }else if(err.response.status === 409){
            Swal.fire({icon:'warning',text:err.response.data.message})
          }else{
            Swal.fire({icon:'error',text:err.response})
          }
        })
      }
    });

    /* ********* MEDIOS DE PAGO ********* */
    const otherPago = (async (e:any) => {
      if(bntpago.value === 0){
        modaltipoPago.value = true;
      }else if (bntpago.value === 2){
        compadelantoinput.value.showModal(true);    
      }else{
        modaltipoPago.value = false;
      }
    });

    /* ********** TIPO DE PAGO ********* */
    const getTipoPagoData = (async () => {
      columnsPago.value = [
        {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name},
        {name: "descripcion_corta",label: "Descripcion",field: "descripcion_corta",align: "left",},
        {name: "numero_cuenta",label: "N° Cuenta",field: "numero_cuenta",align: "left",},
        {name: "monto",label: "Monto Declara",field: "monto",align: "left",},
      ];
      srvTipoPago.getListaTipoPago()
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          rowsPago.value.push({
            name: response.data[i].cod_tipo_pago,
            descripcion_corta: response.data[i].descripcion_corta,
            numero_cuenta: response.data[i].numero_cuenta,
            monto: 0,            
          })
        }
        
      })
    });

    /* ********* PROCESAR VENTA ************* */
    const saveVenta = (async () => {
      mdlcalcula.value=false;
      if(codCliente.value == null || codCliente.value == ''){
        dniCliente.value ='';
        Swal.fire({icon:"warning",title:'Upps',text:"Los datos del cliente no pueden estar vacios."})
        return;
      }
      
      if(rows._value.length === 0){
        Swal.fire({icon:"warning",title:'Upps',text:"No tiene ningun producto agredado a su carrito."})
        return;
      }

      if(parseFloat(montocreditoadelanto.value) > parseFloat(_montoTotal.value)){
        Swal.fire({icon:"warning",title:'Upps',html:"El monto de adelanto (<b>"+formatMoney(parseFloat(montocreditoadelanto.value))+"</b>) es superior al monto total apagar. (<b>"+formatMoney(parseFloat(_montoTotal.value))+"</b>)"})
        return;
      }

      let nowfecha = ref(moment(new Date()).format('yyyy-MM-DD  H:mm:ss'));
      __onLoading("procesando venta........");
      let dataform = new FormData();
      /* DATOS DE LA VENTA */
      let jsonVenta = {
        'numero_cupon': (numeroCupon.value === undefined ? '' : numeroCupon.value),
        'monto_subtotal': _montoventa.value,
        'monto_igv': _montoIGV.value,
        'monto_descuento': _montoDescuento.value,
        'monto_total': _montoTotal.value,
        'cod_cliente': codCliente.value,
        'cod_tipo_comprobante':1,
        'numero_comprobante': 'NTV-00001',
        'fecha_venta':nowfecha.value,
        'estado_pago' : (bntpago.value === 2 ? 0 : 1)
      }
      dataform.append('venta',JSON.stringify(jsonVenta));   
      /* DATOS DEL DETALLE DE LA VENTA */  
      let jsonDetalle: any[] = [];
      rows._value.forEach((e:any) => {
        jsonDetalle.push({
          'presentacion':e.talla,
          'color':'',
          'precio_venta':e.precio,
          'cantidad':e.cantidad,
          'descuento':0,
          'total':e.total,
          'cod_producto':e.name,
          'cod_compra':e.cod_compra
        });        
     });
     console.log(jsonDetalle)
     dataform.append('detalle',JSON.stringify(jsonDetalle));     
     /* DATOS DEL DETALLE DE PAGO */
     let jsonDetallePago: any [] = [];
     let montodeclare:number = 0;
     let detallepagocredito = [];
     /* OTROS MEDIOS DE PAGO */
     if(bntpago.value === 0){
        rowsPago._value.forEach((e:any) => {
          if(e.monto > 0){
            jsonDetallePago.push({
              'codigo_operacion': '-',
              'monto': e.monto,
              'cod_tipo_pago':e.name
            });
            montodeclare += parseFloat(e.monto);
          }
        });
        /* VALIDAMOS QUE EL ONTO DECLARADO SEA IGUAL AL MONTO DE PAGO */
        if(montodeclare > _montoTotal.value || montodeclare < _montoTotal.value){
          quasar.loading.hide();
          Swal.fire({title:'Upps',text:'El Monto declarado en el detalle de pago es diferente al monto total a pagar.',icon:"warning"});
          return;
        }
     }else if(bntpago.value === 2){
      let monto = 0;
      if(montocreditoadelanto.value !== '' || montocreditoadelanto.value !== null){
        monto = montocreditoadelanto.value;
      }
      /* TIPO DE PAGO A CREDITO */
      detallepagocredito.push(
        {
          montoadelanto:monto,
          montodebe: parseFloat(_montoTotal.value) - monto
        }
      );

     }else{
      /* TIPO DE PAGO AL CASH */
      jsonDetallePago.push({
        'codigo_operacion': '-',
        'monto': _montoTotal.value,
        'cod_tipo_pago':1
      });
     }     
     dataform.append('detallepago',JSON.stringify(jsonDetallePago)); 
     dataform.append('detallepagocredito',JSON.stringify(detallepagocredito));   

      srvVenta.saveVenta(dataform).then((response) => {
        console.log(response);
        quasar.loading.hide();
        limpiar();
        //Swal.fire({icon:"success",title:"Bien echo!",text:response.message})
        printComprobante(response.code);
        /* ACTUALIZAMOS NUSTRO CATALOGO DE PRODUCTOS */
        mdlproducto.value.getCatalogo();
      }).catch(({response}) => {
        quasar.loading.hide();
        console.log(response);
        if(response.status === 409){
          Swal.fire({icon:"warning",title:"Upps!",html:response.data.message})
        }else{
          HandlerError.errorGlobal(response)
        }
        
      })     
    });

    /* *********** LOADING ************ */
    const __onLoading = ((message:string) => {
      quasar.loading.show({
            html:true,
            message: '<b class="fm-poppis">'+message+'</b>',
            boxClass: 'bg-grey-2 text-grey-9',
            spinnerColor: 'primary',
            customClass:'fm-poppis'
        })
    });

    const limpiar = ( () => {
      rows.value = [];rowsPago.value = [];
      getTipoPagoData();
      dniCliente.value = ''; codCliente.value = ''; numeroCupon.value = '',bntpago.value = 1;
       montoventa.value = '',montoIGV.value = '',montoTotal.value = '',montoDescuento .value = '';
       _montoventa.value = 0,_montoIGV.value = 0,_montoTotal.value = 0,_montoDescuento.value = 0;
      montocreditoadelanto.value = 0.0;
      compadelantoinput.value.limpiarcaja(0);
      mdlcalcula.value=false;
      montoPaga.value='';
      vuelto.value='';
    })

    /********** GENERAR COMPROBANTE **************/
    const printComprobante = (async (codventa:any) => {
      __onLoading("imprimiendo comprobante......");
      await srvReporte.getComprobanteVenta(codventa)
      .then((rpt) => {
        quasar.loading.hide();
        window.open(URL.createObjectURL(rpt), "",
	    "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no,scrollbars=yes,width=700,height=540");        
      })
      .catch((error) => {
        console.log(error);
        quasar.loading.hide();
        
      })
    });

    /********** CALCULAR VUELTO ***********/
    const calculavuelto = (e:any) => {
      if(e.which == 13){
        let vueltor = parseFloat(montoPaga.value) -  _montoTotal.value ;
        vuelto.value = formatMoney(vueltor);
      }
    }

    const other = (e:any)=>{
      console.log(e);
      
    }

    /* ********* DETECTAR VALOR DE TECLA ***********/
    document.addEventListener('keydown', (event) => {
      if (event.altKey) {
         if (event.keyCode == 49) {
          limpiar();
         }

        if (event.keyCode == 50) {
          mdlcalcula.value = true;
        }

        if (event.keyCode == 51) {
          mdlcalcula.value = false;
        }

        if(event.keyCode == 81 || event.keyCode == 113){
          codCliente.value = 1;
          dniCliente.value = 'CLIENTE DIVERSOS';  
        }

        if(event.keyCode == 87 || event.keyCode == 119){
          compotherproducto.value.openModal(true)
        }

        if(event.keyCode == 77 || event.keyCode == 109){
          habilitarInputPrecio.value = false
        }
        if(event.keyCode == 77 || event.keyCode == 109){
          habilitarInputPrecio.value = true
        }
      }
    }, false); 

    document.addEventListener('keydown', (event) => {
      if (event.shiftKey) {        
        if(event.keyCode == 72 || event.keyCode == 104){
          habilitarInputPrecio.value = false
        }
        if(event.keyCode == 68 || event.keyCode == 100){
          habilitarInputPrecio.value = true
        }
      }
    }, false);

    /* SHOW MODAL ADELANTO */
    const shormodaladelanto = ((event:any) => {
      montocreditoadelanto.value = event;
    });

    /* ON INIT */
    onMounted(() => {
      isLoadingTable.value = true;
      columns.value = [
        {
          name: "id",
          label: "#",
          align: "left",
          field: (row: { name: any }) => row.name,
        },
        {
          name: "producto",
          label: "Producto",
          field: "producto",
          align: "left",
        },
        { name: "talla", label: "Presentación", field: "talla", align: "left" },
        { name: "precio", label: "Precio", field: "precio", align: "left" },
        {
          name: "cantidad",
          label: "Cantidad",
          field: "cantidad",
          align: "left",
        },
        { name: "total", label: "Total", field: "total", align: "left" },
      ];
      isLoadingTable.value = false;
      getTipoPagoData();
    });

    return {
      isdense,
      dniCliente,codCliente,
      otionPago,
      bntpago,
      montoventa,
      montoIGV,
      montoTotal,
      montoDescuento,
      numeroCupon,
      rows,
      columns,
      isLoadingTable,
      modaltipoPago,rowsPago,
      columnsPago,compadelantoinput,
      addCarrito,
      onNotification,
      updateTotal,
      deleteItem,
      buscarcupon,
      buscarcliente ,
      otherPago,alterprecio,habilitarInputPrecio,
      saveVenta,limpiar,shormodaladelanto,
      mdlcalcula,montoPaga,vuelto,calculavuelto,
      mdlproducto,compotherproducto,other,chkProducto
    };
  },
};

export default appVenta;