import { MarcaEntity } from '@/interfaces/IntMarca';
import { Colores, FichaTecnica, Image, Producto, Tallas } from '@/interfaces/IntProducto';
import axios from 'axios';
import { CategoriaEntity } from '@/interfaces/IntCategoria';
import {FamiliaEntity} from '@/interfaces/IntFamilia'
export default {
    $srvListaDataFamilia(){
        return axios.get('mantenimiento/familiacategoria', {})
        .then((response) => {
            return response.data;
        });
    },
    $srvSaveDataFamilia(Data:FamiliaEntity){
        if(Data.cod_familia_cat === 0){
            return axios.post('mantenimiento/familiacategoria',Data)
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.put('mantenimiento/familiacategoria/'+ Data.cod_familia_cat,Data)
            .then((response) => {
                return response.data;
            })
        }
        
    },
    $srvObtenerFamilia(id:number){
        return axios.get('mantenimiento/familiacategoria/'+id)
        .then((response) => {
            return response.data;
        })
    },
    $srvDeleteFamilia(id:number){
        return axios.delete('mantenimiento/familiacategoria/'+id)
        .then((response) => {
            return response.data;
        })
    },
    /* END FAMILY */
    $srvListaDataCategoria(){
        return axios.get('mantenimiento/categoria', {})
        .then((response) => {
            return response.data;
        });
    },
    $srvSaveDataCategoria(Data:CategoriaEntity){
        if(Data.cod_categoria === 0){
            return axios.post('mantenimiento/categoria',Data)
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.put('mantenimiento/categoria/'+ Data.cod_categoria,Data)
            .then((response) => {
                return response.data;
            })
        }
        
    },
    $srvObtenerCategoria(id:number){
        return axios.get('mantenimiento/categoria/'+id)
        .then((response) => {
            return response.data;
        })
    },
    $srvDeleteCategoria(id:number){
        return axios.delete('mantenimiento/categoria/'+id)
        .then((response) => {
            return response.data;
        })
    },
    $srvListaFamiliaCategoria(id:number){
        return axios.get('mantenimiento/categoria/familia/'+id)
        .then((response) => {
            return response.data;
        })
    },
    /* END CATEGORIA */
    $srvListaDataMarca(){
        return axios.get('mantenimiento/marca', {})
        .then((response) => {
            return response.data;
        });
    },
    $srvListaDataMarcaCategoria(codcategoria:any){
        return axios.get(`mantenimiento/marca/${codcategoria}/listaporcategoria`)
        .then((response) => {
            return response.data;
        });
    },
    $srvSaveDataMarca(Data:MarcaEntity){
        if(Data.cod_marca === 0){
            return axios.post('mantenimiento/marca',Data,{headers:{'content-type': 'multipart/form-data'}})
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.post('mantenimiento/marca/'+ Data.cod_marca, Data,{headers:{'content-type': 'multipart/form-data'}})
            .then((response) => {
                return response.data;
            })
        }
        
    },
    $srvObtenerMarca(id:number){
        return axios.get('mantenimiento/marca/'+id)
        .then((response) => {
            return response.data;
        })
    },
    $srvDeleteMarca(id:number){
        return axios.delete('mantenimiento/marca/'+id)
        .then((response) => {
            return response.data;
        })
    },
    /* END MARCA */
    /* PRODUCTO */
    $srvSaveDataproducto(Data:any,cod_producto:any,action:string){
        if(action =='INSERT'){
            return axios.post('mantenimiento/producto',Data,{headers:{'content-type': 'multipart/form-data'}})
            .then((response) => {
                return response.data;
            })
        }else{
            return axios.post('mantenimiento/producto/'+cod_producto, Data,{headers:{'content-type': 'multipart/form-data'}})
            .then((response) => {
                return response.data;
            })
        }        
    },
    $srvSaveDataColor(Data:Colores){
        /* if(Data.cod_color === 0){ */
            return axios.post('mantenimiento/color',Data)
            .then((response) => {
                return response.data;
            }) 
        /* }else{
            return axios.put('mantenimiento/color/'+ Data.cod_color, Data)
            .then((response) => {
                return response.data;
            })
        } */
                    
    },
    $srvSaveDataTalla(Data:Tallas){
        /* if(Data.cod_talla === 0){ */
            return axios.post('mantenimiento/talla',Data)
            .then((response) => {
                return response.data;
            }) 
       /*  }else{
            return axios.put('mantenimiento/talla/'+ Data.cod_talla, Data)
            .then((response) => {
                return response.data;
            })
        } */
                    
    },
    $srvSaveDataFichaTecnica(Data:FichaTecnica){
        /* if(Data.cod_ficha === 0){ */
            return axios.post('mantenimiento/fichatecnica',Data)
            .then((response) => {
                return response.data;
            })
        /* }else{
            return axios.put('mantenimiento/fichatecnica/'+ Data.cod_ficha, Data)
            .then((response) => {
                return response.data;
            })
        } */                     
    },
    $srvSaveDataImagen(Data:Image){
        return axios.post('mantenimiento/imagen', Data,{headers:{'content-type': 'multipart/form-data'}})
        .then((response) => {
            return response.data;
        })            
    },
    $srvListdataProducto(status:string){
        return axios.get(`mantenimiento/producto/estado/${status}`)
        .then((response) => {
            return response.data;
        })             
    },
    $srvBuscarProductoID(id:string){
        return axios.get('mantenimiento/producto/'+id)
        .then((response) => {
            return response.data;
        })             
    },    
}