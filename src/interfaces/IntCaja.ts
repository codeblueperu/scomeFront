export interface CajaEntity{
    cod_caja?:number,
    descripcion_caja?:string,
    fecha_apertura?:Date|string,
    fecha_cierre?:Date|string,
    monto_inicial:number,
    monto_efectivo?:number,
    monto_digital?:number,
    monto_ingreso?:number,
    monto_gasto?:number,
    monto_total?:number,
    estado:number|string,
    cod_sucursal?:number,
    cod_usuario?:number
}