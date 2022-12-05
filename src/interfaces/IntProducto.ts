export interface Producto {
    cod_producto?: number | string,
    code_barra: string,
    titulo_producto: string,
    descripcion_corta?: string,
    descripcion_larga?: string,
    stock: number,
    precio_compra:number,
    precio_unitario: number,
    precio_mayor: number,
    estado: boolean | number,
    cod_categoria:number | string,
    cod_marca:number | string,
    numero_lote:string,
    fecha_compra:Date|  string,
    fecha_elaboracion:Date | string,
    fecha_caduca:Date | string,
    cantidad_venta_mayor:number,
    stock_egreso:number
}

export interface Tallas{
    cod_talla?:number,
    talla:string,
    cantidad:number,
    estado?:boolean | number,
    cod_producto?:number | null
}

export interface Colores{
    cod_color?:number,
    color:string,
    cantidad:number,
    estado?:boolean | number,
    cod_producto?:number | null
}

export interface FichaTecnica{
    cod_ficha?:number,
    body_ficha:string,
    cod_producto?:number | null
}

export interface Image {
    cod_image?:number,
    image_name:File,
    orden:number,
    estado?:boolean | number,
    cod_producto?:number
}

export interface DataErrorProducto{
    code_barra?:boolean | string | [],
    titulo_producto?:any,
    descripcion_corta?:boolean | string | [],
    descripcion_larga?:boolean | string | [],
    stock?:boolean | string | [],
    precio_unitario?:boolean | string | [],
    precio_mayor?:boolean | string | [],
    estado?:boolean | string,
    cod_categoria?:boolean | string | [],
    cod_marca?:boolean | string | [],
    precio_compra?:boolean | string | [],
    numero_lote?:boolean | string | [],
    fecha_compra?:boolean | string | [],
    fecha_elaboracion?:boolean | string | [],
    fecha_caduca?:boolean | string | []
}