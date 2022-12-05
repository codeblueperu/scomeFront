<template>
    <q-dialog v-model="showmodal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nuevo Producto</div>
        </q-card-section>

        <q-card-section class="q-pt-none ">
            <div class="column flex-inline justify-between">
                <div class="col-md-12">
                    <q-input  v-model="nombreproducto" autofocus label="Nombre Producto (*)" />
                </div><br>
                <div class="col-md-12">
                    <q-input  v-model="cantidad" type="number" min="1" autofocus label="Cantidad (*)" />
                </div><br>
                <div class="col-md-12">
                    <q-input  v-model="precio" type="number" autofocus label="Precio (*)" />
                </div>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn outline label="CANCELAR" v-close-popup color="red-6"  />
          <q-btn label="AGREGAR" @click="addProducto()" color="deep-purple" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script lang="ts">
import { Ref, ref } from 'vue';
import srvProducto from '@/services/operation/ProductService';
import moment from 'moment';
import HandlerError from '@/services/error/HandlerError';
import { useQuasar } from 'quasar';

export default {
    emits: ['addOtherProducto'],
    setup(props:any, context:any){
        const quasar = useQuasar()
        let showmodal = ref(false)
        let nombreproducto = ref(''),
        cantidad = ref(1),
        precio = ref()

        /**************** ABRIR MODAL **********************/
        const openModal = ((flat:boolean) => {
            showmodal.value = flat
        });
        
        /************* AGREGAR PRODUCTO OPCIONAL **********/
        const addProducto = (async () => {
            __onLoading("Un momento, validando....");
            let json = {
                nombre_producto: nombreproducto.value,
                cantidad:cantidad.value,
                precio:precio.value,
                fecha_compra: moment(new Date()).format('yyyy-MM-DD')
            }
            await srvProducto.postOthrerProducto(json)
            .then((response) => {
                quasar.loading.hide();
                showmodal.value = false
                nombreproducto.value = ''
                cantidad.value = 1
                precio.value = ''
                let data = {
                    name: response.data.cod_producto,
                    cod_compra: response.data.cod_compra,
                    producto: response.data.nombre_producto,
                    sotck: response.data.stock_egreso,
                    presentacion: [],
                    preciounitario: response.data.precio_venta_unidad,
                    preciomayor: response.data.precio_venta_cantidad,
                    cantidad: 1,
                    cantidad_venta_mayor:response.data.cantidad_venta_mayor
                }
                context.emit('addOtherProducto',data)
            })
            .catch((error) => {
                quasar.loading.hide();
                console.log(error);
                HandlerError.errorGlobal(error.response)                
            })            
        })

        /* *********** LOADING ************************ */
        const __onLoading = ((message:string) => {
        quasar.loading.show({
                html:true,
                message: '<b class="fm-poppis">'+message+'</b>',
                boxClass: 'bg-grey-2 text-grey-9',
                spinnerColor: 'primary',
                customClass:'fm-poppis'
            })
        });


        return{
            showmodal,nombreproducto,cantidad,precio,openModal,addProducto
        }
    }
}
</script>