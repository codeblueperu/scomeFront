import axios from "axios";

export default{
    postCrearcuentaUsuario(data:any){
        if(data.cod_persona === 0){
            return axios.post('security/crearcuentausuario',data)
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.put(`security/editadatausuario/${data.cod_persona}`, data)
            .then((response) => {
                return response.data;
            })
        }
        
    },
    getListaDataUsuario(){
        return axios.get(`security/listausuario`)
        .then((response) => {
            return response.data;
        })
    },
    getBuscarpersonaID(codpersona:any){
        return axios.get(`security/buscarpersonaid/${codpersona}`)
        .then((response) => {
            return response.data;
        })
    },
    deleteEliminarPersonausuario(codpersona:any){
        return axios.delete(`security/eliminarpersona/${codpersona}`)
        .then((response) => {
            return response.data;
        })
    },
    getUsuarioSucursal(codsucursal:any){
        return axios.get(`security/usuariosucursal/${codsucursal}`)
        .then((response) => {
            return response.data;
        })
    },
    getListaMenuPrincipal(){
        return axios.get(`security/menuprincipales`)
        .then((response) => {
            return response.data;
        })
    },
    getListaSubMenu(cargo:any,grupo:any){
        return axios.get(`security/submenu/${cargo}/${grupo}`)
        .then((response) => {
            return response.data;
        })
    },
    postGuardarPermisoMenu(data:any){
        return axios.post(`security/guardarpermisomenu`,data)
        .then((response) => {
            return response.data;
        })
    },
    getListaMenuAccesoLogin(){
        return axios.get(`security/menuaccesouserlogin`)
        .then((response) => {
            return response.data;
        })
    }
}