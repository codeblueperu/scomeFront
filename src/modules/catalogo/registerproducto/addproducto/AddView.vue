<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Registro de Productos</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'list'}" label="Principal"/> 
                    <q-breadcrumbs-el icon="home" :to="{name:'add'}" label="Registro"/>                  
                </q-breadcrumbs>
                
            </div>
        </div>

        <!-- CONTENT MAIN -->
        <div class="container">
            <div class="row justify-between">
                <div class="col-xs-12 col-md-12">
                    <div class="card">
                        <div class="card-body">
                           <div class="q-pa-md q-gutter-lg q-pa-md">

                                    <div class="row">
                                        <div class="col-xs-12 col-md-3 ">
                                            <q-input autocomplete="off" hint="Ingrese un codigo de barra unico" @keyup="onKeyBuscarProducto($event)"  clearable filled type="text" :dense="isdense"  v-model="formData.code_barra"
                                              label="Codigo Barra"  :rules="validations[0]" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="qr_code_2" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-4 ">
                                            <q-input autocomplete="off"  hint="Ingrese el nombre del producto" clearable filled type="text" :dense="isdense"  v-model="formData.titulo_producto"
                                              label="Nombre Producto" class="q-pa-xs" lazy-rules
                                                :rules="validations[1]" >
                                                <template v-slot:prepend>
                                                    <q-icon name="drive_file_rename_outline" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-5 ">
                                            <q-input autocomplete="off"  hint="Ingrese una descripción del producto" clearable filled type="text" :dense="isdense" v-model="formData.descripcion_corta" 
                                                label="Descripción Producto" class="q-pa-xs" :rules="validations[2]" >
                                                <template v-slot:prepend>
                                                    <q-icon name="subtitles" />
                                                </template>
                                            </q-input>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-md-4">      
                                            <q-select
                                                filled
                                                v-model="cbocodfamilia"
                                                use-input
                                                hide-selected
                                                fill-input
                                                input-debounce="0"
                                                label="Familia Categoria"
                                                :options="optionsFamilia"
                                                option-value="cod_familia_cat"
                                                option-label="descripcion_familia"
                                                color="primary" emit-value map-options
                                                @update:model-value="val => onChangeCategoria(val)"
                                                @filter="filtrarFamilia"   
                                                hint="Seleccione una opción"
                                                class="q-pa-xs"    
                                                :rules="validations[3]"                                     
                                            >
                                                <template v-slot:no-option>
                                                <q-item>
                                                    <q-item-section class="text-grey">
                                                     No hay Datos..
                                                    </q-item-section>
                                                </q-item>
                                                </template>
                                            </q-select>                              
                                        </div>
                                        <div class="col-xs-12 col-md-4">
                                            <q-select
                                                filled
                                                v-model="formData.cod_categoria"
                                                use-input
                                                hide-selected
                                                fill-input
                                                input-debounce="0"
                                                label="Categoria Producto"
                                                :options="optionscategoria"
                                                option-value="cod_categoria"
                                                option-label="descripcion_categoria"
                                                color="primary" emit-value map-options
                                                @update:model-value="val => onchageMarca(val)"
                                                @filter="filtrarCategoria"   
                                                hint="Seleccione una opción"
                                                class="q-pa-xs"       
                                                :rules="validations[3]"                                 
                                            >
                                                <template v-slot:no-option>
                                                <q-item>
                                                    <q-item-section class="text-grey">
                                                     No hay Datos..
                                                    </q-item-section>
                                                </q-item>
                                                </template>
                                            </q-select>   
                                        </div>
                                        <div class="col-xs-12 col-md-4">
                                            <q-select filled v-model="formData.cod_marca" :dense="isdense"
                                             :options="optionmarcas"
                                             option-value="cod_marca" hint="Seleccione una opción"
                                             option-label="descripcion_marca" emit-value map-options
                                             label="Marca Producto"
                                             class="q-pa-xs" :rules="validations[3]" >
                                                <template v-slot:prepend>
                                                    <q-icon name="collections_bookmark" />
                                                </template>
                                                <template v-slot:no-option>
                                                <q-item>
                                                    <q-item-section class="text-grey">
                                                     No hay Datos..
                                                    </q-item-section>
                                                </q-item>
                                                </template>
                                            </q-select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-md-3 ">
                                            <q-input autocomplete="off" :dense="isdense" hint="Ingrese el STOCK de compra" :rules="validations[4]" clearable filled v-model="formData.stock" min="0" type="number"  label="Stock Ingreso"  class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="confirmation_number" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-3 ">
                                            <q-input autocomplete="off" :dense="isdense" hint="Ingrese el STOCK de venta" :rules="validations[4]" :disable="disable"  clearable filled v-model="formData.stock_egreso" min="0" type="number"  label="Stock Egreso"  class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="confirmation_number" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" clearable filled v-model="formData.precio_compra"
                                                mask="#.##" fill-mask="0" reverse-fill-mask
                                             hint="Ingrese precio de compra"  label="Precio Compra" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="price_change" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" clearable filled v-model="formData.precio_unitario"
                                             hint="Ingrese precio venta por unidad" label="Precio Venta Unidad."
                                             mask="#.##" fill-mask="0" reverse-fill-mask class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="price_check" />
                                                </template>
                                            </q-input>
                                        </div>
                                        
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" clearable filled v-model="formData.precio_mayor" 
                                                mask="#.##" fill-mask="0" reverse-fill-mask 
                                                hint="Ingrese precio venta por cantidad" label="Precio Venta Cantidad" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="monetization_on" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" clearable filled v-model="formData.cantidad_venta_mayor"
                                                hint="Aplicar precio por cantidad apartir de?" label="Precio cantidad desde?" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="confirmation_number" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-md-3 ">
                                            <q-input autocomplete="off" :dense="isdense" :rules="validations[5]" clearable filled v-model="formData.numero_lote"  label="N° Lote" type="text" hint="Ingrese un numero de lote"  class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="ballot" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" type="date" clearable filled v-model="formData.fecha_compra"
                                              label="Fecha Compra" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>                                      
                                        
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" type="date" clearable filled v-model="formData.fecha_elaboracion"  label="Fecha Elabración" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-md-3">
                                            <q-input autocomplete="off" :dense="isdense" type="date" clearable filled v-model="formData.fecha_caduca"  label="Fecha Caducación" class="q-pa-xs">
                                                <template v-slot:prepend>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>                                                                                
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-md-4 q-pa-xs">   
                                            <div class="flex bg-grey-2 q-pa-sm rounded-borders">                                                                                   
                                                <q-input style="width:150px" :dense="true" type="color" hint="Seleccione un color"
                                                    filled
                                                    v-model="formDataColor.color">
                                                        <template v-slot:prepend>
                                                            <q-icon name="format_color_fill" />
                                                        </template>
                                                </q-input>
                                                <q-input style="width:90px" v-model="formDataColor.cantidad" type="number" input-class="text-center" :dense="true" hint="Cantidad" min="1"/>
                                                <q-btn style="width:30px;height: 30px;" round color="warning" icon="add" @click="addColor(formDataColor.color,formDataColor.cantidad)"  />
                                                    <q-list class="lista" bordered separator>
                                                        <q-item v-for="clr in listColores" :key="clr.color" clickable v-ripple>
                                                            <q-item-section avatar>
                                                                <q-avatar :style="{background: clr.color }" text-color="white" icon="opacity" />
                                                            </q-item-section>
                                                            <q-item-section>Stock: <b>{{ clr.cantidad }}</b></q-item-section>
                                                            <q-item-section><q-btn style="width:20px;height: 20px;" size="sm" @click="deleteColor( clr.color )" outline round color="negative" icon="delete"/></q-item-section>
                                                        </q-item>
                                                    </q-list>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-md-4 q-pa-xs" >
                                            <div class="flex bg-grey-2 q-pa-sm rounded-borders">
                                                <q-input autocomplete="off" style="width:150px" :dense="true" type="text" hint="Ingrese una talla" class="text-mayus"
                                                    filled
                                                    v-model="formDataTalla.talla">
                                                        <template v-slot:prepend>
                                                            <q-icon name="crop" />
                                                        </template>
                                                </q-input> 
                                                <q-input autocomplete="off" style="width:90px" v-model="formDataTalla.cantidad" type="number" input-class="text-center" :dense="true" hint="Cantidad" min="1"/>
                                                <q-btn style="width:30px;height: 30px;" round color="warning" icon="add" @click="addTalla(formDataTalla.talla,formDataTalla.cantidad)"/>
                                                    <q-list class="lista" bordered separator>
                                                        <q-item v-for="tl in listTallas" :key="tl.color" clickable v-ripple>
                                                            <q-item-section avatar> 
                                                                <q-avatar class="talla-icon" rounded  color="primary" text-color="white">{{ tl.talla }}</q-avatar>
                                                            </q-item-section>
                                                            <q-item-section>Stock: <b>{{ tl.cantidad }}</b></q-item-section>
                                                            <q-item-section><q-btn style="width:20px;height: 20px;" @click="deleteTalla( tl.talla )" size="sm" outline round color="negative" icon="delete"/></q-item-section>
                                                        </q-item>
                                                    </q-list>
                                            </div>                                             
                                        </div> 
                                        <div class="col-xs-12 col-md-3 q-pa-xs">
                                           <q-btn icon="article" class="" label="Crear Ficha tecnica" color="dark" @click="openModalFicha = true" />
                                           <q-toggle
                                            label="Activar la venta del producto"
                                            v-model="formData.estado"
                                            />
                                           <q-dialog v-model="openModalFicha">
                                                <q-card>
                                                    <q-card-section>
                                                        <div class="text-h6">Ficha Tecnica del producto</div>
                                                    </q-card-section>
                                                        <q-separator />
                                                    <q-card-section style="width:40vw;height: 60vh" class="scroll">
                                                        <div class="">
                                                            <q-editor v-model="descripcionFicha.body_ficha" min-height="5rem" />
                                                        </div>
                                                    </q-card-section>
                                                        <q-separator />
                                                    <q-card-actions align="right">                                                        
                                                        <q-btn label="Cancelar" color="dark" v-close-popup />
                                                    </q-card-actions>
                                                </q-card>
                                            </q-dialog>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-12 col-md-12">
                                           <q-toolbar class="bg-primary text-white shadow-2">
                                                <q-toolbar-title>Imagen(s)</q-toolbar-title>
                                           </q-toolbar>
                                           <q-list bordered>
                                                 <!-- FILE LIST -->
                                                <q-file
                                                    v-model="files"
                                                    label="Seleccionar imagene(s)"
                                                    outlined
                                                    counter
                                                    multiple
                                                    :clearable="true"
                                                    style="width: 100%"
                                                >
                                                    <template v-slot:prepend>
                                                    <q-icon name="add_photo_alternate" />
                                                    </template>
                                                    <template v-slot:file="{ index, file }">
                                                        <q-chip 
                                                            @remove="cancelFile(index)"
                                                            class="full-width q-my-xs"
                                                            
                                                        >   
                                                            <q-avatar >
                                                                <img :src="preview(file)">
                                                            </q-avatar>
                                                            <div class="ellipsis relative-position">
                                                                {{ file.name }}
                                                            </div>
                                                        </q-chip>
                                                        
                                                    </template>
                                                </q-file>
                                                 <!-- END FILE LIST -->
                                           </q-list>
                                        </div>
                                    </div>                                    
                                    <div class="flex justify-end">
                                        <q-btn label="Procesar" @click="onSave()" color="primary"/>
                                        <q-btn label="Cancelar" @click="onClear()" color="primary" flat class="q-ml-sm" />
                                    </div>
                                <!--  </q-form>  -->                               
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END CONTENT MAIN -->
    </q-page>
</template>
<style scoped>
    .card-body{
        display: block;
        font-size: 12px !important;
    }
    .lista{
        width:100%; 
        max-height: 230px;
        overflow:auto
    }
    .talla-icon{
        width: 100px;
    }
</style>
<script src="./Add.ts"></script>