<template>
      <q-dialog
      v-model="showModal" persistent
      
    >
      <q-card style="width: 800px; max-width: 80vw;" id="modal-component">
        <q-form @submit="onProcesar"
            @reset="onLimpiar" autocomplete="off" ref="formulario">
            <q-card-section>
            <div class="text-h6">Datos Personales</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="row">
                    <div class="col-md-4">
                        <q-input class="q-mr-sm" outlined color="purple-10" v-model="formData.nombre" label="Apellidos y Nombres (*)"
                        :rules="validForm[0]" autocomplete="off">
                            <template v-slot:prepend>
                            <q-icon name="account_circle" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-md-4">
                        <q-select class="q-mr-sm"
                            outlined
                            v-model="formData.cod_tipo_documento"
                            :options="optionTipoDoc"
                            color="purple-10" 
                            label="Tipo Documento (*)"
                            :rules="validForm[5]"
                            option-value="cod_tipo_documento"
                            option-label="descripcion_documento"
                            emit-value
                            map-options
                            >
                            <template v-slot:prepend>
                                <q-icon name="recent_actors" />
                            </template>
                        </q-select>
                    </div>
                    <div class="col-md-4">
                        <q-input class="q-mr-sm" outlined color="purple-10" v-model="formData.dni" label="Numero Documento (*)"
                        :rules="validForm[1]" autocomplete="off">
                            <template v-slot:prepend>
                            <q-icon name="contact_emergency" />
                            </template>
                        </q-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <q-input class="q-mt-md q-mr-sm" outlined color="purple-10" v-model="formData.direccion" label="Dirección"
                        :rules="validForm[2]" autocomplete="off">
                            <template v-slot:prepend>
                            <q-icon name="home" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-md-6">
                        <q-input class="q-mt-md q-mr-sm" outlined color="purple-10" v-model="formData.email" label="Email (*)" 
                        :rules="validForm[3]" autocomplete="off">
                            <template v-slot:prepend>
                            <q-icon name="alternate_email" />
                            </template>
                        </q-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <q-input class="q-mt-md q-mr-sm" outlined color="purple-10" v-model="formData.celular" label="Celular (*)"
                        :rules="validForm[4]" autocomplete="off">
                            <template v-slot:prepend>
                            <q-icon name="phone_iphone" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-md-4">
                        <q-select class="q-mt-md q-mr-sm" outlined v-model="formData.cod_cargo" :options="optionCargos" color="purple-10" label="Cargo (*)"
                            :rules="validForm[5]"
                            option-value="cod_cargo"
                            option-label="descripcion_cargo"
                            emit-value
                            map-options
                        >
                            <template v-slot:prepend>
                                <q-icon name="support_agent" />
                            </template>
                        </q-select>
                    </div>
                    <div class="col-md-4">
                        <q-select class="q-mt-md q-mr-sm" outlined v-model="formData.cod_sucursal" :options="optionSucursales" color="purple-10" label="Sucursal (*)"
                            :rules="validForm[5]"
                            option-value="cod_sucursal"
                            option-label="nombre_sucursal"
                            emit-value
                            map-options>
                            <template v-slot:prepend>
                                <q-icon name="dns" />
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <q-input class="q-mt-md q-mr-sm" outlined color="purple-10" v-model="formData.contrasenia" label="Contraseña (*)" 
                        :rules="validForm[6]" :type="isPwd ? 'password' : 'text'">
                            <template v-slot:prepend>
                                <q-icon name="password" />
                            </template>
                            <template v-slot:append>
                                <q-icon
                                    :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd"
                                />
                            </template>
                        </q-input>
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="bg-white">
            <q-btn outline label="cancelar" v-close-popup color="red-9" />
            <q-btn push label="Guardar" type="submit" color="purple-9"/>
            </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
