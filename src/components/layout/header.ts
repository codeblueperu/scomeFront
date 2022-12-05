import { LocalStorage } from 'quasar';
import { ref } from 'vue'
import { onMounted } from "vue";
import srvauth from '../../services/auth/AuthService'
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import srvSecurity from '@/services/security/ServiceSecurity';
import HandlerError from '@/services/error/HandlerError';
import storage from '@/storage/storage'

const appHeader = {
    props: ['drawernav'],
    emits: ['update:drawernav'],
    setup(props:any) {
        let drawer = ref(false);
        let mobileData=  ref(false);
        let bluetooth = ref(false);
        let dataLogin = storage.state.dataLogin //LocalStorage.getItem('datoslogin');
        let menuacceso = ref(storage.state.ismenus)
        const router = useRouter();
        onMounted(() => {
         //console.log(storage.state.ismenus)
          /* srvSecurity.getListaMenuAccesoLogin()
          .then(({data}) => {
            menuacceso.value = data;
            console.log(data)
          })
          .catch((error) => {
            console.log(error)
            HandlerError.errorGlobal(error.response);
          }) */
                    
        });

       function onLogout(){
            Swal.fire({
              title: 'Estas seguro de salir?',
              text: "una vez cerrado su sesión no podra efectuar ninguna operación!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#7b1fa2',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, salir!',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                srvauth.$__getlogout()          
                .then((response) => {
                  router.push('/');
                  Swal.fire(
                  'Excelente!',
                  'sesión cerrada.',
                  'success'
                )
                  //console.log(response);
                  
                }).catch((error) => {
                  router.push('/');
                  localStorage.clear;
                  LocalStorage.clear;
                  //console.log(error);            
                })
                
              }
            })
            
          }

        return{
            drawer,menuacceso,mobileData,bluetooth,dataLogin,onLogout
        }
    }
}

export default appHeader;