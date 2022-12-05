<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Control de Permisos</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'accesos'}" label="Principal"/>                 
                </q-breadcrumbs>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <q-select class="q-mr-sm"
                    outlined  
                    v-model="cod_sucursal"
                    :options="optionSucursal"
                    color="purple-10" 
                    label="Sucursales"
                    option-value="cod_sucursal"
                    option-label="nombre_sucursal"
                    emit-value
                    map-options
                    >
                    <template v-slot:prepend>
                        <q-icon name="recent_actors" />
                    </template>
                </q-select>
            </div>
            <!-- <div class="col-md-3">
                <q-select class="q-mr-sm"
                    outlined  
                    v-model="cod_usuario"
                    :options="optionUsuario"
                    color="purple-10" 
                    label="Usuarios"
                    option-value="cod_usuario"
                    option-label="nombres"
                    emit-value
                    map-options
                    @update:model-value="val => onDataUsuario(val)"
                    >
                    <template v-slot:prepend>
                        <q-icon name="recent_actors" />
                    </template>
                </q-select>
            </div> -->
            <div class="col-md-3">
                <q-select class="q-mr-sm"
                    outlined  
                    v-model="cod_cargo"
                    :options="optionCargo"
                    color="purple-10" 
                    label="Cargo"
                    option-value="cod_cargo"
                    option-label="descripcion_cargo"
                    emit-value
                    map-options
                    @update:model-value="val => onDataSubMenu(val)"
                    >
                    <template v-slot:prepend>
                        <q-icon name="recent_actors" />
                    </template>
                </q-select>
            </div>
            <div class="col-md-3">
                <q-select class="q-mr-sm"
                    outlined  
                    v-model="cod_menu_principal"
                    :options="optionMenuPrincipal"
                    color="purple-10" 
                    label="Modulos"
                    option-value="cod_menu"
                    option-label="descripcion_corta"
                    emit-value
                    map-options
                    @update:model-value="val => onDataSubMenu(val)"
                    >
                    <template v-slot:prepend>
                        <q-icon name="recent_actors" />
                    </template>
                </q-select>
            </div>
            <div class="col-md-3">
                <q-btn color="purple" label="Procesar" icon="person_search" @click="onProcesar" class="q-mt-sm" style="width:70%"/>
            </div>
        </div>

        <div class="row q-mt-md">
            <q-table
                class="q-pd-md"
                style="width:100%"
                :rows="row"
                :columns="column"
                row-key="name"
                :loading="isLoadingTable"
                :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
                :visible-columns="visiblecolumns"
            >
                <template v-slot:no-data="{ icon, message, filter }">
                    <div class="full-width row flex-center text-accent q-gutter-sm">
                        <q-icon size="2em" name="widgets" />
                        <span>Sin datos que mostrar...</span>
                    </div>
                </template>
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="menu" :props="props">
                            {{ props.row.menu }}
                        </q-td>
                        <q-td key="is_select" :props="props">
                            <q-checkbox v-model="props.row.is_select" color="red" />
                        </q-td>
                        <q-td key="is_insert" :props="props">
                            <q-checkbox v-model="props.row.is_insert" color="red" />
                        </q-td>
                        <q-td key="is_update" :props="props">
                            <q-checkbox v-model="props.row.is_update" color="red" />
                        </q-td>
                        <q-td key="is_delete" :props="props">
                            <q-checkbox v-model="props.row.is_delete" color="red" />
                        </q-td>
                        <q-td key="is_print" :props="props">
                            <q-checkbox v-model="props.row.is_print" color="red" />
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>
</template>
<script src="./Permiso.ts"></script>