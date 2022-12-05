import axios from "axios"

export default {
    getCatalogoProducto(status:string){
        return axios.get(`mantenimiento/producto/estado/${status}`)
        .then((response) => {
            return response.data;
        })
    },
    getbuscarcuponDescuento(numerocupon:string){
        return axios.get(`operaciones/buscarcuponDescuento/${numerocupon}`)
        .then((response) => {
            return response.data;
        })
    },
    getbuscarcuponCliente(numerodocumento:string){
        return axios.get(`operaciones/buscarcliente/${numerodocumento}`)
        .then((response) => {
            return response.data;
        })
    },
    postCuponVenta(data:any){
        if(data.cod_descuento == 0){
            return axios.post(`operaciones/descuentoventa`,data)
            .then((response) => {          
                return response.data;
            })
        }else{
            return axios.put(`operaciones/descuentoventa/${data.cod_descuento}`,data)
            .then((response) => {          
                return response.data;
            })
        }
        
    },
    getListaCupones(fechaInit:any,fechaFin:any){
        return axios.get(`operaciones/descuentoventa/filter/${fechaInit}/${fechaFin}`)
        .then((response) => {
            return response.data;
        })
    },
    getCuponVentaID(id:string){
        return axios.get(`operaciones/descuentoventa/${id}`)
        .then((response) => {
            return response.data;
        })
    },
    getEliminarCuponVenta(id:string){
        return axios.delete(`operaciones/descuentoventa/${id}`)
        .then((response) => {
            return response.data;
        })
    },
    searchproductocodigobarra(codbarra:string){
        return axios.get(`mantenimiento/buscarproductocodigobarra/${codbarra}`)
        .then((response) => {
            return response.data;
        })
    },
    addCodigoBarraFilter(codbarra:string){
        return axios.get(`mantenimiento/codigobarra/venta/${codbarra}`)
        .then((response) => {
            return response.data;
        })
    },
    postOthrerProducto(data:any){    
        return axios.post(`mantenimiento/otherproductoflask`,data)
        .then((response) => {          
            return response.data;
        })
        
    },
}