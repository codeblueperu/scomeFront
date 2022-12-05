<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Aperturar Credito</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'aperturarcredito'}" label="Principal"/>                 
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
                        :visible-columns="['cliente','monto_credito','monto_deuda','estado','actions']"
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
                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td key="name" :props="props">
                                    {{ props.row.name }}
                                </q-td>
                                <q-td key="cliente" :props="props">
                                    {{ props.row.cliente }}
                                </q-td>
                                <!-- <q-td key="dni" :props="props">
                                    {{ props.row.dni }}
                                </q-td> -->
                                <!-- <q-td key="telefono" :props="props">
                                    {{ props.row.telefono }}
                                </q-td> -->
                                <q-td key="monto_credito" :props="props">
                                    {{ 'S/ ' + props.row.monto_credito }}
                                </q-td>
                                <q-td key="monto_deuda" :props="props">
                                    {{ 'S/ ' + props.row.monto_deuda }}
                                </q-td>
                                <q-td key="estado" :props="props">
                                    <q-badge v-if="props.row.estado == 1 && props.row.monto_deuda == 0.0 " outline color="green-9" label="No debe" />
                                    <q-badge v-if="props.row.estado == 0 && props.row.monto_deuda > props.row.monto_credito" outline color="red-10" label="Moroso" />
                                    <q-badge v-if="props.row.estado == 1 && props.row.monto_deuda > 0.0" outline color="amber" label="Pendiente Pago" />
                                    <q-badge v-if="props.row.estado == 0 && props.row.monto_deuda == 0.0" outline color="red-10" label="Sin Activar" />
                                </q-td>
                                <q-td key="actions" :props="props">
                                    <q-btn-dropdown
                                        icon="checklist"
                                        class="glossy q-ml-lg"
                                        color="grey-10"
                                        dense
                                        size="sm"
                                        >
                                        <q-list>
                                            <q-item clickable v-close-popup @click="onEdit(props.row)">
                                                <q-item-section avatar>
                                                    <q-avatar size="sm" icon="edit" color="warning" text-color="white" />
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-item-label caption>Editar</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-item clickable v-close-popup @click="onDelete(props.row)">
                                                <q-item-section avatar>
                                                    <q-avatar size="sm" icon="delete" color="negative" text-color="white" />
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-item-label caption>Eliminar</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-item clickable v-close-popup @click="showmodaldetalle(props.row)">
                                                <q-item-section avatar>
                                                    <q-avatar size="sm" icon="loupe" color="light-blue-8" text-color="white" />
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-item-label caption>Detalle</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>

                                    </q-btn-dropdown>
                                    <!-- <q-btn size="sm" color="warning" icon="edit" round dense @click="onEdit(props.row)"></q-btn>
                                    <q-btn size="sm" class="q-ml-xs" color="negative" icon="delete" round dense @click="onDelete(props.row)"></q-btn> -->
                                </q-td>
                            </q-tr>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                            <q-btn size="sm" color="warning" icon="edit" round dense @click="onEdit(props.row)"></q-btn>
                            <q-btn size="sm" class="q-ml-xs" color="negative" icon="delete" round dense @click="onDelete(props.row)"></q-btn>
                            </q-td>
                        </template>
                    </q-table>
                    <!-- MODAL DETALLE DEUDA --> 
                        <DetalleCreditoComp ref="refcomponentedetalledeuda" @update:onloadData="onloadDataEvent($event)"></DetalleCreditoComp>
                    <!-- END MODAL DETALLE DEUDA -->
                </div>
                <div class="col-xs-12 col-md-4">
                    <q-card style="background:#3A3B41;color:#FFF">
                        <q-form @submit="saveCredito" class="q-gutter-xs q-pa-xs">
                            <q-card-section style="padding:0px 7px">
                                <h3>Formulario de Registro</h3>
                            </q-card-section>
                            <q-separator color="grey-6"/>
                            <q-card-section> 
                                <q-select
                                    outlined
                                    :dense="true"
                                    color="grey-1"
                                    dark
                                    v-model="form.cod_cliente"
                                    use-input
                                    label="Cliente(s)"
                                    :options="cbocliente"
                                    option-value="cod_cliente"
                                    option-label="apellidos_nombres" 
                                    emit-value
                                    map-options
                                    @filter="filtrarCliente"
                                    behavior="menu"
                                    input-debounce="0"
                                >
                                    <template v-slot:no-option>
                                        <q-item>
                                            <q-item-section class="text-grey">
                                                Cliente no encontrado
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>                          
                                <q-input outlined class="q-mt-md" :dense="true" type="text" v-model="form.monto_credito" autocomplete="off" color="grey-1" label="Monto Credito" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="fact_check" />
                                    </template>
                                </q-input>
                                <q-input outlined  class="q-mt-md" autocomplete="off" :dense="true" v-model="form.monto_deuda" color="grey-1" label="Monto Deuda" dark>
                                    <template v-slot:prepend>
                                    <q-icon name="payments" />
                                    </template>
                                </q-input>
                                <q-toggle class="q-mt-md" v-model="form.estado" label="Estado" />                                                   
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
<script src="./AperturarCredito.ts"></script>