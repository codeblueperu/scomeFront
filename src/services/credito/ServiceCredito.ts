import axios from "axios"

export default {
    getDataCredito(){
        return axios.get(`modulocredito/credito`)
        .then((response) => {
            return response.data;
        })
    },
    postSavecredito(data:any){
        if(data.cod_deuda == 0){
            return axios.post(`modulocredito/credito`,data)
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.put(`modulocredito/credito/${data.cod_deuda}`,data)
            .then((response) => {
                return response.data;
            })
        }        
    },
    getCreditoID(id:any){
        return axios.get(`modulocredito/credito/${id}`)
        .then((response) => {
            return response.data;
        })
    },
    deleteCredito(id:any){
        return axios.delete(`modulocredito/credito/${id}`)
        .then((response) => {
            return response.data;
        })
    },
    getDetalledeudaCreditoID(coddeuda:any){
        return axios.get(`modulocredito/buscardetalledeuda/${coddeuda}`)
        .then((response) => {
            return response.data;
        })
    },
    postGuardarNuevoAdelante(data:any){
        return axios.post(`modulocredito/guardarnuevoingreso`,data)
        .then((response) => {
            return response.data;
        })
    }
}