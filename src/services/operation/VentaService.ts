import axios from "axios"

export default {
    saveVenta(jsonData:any){
        return axios.post(`operaciones/venta`,jsonData)
        .then((response) => {
            return response.data;
        })
    },
    getDataVentas(fechainit:any,fechafin:any){
        return axios.get(`operaciones/data/venta/${fechainit}/${fechafin}`)
        .then((response) => {
            return response.data;
        })
    },
    postDarBajaVenta(codventa:any){
        return axios.post(`operaciones/data/venta/baja/${codventa}`)
        .then((response) => {
            return response.data;
        })
    }
}