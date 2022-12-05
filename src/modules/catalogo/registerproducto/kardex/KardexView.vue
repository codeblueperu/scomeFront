<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-6 col-sm-6 col-md-6">Kardex</h2>
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
                    <div class="">
                        <!-- <div class="card-header">
                            <h3>Lista en stock</h3>
                             <q-btn class="glossy" :to="{name:'kardex'}" icon="add_circle_outline" rounded color="dark" label="Agregar" /> 
                        </div> -->
                        <div class="">
                            <div class="q-pa-sm">
                                <q-table
                                    :rows="rows"
                                    :columns="columns"
                                    row-key="name"
                                    :loading="visible"
                                    :filter="filterdata"
                                    :visible-columns="visibleColumns"
                                    :separator="'cell'"
                                    :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
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
                                            <q-td key="code_barra" :props="props">
                                                {{ props.row.code_barra }}
                                            </q-td>
                                            <q-td key="titulo_producto" :props="props">
                                                {{ props.row.titulo_producto }}
                                            </q-td>
                                            <!-- <q-td key="fecha_compra" :props="props">
                                                {{ props.row.fecha_compra }}
                                            </q-td> -->
                                            <q-td key="precio_compra" :props="props">
                                                {{ props.row.precio_compra }}                                                
                                            </q-td>
                                            <q-td key="stock_compra" :props="props">
                                                <q-badge color="blue" :outline="true" style="font-size:15px;">   
                                                    <q-icon name="arrow_downward" color="deep-orange-6" /> 
                                                    <b>{{ props.row.stock_compra }}</b> 
                                                </q-badge>                                               
                                            </q-td>
                                            <q-td key="precio_unitario" :props="props">
                                                <q-badge color="deep-orange-6" style="font-size:15px;">
                                                 {{ props.row.precio_unitario }}
                                                </q-badge>
                                            </q-td>
                                            <q-td key="precio_venta_cantidad" :props="props">
                                                {{ props.row.precio_venta_cantidad }}
                                            </q-td>
                                            <q-td key="stock_salida" :props="props">
                                                {{ props.row.stock_salida }}                                         
                                            </q-td>
                                            <q-td key="saldos" :props="props">
                                                <q-badge color="green" :outline="true" style="font-size:15px;"> 
                                                    <q-icon name="arrow_back" color="blue"/>
                                                 <b>{{ props.row.saldos }}</b>
                                                </q-badge> 
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
<script src="./kardex.ts"></script>