import axios from 'axios';
import { LocalStorage } from 'quasar';

export default {
    //inicio de session 
    $__getLogin(payload:any){
        return axios.post('auth/login', payload)
        .then((response) => {
            return response;
        });
    },
    //cerrar session
    $__getlogout(){
        return axios.post('auth/logout')
        .then((response) => {
            localStorage.removeItem('token');
            localStorage.removeItem('datoslogin');
            LocalStorage.remove('__refresh__');
            LocalStorage.clear();
            axios.defaults.headers.common["Authorization"] = '';
            return response.data;
        });
    },
    //refrescar token 
    $__refresh_token(){
        return axios.post('auth/refresh')
        .then((response) => {
            return response.data;
        })
    },
    //obtener datos del usuario logueado
    $__getmedatatoken(){
        return axios.post('auth/datosauth')
        .then((response) => {
            return response.data;
        })
    },
    //Guardar token en local storage
    $__savetokenstorage(token:string){
        localStorage.setItem('token',token);
       axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    },
    $__gettoken(){
        const token = localStorage.getItem('token');
        if(token){
            return token;
        }
        return false;
    },
    $__isAutenticated(){
        const token = localStorage.getItem('token');
        if(token){
            return true;
        }
        return false;
    }
}