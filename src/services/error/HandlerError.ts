import Swal from "sweetalert2"

export default{

    errorGlobal (error:any){
        console.log(error);

        /* BAD REQUEST */
        if(error.status === 400){
            if(error.data.code === "23000"){
                Swal.fire({target: document.getElementById("modal-component")!,icon:'error',html: 'No se puede eliminar un registro que este relacionado.<br> <b>Detalle(s): </b><br>' + error.data.message});
            }else{
                Swal.fire({target: document.getElementById("modal-component")!,icon:'error',html: error.data.message});
            }            
        }

        /* NOT FOUND */
        if(error.status === 404){
            Swal.fire({target: document.getElementById("modal-component")!,icon:'warning',title:'Upps!',html: error.data.message});
        }

        /* CONFLICT */
        if(error.status === 409){
            Swal.fire({target: document.getElementById("modal-component")!,icon:'warning',title:'Upps!',html: error.data.message});
        }

        /* INTERNARL ERROR SERVER */
        if(error.status === 500){
            Swal.fire({target: document.getElementById("modal-component")!,icon:'error',title:'Upps!',html: error.data});
        }

        if(error.status === 401){
            Swal.fire({target: document.getElementById("modal-component")!,icon:'error',title:'Upps!',html: error.data});
        }

        if(error.code === "ERR_NETWORK"){
            Swal.fire({target: document.getElementById("modal-component")!,icon:'warning',title:'ALERTA!',html: `Estimado usuario, no se encontro conexión con el servidor: <b>${error.config.baseURL}</b>`});
        }
    }
}