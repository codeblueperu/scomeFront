import { onBeforeMount, onMounted, ref } from 'vue'
import srvauth from '../../services/auth/AuthService'
import { LocalStorage } from 'quasar';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import HeaderVue from '../../components/layout/Header.vue';
import { Login, UsuarioLogin } from '../../interfaces/Login';


const appHome = {
    name:'ViewHome',
    component:{
        HeaderVue
    }, 
    setup(props:any,context:any) {
        let drawer = ref(false);       
        let dataLogin:UsuarioLogin | null = LocalStorage.getItem('datoslogin');
        const router = useRouter();
        let message = ref('');
        
        function onOpenMenu(valor:boolean){
            drawer.value = valor;     
        }
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
                  //console.log(error);            
                })
                
              }
            })
            
          }

        onBeforeMount(() => {
            document.title = 'SCOME | Login'
        })

        return {
            drawer,message,dataLogin,onOpenMenu,onLogout
        }
    }
    
}

export default appHome;
