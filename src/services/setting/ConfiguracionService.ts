import axios from "axios";

export default{
    getListaTipoDocumentos(){
        return axios.get(`setting/listatipodocumentos`)
        .then((response) => {
            return response.data;
        })
    },
    getListaCargo(){
        return axios.get(`setting/listacargosusuario`)
        .then((response) => {
            return response.data;
        })
    },
    getListaSucursales(){
        return axios.get(`setting/listasucursales`)
        .then((response) => {
            return response.data;
        })
    },
    getPersonaDNIExiste(dni:any){
        return axios.get(`setting/buscardnipersona/${dni}`)
        .then((response) => {
            return response.data;
        })
    },
    getPersonaEmailExiste(email:any){
        return axios.get(`setting/buscaremailpersona/${email}`)
        .then((response) => {
            return response.data;
        })
    }
}