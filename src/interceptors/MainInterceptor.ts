import axios from 'axios'
import storage from '@/storage/storage'
import { LocalStorage } from 'quasar';
import Swal from 'sweetalert2';

const urlapi =  import.meta.env.VITE_API_URL;
axios.defaults.baseURL= urlapi;
//axios.defaults.headers.options={'Access-Control-Allow-Origin': '*'};

const tokenstore = storage.state.token_refresh //LocalStorage.getItem('__refresh__');
if(tokenstore){
    axios.defaults.headers.common["Authorization"] = 'Bearer ' + tokenstore;
  }

let refresh = false;

axios.interceptors.response.use(resp => resp,async error => {
        
    if(error.response.status === 401 && !refresh){
        refresh = true;
        
        const {status, data} = await axios.post('auth/refresh'
            //withCredentials:true
        );
        //console.log(data);
        if(status == 200){
            const token = data.token.original.access_token;
            const refresh_token = data.token.original.refresh_token;
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            localStorage.setItem('token',token);
            //LocalStorage.set('__refresh__',refresh_token);
            storage.commit('setRefreshToken',refresh_token);
            return axios(error.config);
        } 
        
        
    }else{
        /* VALIDAMOS SI LA SESSION YA EXPIRO POR DEFINITIVA */
        if(error.response.status === 401){
            Swal.fire({icon:'info',title:'La sesión a caducado',text: "Estimado(a) usuario se procedera a cerrar su sesión.",timer:9000,timerProgressBar:true});
            setInterval(() => {
                localStorage.clear();
                LocalStorage.clear();
                window.location.href = "/"
            },9000);
        }
    }
    refresh = false;
    return Promise.reject(error);
})
