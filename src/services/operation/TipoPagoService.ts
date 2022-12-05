import axios from "axios"

export default {
    getListaTipoPago(){
        return axios.get(`operaciones/tipopago`)
        .then((response) => {
            return response.data;
        })
    }
}