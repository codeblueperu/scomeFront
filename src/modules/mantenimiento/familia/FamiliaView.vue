<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-6 col-md-8">Familia Categoria</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-12 col-sm-6 col-md-4">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'family'}" label="Principal"/>                
                </q-breadcrumbs>
            </div>
        </div>

        <!-- CONTENT MAIN -->
        <div class="container">
            <div class="row justify-between ">
                <!-- DATA INIT -->
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
                <div class="col-xs-12 col-md-5">
                    <div class="card">
                        <div class="card-header">
                            <h3>Nuevo Registro</h3>
                        </div>
                        <div class="card-body">
                            <div class="q-pa-sm">
                                <q-form
                                    @submit="OnCreate"
                                    @reset="onReset"
                                    class="q-gutter-lg q-pa-md"
                                 >
                                    <q-input
                                        v-model="forData.descripcion_familia" 
                                        type="text"
                                        label="Descripcion"
                                        hint="Ingrese una descripción"
                                        :error-message="dataError.hasOwnProperty('descripcion_familia') === false ? '' : dataError.descripcion_familia[0]"
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
    @import './StyleFamilia.css';
</style>
<script src="./familia.ts"></script>