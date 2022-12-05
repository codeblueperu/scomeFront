import { ref } from "vue";

const appAdelanto = {
    emits: ['mimontodeclare'], 
    setup(){
        let estadomodal = ref(false);
        let montoadelanto = ref(0);

        const showModal = ((flat:boolean) => {
            estadomodal.value = flat;
        });

        const limpiarcaja = ((valor:number) => {
            montoadelanto.value = valor;
        })

        return{
            estadomodal,montoadelanto,showModal,limpiarcaja
        }
    }
}
export default appAdelanto;