<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-6 col-sm-6 col-md-6">Categoria</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-6 col-sm-6 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'categoria'}" label="Principal"/>                
                </q-breadcrumbs>
            </div>
        </div>

        <!-- CONTENT MAIN -->
        <div class="container">
            <div class="row justify-between ">
                <!-- DATA INIT -->
                <div class="col-xs-12 col-md-8">
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
                                    :loading="visible"
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
                                                    <q-chip v-if="col.name === 'estado'" :color="col.value === 1 ? 'teal' : 'deep-orange'" text-color="white">{{ col.value === 1 ? 'Activo' : 'Inactivo' }}</q-chip>
                                                    <div v-else>{{ col.value }}</div>
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
                <!-- FORMULARIO -->
                <div class="col-xs-12 col-md-4">
                    <div class="card" >
                        <div class="card-header">
                            <h3>Nuevo Registro</h3>
                        </div>
                        <div class="card-body" >
                            <div class="q-pa-sm">
                                <q-form
                                    @submit="OnCreate"
                                    @reset="onReset"
                                    class="q-gutter-lg q-pa-md"
                                 >
                                 <q-select
                                    outlined 
                                    v-model="forData.cod_familia_cat"
                                    label="Seleccione Familia"
                                    :dense="true"
                                    use-input
                                    input-debounce="0"
                                    :options="options"
                                    @filter="filtrarData"
                                    option-value="cod_familia_cat"
                                    option-label="descripcion_familia"
                                    emit-value
                                    map-options
                                    behavior="menu"
                                    :error-message="dataError.hasOwnProperty('cod_familia_cat') === false ? '' : dataError.cod_familia_cat[0]"
                                    :error="!isValidCofFamilia"
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin datos que mostrar
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                                    <q-input
                                    :dense="true"
                                        v-model="forData.descripcion_categoria" 
                                        type="text"
                                        label="Descripcion"
                                        hint="Ingrese una descripción"
                                        :error-message="dataError.hasOwnProperty('descripcion_categoria') === false ? '' : dataError.descripcion_categoria[0]"
                                        :error="!isValidDescription"
                                        autocomplete="off"
                                     />
                                    <q-toggle v-model="forData.estado" label="Estado" />
                                    <div class="flex items-center justify-center">
                                        <q-btn label="guardar" type="submit" color="primary"/>
                                        <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" />
                                    </div>
                                </q-form>
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
    @import './StyleCategoria.css';
</style>
<script src="./categoria.ts"></script>