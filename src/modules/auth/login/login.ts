import { ref, computed, onMounted } from 'vue';
import storage from '@/storage/storage'
import vue from 'vue'
import axios from 'axios'
import srvauth from '@/services/auth/AuthService'
import { Login,UsuarioLogin } from '@/interfaces/Login'
import { LocalStorage,useQuasar  } from 'quasar'
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import HandlerError from '@/services/error/HandlerError';

const appLogin = {
    name :"viewLogin",
    props:{
       
    },
    setup(props: any, context: any) {
       const router = useRouter();
       let emailuser = ref('scomedemo@gmail.com');
       let save_email = ref(false);
       let password_user = ref('');
       let isTypeInput = ref(true);
       let btnsend = ref(false);
       let onLoading = useQuasar();
       let $dataError = {
            password:[],
            email:[]
       }
       let dataError = ref($dataError);
       let isValidEmail = ref(true);
       let isValidClave = ref(true);
        function __onLoading(){
            onLoading.loading.show({
                html:true,
                message: '<b class="fm-poppis">un momento por favor, validando...</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        }

        const onSaveEmail = () => {
            if(save_email.value){
                const d = new Date();
                d.setTime(d.getTime() + (60*24*60*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = `emailuser=${emailuser.value}; ${expires}; ;path=/`;
            }else{
                save_email.value = false;
                document.cookie = `emailuser=; expires=${new Date().toUTCString()}; path=/;`;
               emailuser.value = '';
            }
            
        }

        const getCookieEmail = (namecookie:any) => {
            let name = namecookie + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
        }

        const validarCookieEmail = () => {
            let username = getCookieEmail("emailuser");
            if (username != "") {
                emailuser.value = username;
                save_email.value = true
            }
        }

      function onLogin(){
        btnsend.value = true; 
        dataError.value = $dataError;
        isValidEmail.value = true;
        isValidClave.value = true;

        __onLoading();
        let payload:Login = {
            'email': emailuser.value,
            'password':password_user.value
        };

        if(srvauth.$__isAutenticated()){
            onLoading.loading.hide();
            router.push({name:'main'})
            return;
        }

        axios.post('auth/login',payload)
        .then((response) => {
            //console.log(response);  
            onLoading.loading.hide();          
            const data:UsuarioLogin = response.data.data.datospersonales;
            const token = response.data.token.original.access_token;
            const refresh_token = response.data.token.original.refresh_token;
            localStorage.setItem('token',token);
            //LocalStorage.set('__refresh__',refresh_token);
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            storage.commit('setDataLogin',data);
            storage.commit('setRefreshToken',refresh_token);
            //LocalStorage.set('datoslogin',data);
            storage.commit('setMenusList',response.data.menus);
            router.push({name:'main'})
            btnsend.value = false;               
        })
        .catch( (error) => {
            console.log(error);
            
           onLoading.loading.hide();
            btnsend.value = false;   
           /* let status:number = 0;
           const _err = {
                data:{},
                status,
           } = error.response; */
          
           if(error.response.status === 409){
                $dataError = error.response.data.data;
                dataError.value = error.response.data.data;
                console.log( dataError);
                isValidEmail.value = (error.response.data.data.hasOwnProperty('email') == false ? true : false);
                isValidClave.value = error.response.data.data.hasOwnProperty('password') == false ? true : false;
           }else if(error.response.status == 403){
                Swal.fire({
                icon: 'warning',
                text:  error.response.data.message,
                confirmButtonColor: '#2b3344',
                })
            }else{
                HandlerError.errorGlobal(error)
            }
            
            btnsend.value = false;     
        });
    }

    onMounted(() => {
        document.title = 'SCOME | Login';
        validarCookieEmail();
    })

       return {
            emailuser,save_email,password_user,isTypeInput,btnsend,
            onLoading,dataError,isValidClave,isValidEmail,onLogin,
            onSaveEmail
       }
    }    
}

export default appLogin