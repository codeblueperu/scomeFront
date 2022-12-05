<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-6 col-sm-6 col-md-6">Marca Producto</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-6 col-sm-6 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'marca'}" label="Principal"/>                
                </q-breadcrumbs>
            </div>
        </div>

        <!-- CONTENT MAIN -->
        <div class="container">
            <div class="row justify-between">
                <!-- TABLA DE CONTENIDO -->
                <div class="col-xs-12 col-md-7">
                    <div class="card">
                        <div class="card-header">
                            <h3>Lista de Registros</h3>
                        </div>
                        <div class="card-body">
                            <div class="q-pa-md">
                                <q-table
                                    :rows="rows"
                                    :columns="columns"
                                    row-key="name"
                                    :loading="visibleLoading"
                                    :filter="filterdata"
                                >
                                    <template v-slot:top>
                                        <q-space />
                                        <q-input borderless dense debounce="300" label="Buscar" color="primary" v-model="filterdata">
                                        <template v-slot:append>
                                            <q-icon name="search" />
                                        </template>
                                        </q-input>
                                    </template>
                                    <template v-slot:no-data="{ icon, message, filter }">
                                        <div class="full-width row flex-center text-accent q-gutter-sm">
                                            <q-icon size="2em" name="widgets" />
                                            <span>Sin datos que mostrar...</span>
                                        </div>
                                    </template>
                                    <template v-slot:header="props">
                                        <q-tr :props="props">                                       
                                        <q-th 
                                            v-for="col in props.cols"
                                            :key="col.name"
                                            :props="props"
                                        >
                                            {{ col.label }}
                                        </q-th>
                                         <q-th auto-width />
                                        </q-tr>
                                    </template>
                                    <template v-slot:body="props">
                                            <q-tr :props="props">                                                
                                                <q-td
                                                    v-for="col in props.cols"
                                                    :key="col.name"
                                                    :props="props"
                                                >
                                                <q-avatar v-if="col.name === 'logo'">
                                                    <img :src="col.value">
                                                </q-avatar>
                                                <p v-else>{{ col.value }}</p>                                                
                                                </q-td>
                                                <q-td auto-width>
                                                    <q-btn size="sm" color="warning" icon="edit" round dense  @click="OnEdit(props.row.name)"/>
                                                    <q-btn size="sm" class="q-ml-xs" color="negative" icon="delete" round dense  @click="OnDelete(props.row.name)"/>
                                                </q-td>
                                            </q-tr>                                    
                                    </template>
                                </q-table>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END TABLE CONTENIDO -->

                <!-- CARD FORMULARIO -->
                <div class="col-xs-12 col-md-5">
                    <div class="card">
                        <div class="card-header">
                            <h3>Nuevo Registro</h3>
                        </div>
                        <div class="card-body">
                            <div class="q-pa-sm">
                                
                                <q-form @submit="OnCreate" @reset="onReset" class="q-gutter-lg q-pa-md">
                                    <q-select
                                    outlined 
                                    v-model="formData.cod_categoria"
                                    label="Seleccione Categoria"
                                    :dense="true"
                                    use-input
                                    input-debounce="0"
                                    :options="options"
                                    @filter="filtrarData"
                                    @filter-abort="abortFilterFn"
                                    option-value="cod_categoria"
                                    option-label="descripcion_categoria"
                                    emit-value
                                    map-options
                                    behavior="menu"
                                    :error-message="dataError.hasOwnProperty('cod_categoria') === false ? '' : dataError.cod_categoria[0]"
                                    :error="!isValidCocategoria"
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin datos que mostrar
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                                    <!-- <q-select
                                        v-model="formData.cod_categoria"
                                        :options="options"
                                        option-value="cod_categoria"
                                        option-label="descripcion_categoria"
                                        color="primary"                                        
                                        clearable
                                        emit-value
                                        map-options
                                        label="Seleccione Categoria"
                                        :error-message="dataError.hasOwnProperty('cod_categoria') === false ? '' : dataError.cod_categoria[0]"
                                        :error="!isValidCocategoria"
                                    /> -->
                                    <q-input
                                        :dense="true"
                                       v-model="formData.descripcion_marca"
                                        type="text"
                                        label="Descripcion"
                                        hint="Ingrese una descripción"
                                        :error-message="dataError.hasOwnProperty('descripcion_marca') === false ? '' : dataError.descripcion_marca[0]"
                                        :error="!isValidaMarca"
                                        autocomplete="off"
                                     />
                                    <q-input                                      
                                        @update:model-value="val => { formData.logo = val[0] }"
                                        filled
                                        type="file"
                                        hint="solo .jpg - .jpeg - .png"
                                        :error-message="dataError.hasOwnProperty('logo') === false ? '' : dataError.logo[0]"
                                        :error="!isValidLogo"
                                        autocomplete="off"
                                    />
                                    <div class="flex items-center justify-center">
                                        <q-btn label="guardar" type="submit" color="primary"/>
                                        <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" />
                                    </div>
                                    
                                </q-form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END CARD FORMULARIO -->
            </div>
        </div>
        <!-- END CONTENT MAIN -->
    </q-page>
</template>
<style scoped>
@import url('./StyleMarca.css');
</style>
<script src="./Marca.ts"></script>