</template>
<script lang="ts" >
import { onMounted, Ref, ref } from 'vue';
import ValidadExpresion from '@/services/error/ValidadExpresion'
import SrvConfiguration from '@/services/setting/ConfiguracionService'
import HandlerError from '@/services/error/HandlerError';
import srvsecurity from '@/services/security/ServiceSecurity'
import Swal from 'sweetalert2';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
   export default{
        setup(props, context){
            let quasar = useQuasar();
            const router = useRouter();
            
            let showModal = ref(false)
            let formData = ref({
                cod_persona:0,
                nombre:'',
                cod_tipo_documento:'Seleccione',
                dni:'',
                direccion:'',
                email:'',
                celular:'',
                cod_cargo:'',
                cod_sucursal:'',
                contrasenia:'',
                cod_usuario:''
            })
            let optionTipoDoc = ref([])
            let optionCargos = ref([])
            let optionSucursales = ref([])
            let isPwd = ref(true)
            let formulario:Ref<any> = ref(null)
            let validForm = [
                [ (val:any) => !!val || 'Este campo es Obligatorio!',
                    (val:any) => ValidadExpresion.validLetras(val) == true || "Ingrese solo letra."
                    ,(val:any) => val.length <= 85 || 'Ingrese un máximo de 85 caracteres.'],
                [(val:any) => !!val || 'Este campo es Obligatorio!',
                    (val:any) => ValidadExpresion.validNumeros(val) == true || 'Ingrese solo Numeros.'
                    ,(val:any) => val.length <= 12 || 'Ingrese un maximo de 12 caracteres.'
                ],
                [(val:any) => val.length <= 70 || 'Ingrese un maximo de 70 caracteres.'],
                [(val:any) => !!val || 'Este campo es Obligatorio!',
                    (val:any) => ValidadExpresion.validarEmail(val) == true || 'Ingrese una dirección de correo valido.'
                    ,(val:any) => val.length <= 75 || 'Ingrese un maximo de 12 caracteres.',
                ],
                [(val:any) => !!val || 'Este campo es Obligatorio!',
                    (val:any) => ValidadExpresion.validNumeros(val) == true || 'Ingrese numero valido.'
                ],
                [(val:any) => !!val || 'Este campo es Obligatorio!',
                ],
                [(val:any) => !!val || 'Este campo es Obligatorio!',
                (val:any) => val.length <= 20 || 'Ingrese un máximo de 20 caracteres.',
                (val:any) => ValidadExpresion.validPassword(val) == true || 'Debe de tener entre MINUSCULAS, MAYUSCULAS Y  SIMBOLOS. Ejemplo: SCOMEperu2022**',
                ]
            ];
            
            const onModalshow = ((flat:boolean) => {
                showModal.value = flat
            })

            const onProcesar = (async () => {
              __onLoading("Procesando registro....");
              await srvsecurity.postCrearcuentaUsuario(formData.value)
              .then((rpt) => {    
                quasar.loading.hide();
                onLimpiar();      
                Swal.fire({icon:'success',title:'Bien echo!',html:rpt.message})   
                context.emit('reloadTable', true)
            })
              .catch((error) => {
                    quasar.loading.hide();
                    HandlerError.errorGlobal(error.response)
                })
            })

            const onBuscarPersonaID = (async (codpersona:any) => {
                await srvsecurity.getBuscarpersonaID(codpersona)
                .then(({data}) => {
                    quasar.loading.hide()                   
                    formData.value = {
                        cod_persona:data.cod_persona,
                        nombre:data.nombres,
                        cod_tipo_documento:data.cod_tipo_documento,
                        dni: data.numero_documento,
                        direccion:data.direccion,
                        email:data.email,
                        celular:data.numero_telefono,
                        cod_cargo:data.cod_cargo,
                        cod_sucursal:data.cod_sucursal,
                        contrasenia: 'SCOMEperu2022**',
                        cod_usuario:data.cod_usuario
                    };
                    showModal.value = true
                })
            })

            const onEliminarCuenta = (async (codpersona:any) =>{
                __onLoading("Eliminando registro......")
                await srvsecurity.deleteEliminarPersonausuario(codpersona)
                    .then((rpt) => {    
                    quasar.loading.hide();  
                    Swal.fire({icon:'success',title:'Bien echo!',html:rpt.message})   
                    context.emit('reloadTable', true)
                })
                .catch((error) => {
                    quasar.loading.hide();
                    HandlerError.errorGlobal(error.response)
                })
                
            })

            const onLimpiar = (() => {
                formData.value = {
                    cod_persona:0,
                    nombre:'',
                    cod_tipo_documento:'Seleccione',
                    dni:'',
                    direccion:'',
                    email:'',
                    celular:'',
                    cod_cargo:'',
                    cod_sucursal:'',
                    contrasenia:'',
                    cod_usuario:''
                };
                showModal.value = false
            })

            const __onLoading = ((message:string) => {
                quasar.loading.show({
                    html:true,
                    message: '<b class="fm-poppis">'+message+'</b>',
                    boxClass: 'bg-grey-2 text-grey-9',
                    spinnerColor: 'primary',
                    customClass:'fm-poppis'
                })
            })

            onMounted(async () => {
                /* LISTA TIPO DOCUMENTOS */
                await SrvConfiguration.getListaTipoDocumentos()
                .then(({data}) => {
                    optionTipoDoc.value = data;
                })
                .catch((error) => {
                    HandlerError.errorGlobal(error.response)
                })

                /* LISTA CARGOS */
                await SrvConfiguration.getListaCargo()
                .then(({data}) => {
                    optionCargos.value = data
                })
                .catch((error) => {
                    HandlerError.errorGlobal(error.response)
                })

                /* LISTA SUCURSALES */
                await SrvConfiguration.getListaSucursales()
                .then(({data}) => {
                    optionSucursales.value = data
                })
                .catch((error) => {
                    HandlerError.errorGlobal(error.response)
                })
            })
            
            return{
                showModal,formData,optionTipoDoc,
                onModalshow,validForm,isPwd,
                onProcesar,onLimpiar,formulario,
                optionCargos,optionSucursales,
                onBuscarPersonaID,onEliminarCuenta
            }
        }
   }
</script>