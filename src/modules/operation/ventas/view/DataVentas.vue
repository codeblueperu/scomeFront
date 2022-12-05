<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Mis Ventas</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'viewsales'}" label="Principal"/>                 
                </q-breadcrumbs>
            </div>
        </div>
        <div class="container">
            <div class="row justify-between items-stretch">
                <div class="col-xs-12 col-md-12">
                    <q-table
                        class="q-pd-md"
                        style="width:99%"
                        :rows="row"
                        :columns="column"
                        row-key="name"
                        :loading="isLoadingTable"
                        :filter="filterdata"
                        :visible-columns="visiblecolumn"
                        :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
                    > 
                        <template v-slot:top>                         
                            <q-space />
                            <div class="row q-pa-md flex  justify-around items-start" style="width:70%">
                                <q-input v-model="fechainicio" :dense="true" outlined type="date" label="Fecha Inicio" />
                                <q-input v-model="fechafin" :dense="true" outlined type="date" label="Fecha Termino" />
                                <q-btn icon="search" color="light-green-10" label="filtrar" @click="onDataVentas()" />
                           </div>
                                <q-input borderless dense debounce="300" label="Buscar" color="primary" v-model="filterdata">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                        </template>                 
                        <template v-slot:no-data="{ icon, message, filter }">
                            <div class="full-width row flex-center text-accent q-gutter-sm">
                                <q-icon size="2em" name="widgets" />
                                <span>No tiene ninguna venta...</span>
                            </div>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                            <q-btn v-if="props.row.estado_venta == 'PROCESADA'" size="sm" color="red-6" icon="backspace" round dense @click="deleteVenta(props.row.name)"></q-btn>
                            <q-btn size="sm" v-if="props.row.estado_venta == 'PROCESADA'" class="q-ml-xs" color="light-blue-9" icon="print" round dense @click="printComprobante(props.row.name)"></q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </div>

            </div>
        </div>
    </q-page>
</template>
<script src="./DataVentas.ts"></script>