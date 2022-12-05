import appCaja from './Caja';
<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Listado de Cajas</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'cashregister'}" label="Principal"/>                 
                </q-breadcrumbs>
            </div>
        </div>
        <div class="container">
            <div class="row justify-between">
                <div class="col-xs-12 col-md-12">
                    <div class="card">
                        <div class="card-header">
                           <div class="row q-pa-md flex  justify-between items-center" style="width:90%">
                            <q-input v-model="fechainicio" :dense="true" outlined type="date" label="Fecha Inicio" />
                            <!-- <q-input v-model="horainicio" :dense="true" outlined type="time" label="Hora Inicio" /> -->
                            <q-input v-model="fechafin" :dense="true" outlined type="date" label="Fecha Termino" />
                          <!--   <q-input v-model="horafin" :dense="true" outlined type="time" label="Hora Termino" /> -->
                            <q-btn icon="search" color="light-green-10" label="filtrar" @click="onDataCaja" />
                           </div>
                            <div class="row q-pa-md flex  justify-end items-center" style="width:30%"><q-btn outline class="" @click="openModal(true)" icon="fax" color="warning" label="aperturar caja" /></div>
                        </div>
                        <div class="card-body">
                            <div class="q-pa-md">
                                <q-table
                                    :rows="rows"
                                    :columns="columns"
                                    row-key="name"
                                    :loading="visible"
                                    :filter="filterdata"
                                    :visible-columns="visiblecolumn"
                                >
                                <template v-slot:no-data="{ icon, message, filter }">
                                    <div class="full-width row flex-center text-accent q-gutter-sm">
                                        <q-icon size="2em" name="widgets" />
                                        <span>Sin datos que mostrar...</span>
                                    </div>
                                </template>
                                    <template v-slot:top>
                                        <q-space />
                                        <q-input borderless dense debounce="300" label="Buscar" color="primary" v-model="filterdata">
                                        <template v-slot:append>
                                            <q-icon name="search" />
                                        </template>
                                        </q-input>
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
                                                <q-chip v-if="col.name === 'estado'" :color="col.value == 'APERTURADA' ? 'teal' : 'deep-orange'" text-color="white">{{ col.value == 'APERTURADA' ? 'APERTURADA' : 'CERRADA' }}</q-chip>
                                                <div v-else>{{ col.value }}</div>
                                            </q-td>
                                            <q-td auto-width>
                                                <q-btn v-if="props.row.estado === 'APERTURADA'" size="md" color="red-9" icon="carpenter" round dense  @click="OnCerrarCaja(props.row.name)">
                                                    <q-tooltip>
                                                        CERRA CAJA
                                                    </q-tooltip>
                                                </q-btn>
                                                <q-btn class="q-ml-xs" size="md" color="green-9" icon="local_printshop" round dense  @click="printreportecuadre(props.row.name)">
                                                    <q-tooltip>
                                                        REPORTE CUADRE CAJA
                                                    </q-tooltip>
                                                </q-btn>
                                                
                                            </q-td>
                                        </q-tr>                                    
                                    </template>
                                </q-table>
                            </div>
                        </div>
                        <q-dialog v-model="modalcaja">
                            <q-card style="width: 470px !important; max-width: 90vw;">
                                <q-form
                                        @submit="OnCreate"
                                        @reset="onReset"                                       
                                    >
                                <q-card-section>
                                <div class="text-h6">Mi Caja</div>
                                </q-card-section>
                                <q-separator />

                                <q-card-section class="scroll">                                                                 
                                        <div class="row">
                                            <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
                                                <q-input filled  v-model="formulario.descripcion_caja" disable  label="Usuario Caja">
                                                    <template v-slot:prepend>
                                                        <q-icon name="people_alt" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input :disable="ismontoinit"  v-model="fechaAperturainicio" :dense="true" outlined type="date" label="Fecha Inicio" />
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input v-model="fechaAperturafin" :dense="true" outlined type="date" label="Fecha Fin" />
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input :disable="ismontoinit" v-model="horaAperturainicio" :dense="true" outlined type="time" label="Hora Inicio" />
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input v-model="horaAperturafin" :dense="true" outlined type="time" label="Hora Fin" />
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input :disable="ismontoinit" autocomplete="off" :rules="validFormCaja[0]" outlined v-model="formulario.monto_inicial" input-style="font-size:18px;font-weight:bold;" label="Monto inicial">
                                                    <template v-slot:prepend>
                                                        <q-icon name="local_atm" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input filled  v-model="formulario.monto_efectivo" disable input-style="font-size:18px;font-weight:bold;"  label="Monto venta efectivo">
                                                    <template v-slot:prepend>
                                                        <q-icon name="currency_exchange" />
                                                    </template>
                                                </q-input>
                                            </div>                                            
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input filled  disable  v-model="formulario.monto_digital" type="number" input-style="font-size:18px;font-weight:bold;" label="Otros medios de pago">
                                                    <template v-slot:prepend>
                                                        <q-icon name="attach_money" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs">
                                                <q-input filled  disable  v-model="formulario.monto_ingreso" type="number" input-style="font-size:18px;font-weight:bold;" label="Monto Ingreso">
                                                    <template v-slot:prepend>
                                                        <q-icon name="attach_money" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs" style="background: #FFCCBC;color:#FF5722 !important; border-radius: 7px;">
                                                <q-input filled  disable  v-model="formulario.monto_gasto" input-style="font-size:18px;font-weight:bold;"  label="Monto gasto">
                                                    <template v-slot:prepend>
                                                        <q-icon name="local_atm" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-xs-12 col-sm-6 col-md-6 q-pa-xs" style="background: #C5E1A5; border-radius: 7px;">
                                                <q-input filled disable  v-model="formulario.monto_total" input-style="font-size:20px;font-weight:700;" label="Monto Total">
                                                    <template v-slot:prepend>
                                                        <q-icon name="point_of_sale" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
                                                <q-select outlined v-model="formulario.estado"
                                                 :options="optionCaja" label="Estado Caja"
                                                 option-value="codigo"
                                                 option-label="descripcion">
                                                    <template v-slot:prepend>
                                                        <q-icon name="done_all" />
                                                    </template>
                                                </q-select>
                                            </div>
                                        </div>
                                    
                                </q-card-section>

                                <q-separator />
                                <q-card-actions align="right">
                                <q-btn type="submit" label="Procesar" color="primary"/>
                                <q-btn outline  label="Cancelar" color="primary" v-close-popup />
                                </q-card-actions>
                                </q-form>
                            </q-card>
                        </q-dialog>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>
<script src="./Caja.ts"></script>