import { Ref } from "vue";

export interface MarcaEntity{
    cod_marca?:number | string,
    descripcion_marca:string,
    logo?:string | Ref | null,
    cod_categoria:number|string
}