import { CajaEntity } from "@/interfaces/IntCaja";
import axios from "axios"

export default {
    listaCaja(fechainit:any,fechafin:any){
        return axios.get(`operaciones/caja/filtrar/${fechainit}/${fechafin}`)
        .then((response) => {
            return response.data;
        })
    },
    srvOpenCaja(data:CajaEntity){
        if(data.cod_caja === 0){
            return axios.post('operaciones/caja',data)
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.put('operaciones/caja/'+data.cod_caja, data)
            .then((response) => {
                return response.data;
            })
        }
        
    },
    srvBuscarCajaID(codigo:number){
        return axios.get('operaciones/caja/'+codigo)
        .then((response) => {
            return response.data;
        })
    },
    srvEstadoCaja(){
        return axios.get('operaciones/caja/verificarcaja/1')
        .then((response) => {
            return response.data;
        })
    },
    
}