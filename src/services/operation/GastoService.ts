import axios from "axios"

export default {
    getListaDataGasto(fechaInit:any , fechaFin:any){
        return axios.get(`operaciones/gasto/filter/${fechaInit}/${fechaFin}`)
        .then((response) => {
            return response.data;
        })
    },
    postSavegasto(data:any){
        if(data.cod_gasto == 0){
            return axios.post(`operaciones/gasto`,data)
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.put(`operaciones/gasto/${data.cod_gasto}`,data)
            .then((response) => {
                return response.data;
            })
        }        
    },
    getBuscargastoID(codgasto:any){
        return axios.get(`operaciones/gasto/${codgasto}`)
        .then((response) => {
            return response.data;
        })
    },
    deleteGastoID(codgasto:any){
        return axios.delete(`operaciones/gasto/${codgasto}`)
        .then((response) => {
            return response.data;
        })
    },
}