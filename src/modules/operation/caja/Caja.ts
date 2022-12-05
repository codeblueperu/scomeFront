import moment from "moment";
import { date, Loading, LocalStorage, useQuasar } from "quasar";
import { onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import srvCaja from "@/services/operation/CajaService";
import { CajaEntity } from "@/interfaces/IntCaja";
import {UsuarioLogin} from "@/interfaces/Login"
import Swal from "sweetalert2";
import srvReporte from '@/services/report/VentaReporteService';
const appCaja = {
    name: 'viewcajaopen',
    setup(){
        let onLoading = useQuasar();
        let now = moment(new Date()).format('yyyy-MM-DD');
        let anteriofecha = moment(new Date()).add(-1,'d').format('yyyy-MM-DD');
        let hora = moment(new Date()).format('HH:mm');
        const router = useRouter();//date('d-m-Y H:i:s')
        let nowfecha = moment(new Date()).format('yyyy-MM-DD  H:mm:ss');
        let datauser:UsuarioLogin | null = LocalStorage.getItem('datoslogin');
        let columns: any = ref([]);
        let rows: any = ref([]);
        let visible = ref(true);
        let filterdata = ref('');
        let modalcaja = ref(false);
        let ismontoinit = ref(false);
        let optionCaja = [{codigo:'1', descripcion:'APERTURADA'},{codigo:'0', descripcion:'CERRADA'}]
        let data:CajaEntity = {estado:'APERTURADA',monto_inicial:0.00,cod_caja:0,
            descripcion_caja:datauser?.nombres,fecha_apertura:nowfecha,fecha_cierre:nowfecha,
            monto_digital:0,monto_ingreso:0,monto_efectivo:0,monto_gasto:0,monto_total:0};
        let formulario:Ref<CajaEntity> = ref(data);
        let visiblecolumn = ['descripcion_caja','fecha_apertura','fecha_cierre','monto_inicial','monto_efectivo','monto_digital','monto_ingreso','monto_gasto','monto_total','estado',''];

        let fechainicio = ref(anteriofecha);
        let horainicio = ref(hora);        
        let fechafin = ref(now);
        let horafin = ref(hora);

        let fechaAperturainicio = ref(now);
        let horaAperturainicio = ref(hora);        
        let fechaAperturafin = ref(now);
        let horaAperturafin = ref(hora);
        let exprNumericos = "^[0-9]+([.][0-9]+)?$" //"^[0-9]+[.,]{1,1}\[0]{2,2}$";
        let validFormCaja = [
            [(val:any) => val.match(exprNumericos) !== null || "Ingrese un monto con 2 decimales."]
        ];

        let isfechaAperturainicio = ref(false), ishoraAperturainicio = ref(false) ,isfechaAperturafin = ref(false), ishoraAperturafin = ref(false);

        function __onLoading(message:string){
            onLoading.loading.show({
                html:true,
                message: '<b class="fm-poppis">'+message+'</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        }

       const onDataCaja =( async () => {
            rows.value = [];
            visible.value = true
                        
            await srvCaja.listaCaja(fechainicio.value,moment(fechafin.value).add(1,'d').format('yyyy-MM-DD'))
            .then((rpt) => {
                //console.log(rpt);
                for (let i = 0; i < rpt.data.length; i++) {
                    rows.value.push({
                        name:rpt.data[i].cod_caja,
                        descripcion_caja:rpt.data[i].descripcion_caja,
                        fecha_apertura:moment(rpt.data[i].fecha_apertura).format('DD/MM/yyyy  HH:mm a'),
                        fecha_cierre: date.formatDate(rpt.data[i].fecha_cierre, 'DD/MM/YYYY HH:mm a'),
                        monto_inicial:formatMoney(rpt.data[i].monto_inicial),
                        monto_efectivo:formatMoney(rpt.data[i].monto_efectivo),
                        monto_digital:formatMoney(rpt.data[i].monto_digital),
                        monto_ingreso:formatMoney(rpt.data[i].monto_ingreso),
                        monto_gasto:formatMoney(rpt.data[i].monto_gasto),
                        monto_total:formatMoney(rpt.data[i].monto_total),
                        estado:rpt.data[i].estado,
                    });                  
                }
                visible.value = false;
            })
        });

        async function OnCreate(){
            __onLoading((formulario.value.cod_caja == 0 ? "aperturando caja, un momento por favor..." : "cerrando caja, un momento por favor...."));
            if(formulario.value.cod_caja !== 0){
                formulario.value.fecha_cierre = fechaAperturafin.value + ' ' +horaAperturafin.value;
            }else{
                formulario.value.fecha_apertura= fechaAperturainicio.value + ' ' +horaAperturainicio.value;
            }
            
            await srvCaja.srvOpenCaja(formulario.value)
            .then((response) => {                
                onDataCaja();
                onLoading.loading.hide();
                modalcaja.value = false;
                onReset();
                Swal.fire({icon:'success',html:response.message})
            })
            .catch((error) => {
                console.log(error);
                onLoading.loading.hide();
                modalcaja.value = false;
                fechaAperturainicio.value = now;
                horaAperturainicio.value =hora;     
                fechaAperturafin.value = now;
                horaAperturafin.value =hora; 
                if(error.response.status == 409){
                    Swal.fire({icon:'warning',title:'Advertencia!',html:error.response.data.message})
                }
            })
        }

        async function onReset(){
            nowfecha = moment(new Date()).format('yyyy-MM-DD  H:mm:ss');
            ismontoinit.value =false;
            formulario.value = {estado:'APERTURADA',monto_inicial:0.00,cod_caja:0,
            descripcion_caja:datauser?.nombres,fecha_apertura:nowfecha,fecha_cierre:nowfecha,
            monto_digital:0,monto_efectivo:0,monto_gasto:0,monto_ingreso:0,monto_total:0};
            now = moment(new Date()).format('yyyy-MM-DD');
            anteriofecha = moment(new Date()).add(-1,'d').format('yyyy-MM-DD');
            hora = moment(new Date()).format('HH:mm');
            fechaAperturainicio.value = now;
            horaAperturainicio.value =hora;     
            fechaAperturafin.value = now;
            horaAperturafin.value =hora;     
        }

        async function OnCerrarCaja(code:number){
             __onLoading("Buscando registro, un momento...");
            ismontoinit.value = true;            
            await srvCaja.srvBuscarCajaID(code)            
            .then((response)=>{
               // console.log(response);
                
             /*     let gasto:number = (response.data.monto_gasto === 0 ? 0.0 : response.data.monto_gasto);
                let montoDigital:number = (response.data.monto_digital === 0 ? 0.0 : response.data.monto_digital);
                let montoEfectivo:number = (response.data.monto_efectivo === 0 ? 0.0 : response.data.monto_efectivo);
                let montoInicial:number = (response.data.monto_inicial === 0 ? 0.0 : response.data.monto_inicial);
                 */
                onLoading.loading.hide();
                modalcaja.value = true;
 
                formulario.value = response.data;
                formulario.value.monto_digital = response.data.monto_digital;
                formulario.value.descripcion_caja = response.data.usuario;
                formulario.value.fecha_cierre = moment(new Date()).format('yyyy-MM-DD  HH:mm:ss');
                formulario.value.estado = 'CERRADA'; 
                let montoTotal:any = (parseFloat(response.data.monto_inicial) + parseFloat(response.data.monto_efectivo) + parseFloat(response.data.monto_digital) + parseFloat(response.data.monto_ingreso)) - parseFloat(response.data.monto_gasto);
                formulario.value.monto_total = montoTotal.toFixed(2);
                fechaAperturainicio.value = moment(response.data.fecha_apertura).format('yyyy-MM-DD');;
                horaAperturainicio.value = moment(response.data.fecha_apertura).format('HH:mm');;
                fechaAperturafin.value = moment(new Date()).format('yyyy-MM-DD');;
                horaAperturafin.value = moment(new Date()).format('HH:mm');;
            })
        }

        const formatMoney = function(number:number){
            return new Intl.NumberFormat('es-PE', {style: 'currency',currency: 'PEN', minimumFractionDigits: 2}).format(number);
        };

        const openModal = (flat:boolean) => {
            now = moment(new Date()).format('yyyy-MM-DD');
            hora = moment(new Date()).format('HH:mm');
            fechaAperturainicio.value = now;
            horaAperturainicio.value =hora;     
            fechaAperturafin.value = now;
            horaAperturafin.value =hora; 
            modalcaja.value = flat;
        }

        const printreportecuadre = (async (codcaja:any) => {
            __onLoading("imprimiendo reporte......");
            await srvReporte.getprintreportecuadrecaja(codcaja)
            .then((rpt) => {
                onLoading.loading.hide();
                window.open(URL.createObjectURL(rpt), "",
                "location=no,menubar=no,titlebar=no,resizable=no,toolbar=no,scrollbars=yes,width=700,height=540");        
            })
            .catch((error) => {
                console.log(error);
                onLoading.loading.hide();
                
            })
        })
        
        onMounted(() => {
            columns.value = [
                {name: "id",label: "#",align: "left",field: (row: { name: any }) => row.name,sortable: true},
                {name: "descripcion_caja",label: "CAJA",align: "left",field: 'descripcion_caja',sortable: true},
                {name: "fecha_apertura",label: "APERTURA",align: "left",field: 'fecha_apertura',sortable: true},
                {name: "fecha_cierre",label: "CIERRE",align: "left",field: 'fecha_cierre',sortable: true},
                {name: "monto_inicial",label: "MT. INICIAL",align: "left",field: 'monto_inicial',sortable: true},
                {name: "monto_efectivo",label: "MT. EFECT.",align: "left",field: 'monto_efectivo',sortable: true},
                {name: "monto_digital",label: "MT. DIGITAL",align: "left",field: 'monto_digital',sortable: true},
                {name: "monto_ingreso",label: "MT. INGRESO",align: "left",field: 'monto_ingreso',sortable: true},
                {name: "monto_gasto",label: "MT. GASTO",style:"color:#FF5722;font-weight:bold;",format: (val: any) => `-${val}`,align: "left",field: 'monto_gasto',sortable: true},
                {name: "monto_total",label: "TOTAL",style:"color:#1B5E20;font-weight:bold;",align: "left",field: 'monto_total',sortable: true},
                {name: "estado",label: "ESTADO",align: "left",field: 'estado',sortable: true},
            ];
            onDataCaja();            
        })

        return{
            columns,rows,visible,filterdata,modalcaja,optionCaja,formulario,ismontoinit,
            fechainicio,fechafin,horainicio,horafin,fechaAperturainicio,
            horaAperturainicio,fechaAperturafin,horaAperturafin,
            isfechaAperturainicio,ishoraAperturainicio,isfechaAperturafin,ishoraAperturafin,
            OnCreate,onReset,OnCerrarCaja,onDataCaja,openModal,validFormCaja,visiblecolumn,
            printreportecuadre
        }
    }
}
export default appCaja;


/* :visible-columns="['descripcion_caja','fecha_apertura','fecha_cierre','monto_inicial','monto_efectivo','monto_digital','monto_gasto','monto_total','estado','']" */