import axios from "axios"

export default {
    getDataCliente(){
        return axios.get(`operaciones/clientes`)
        .then((response) => {
            return response.data;
        })
    },
    postCliente(){
        return axios.get(`operaciones/clientes`)
        .then((response) => {
            return response.data;
        })
    },
}