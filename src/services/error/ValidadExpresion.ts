export default{
    validLetras(value:any){
        let pattern= new RegExp("[a-zA-Z ñÑáéíóúÁÉÍÓÚ\s]+$");
        return pattern.test(value)
    },
    validNumeros(value:any){
        let pattern= new RegExp("[0-9]+$");
        return pattern.test(value)
    },
    validarEmail(value:any){
        let pattern = new RegExp(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i);
        return pattern.test(value)
    },
    validPassword(value:any){
        let pattern  = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{4,10}/);
        return pattern.test(value)
    }
}