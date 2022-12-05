<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-6 col-sm-6 col-md-6">Almacen de Productos</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-6 col-sm-6 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'list'}" label="Principal"/> 
                    <!-- <q-breadcrumbs-el icon="home" :to="{name:'producto'}" label="Registro"/>  -->                 
                </q-breadcrumbs>
            </div>
        </div>

        <!-- CONTENT MAIN -->
        <div class="container">
            <div class="row justify-between">
                <div class="col-xs-12 col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h3>Lista en stock</h3>
                            <q-btn class="glossy" :to="{name:'add'}" icon="add_circle_outline" rounded color="dark" label="Agregar" />
                        </div>
                        <div class="card-body">
                            <div class="q-pa-sm">
                                <q-table
                                    :rows="rows"
                                    :columns="columns"
                                    row-key="name"
                                    :loading="visible"
                                    :filter="filterdata"
                                    :visible-columns="visibleColumns"
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
                                                <q-chip v-if="col.name === 'estado'" :color="col.value == 1 ? 'teal' : 'red-7'" text-color="white">{{ col.value == 1 ? 'Activo' : 'Inactivo' }}</q-chip>
                                                <div v-else-if="col.name === 'stock'">
                                                    <q-chip v-if="col.value === 0" :color="col.value == 0 ? 'red-7' : ''" text-color="white">{{ col.value == 0 ? 'Agotado' : '' }}</q-chip>
                                                    <div v-else>{{ col.value }}</div>
                                                </div>
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
            </div>
        </div>
        <!-- END CONTENT MAIN -->
    </q-page>
</template>
<script src="./Lista.ts"></script>