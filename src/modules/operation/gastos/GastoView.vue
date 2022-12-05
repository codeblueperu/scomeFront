<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Mis Gastos</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'gastos'}" label="Principal"/>                 
                </q-breadcrumbs>
            </div>
        </div>
        <div class="container">
            <div class="row justify-between items-stretch">
                <div class="col-xs-12 col-md-8">
                    <q-table
                        class="q-pd-md"
                        style="width:99%"
                        :rows="row"
                        :columns="column"
                        row-key="name"
                        :loading="isLoadingTable"
                        :filter="filterdata"
                        :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
                        :visible-columns="['descripcion_gasto','fecha_registro','monto_gasto','actions']"
                    > 
                        <template v-slot:top>
                            <q-space />
                                <div class="row q-pa-md flex  justify-around items-start" style="width:1000%">
                                    <q-input v-model="fechainicio" :dense="true" outlined type="date" label="Fecha Inicio" />
                                    <q-input v-model="fechafin" :dense="true" outlined type="date" label="Fecha Termino" />
                                    <q-btn icon="search" color="light-green-10" label="filtrar" @click="getListaGasto()" />
                                    <q-input borderless dense debounce="300" label="Buscar" color="primary" v-model="filterdata">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                                </div>                                
                        </template>                 
                        <template v-slot:no-data="{ icon, message, filter }">
                            <div class="full-width row flex-center text-accent q-gutter-sm">
                                <q-icon size="2em" name="widgets" />
                                <span>Sin datos que mostrar...</span>
                            </div>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                            <q-btn size="sm" color="warning" icon="edit" round dense @click="onEdit(props.row)"></q-btn>
                            <q-btn size="sm" class="q-ml-xs" color="negative" icon="delete" round dense @click="onDelete(props.row)"></q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </div>

                <div class="col-xs-12 col-md-4">
                    <q-card style="background:#3A3B41;color:#FFF">
                        <q-form @submit="saveGasto" class="q-gutter-xs q-pa-xs">
                            <q-card-section style="padding:0px 7px">
                                <h3>Formulario de Registro</h3>
                            </q-card-section>
                            <q-separator color="grey-6"/>
                            <q-card-section>                            
                                <q-input outlined  :dense="true" type="text" autofocus v-model="form.descripcion_gasto" autocomplete="off" color="grey-1" label="Descripción Gasto" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="fact_check" />
                                    </template>
                                </q-input>
                                <q-input outlined  class="q-mt-md" type="text" min="0" autocomplete="off" :dense="true" v-model="form.monto_gasto" color="grey-1" label="Monto Gasto" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="payments" />
                                    </template>
                                </q-input>                                                   
                            </q-card-section>
                            <q-card-actions>
                                    <q-btn type="submit" style="width:100%" color="primary" icon="send" label="Guardar" />
                            </q-card-actions>
                        </q-form>
                    </q-card>
                </div>
            </div>
        </div>
    </q-page>
</template>
<script src="./Gasto.ts"></script>