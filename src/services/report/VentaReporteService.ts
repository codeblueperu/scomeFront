import axios from "axios";

export default {
    getComprobanteVenta(codventa:any){
        return axios.get(`moduloreportes/printcomprobant/${codventa}`,{responseType: 'blob'})
        .then((response) => {
            return response.data;
        })
    },

    getprintreportecuadrecaja(idcaja:any){
        return axios.get(`moduloreportes/printcuadrecaja/${idcaja}`,{responseType: 'blob'})
        .then((response) => {
            return response.data;
        })
    }
}