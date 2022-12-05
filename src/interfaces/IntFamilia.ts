export interface FamiliaEntity {
    cod_familia_cat?: number,
    descripcion_familia: string,
    estado: boolean|number,
    familia?:FamiliaEntity
}