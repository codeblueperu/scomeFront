<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Cupones de Descuento</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'cuponventa'}" label="Principal"/>                 
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
                        :visible-columns="['numero_cupon','monto_descuento','fecha_expiracion','stock','estado']"
                    >
                    <template v-slot:no-data="{ icon, message, filter }">
                        <div class="full-width row flex-center text-accent q-gutter-sm">
                            <q-icon size="2em" name="widgets" />
                            <span>Sin datos que mostrar...</span>
                        </div>
                    </template>
                    <template v-slot:top>
                        <q-space />
                        <div class="row q-pa-md flex  justify-around items-start" style="width:1000%">
                            <q-input v-model="fechainicio" :dense="true" outlined type="date" label="Fecha Inicio" />
                            <q-input v-model="fechafin" :dense="true" outlined type="date" label="Fecha Termino" />
                            <q-btn icon="search" color="light-green-10" label="filtrar" @click="listaData()" />
                            <q-input borderless dense debounce="300" label="Buscar" color="primary" v-model="filterdata">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                            </q-input>
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

                <div class="col-xs-12 col-md-4">
                    <q-card style="background:#3A3B41;color:#FFF">
                        <q-form @submit="saveCupon" class="q-gutter-xs q-pa-xs">
                            <q-card-section style="padding:0px 7px">
                                <h3>Formulario de Registro</h3>
                            </q-card-section>
                            <q-separator color="grey-6"/>
                            <q-card-section>                            
                                <q-input outlined  :dense="true" v-model="numeroCupo"  color="grey-1" label="N° Cupon" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="fact_check" />
                                    </template>
                                </q-input>
                                <q-input outlined  class="q-mt-md" :dense="true" v-model="montoDescuento" color="grey-1" label="Monto Descuento" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="payments" />
                                    </template>
                                </q-input>
                                <q-input  outlined  class="q-mt-md" :dense="true" v-model="fechaExpira" type="date"  color="grey-1" label="Fecha Expiración" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="event" />
                                    </template>
                                </q-input>
                                <q-input outlined  class="q-mt-md" v-model="limiteVenta" :dense="true"  color="grey-1" label="Stock" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="production_quantity_limits" />
                                    </template>
                                </q-input>
                                <q-toggle
                                    label="Habilitar Descuento"
                                    color="red-6"
                                    v-model="estado"
                                />                                                    
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
<script src="./CuponVenta.ts"></script>