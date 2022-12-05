<template>
   <q-page>
        <div class="row flex">
            <div class="col-md-8 q-pa-xs">
                <q-card class="">
                    <q-card-section>
                        <div class="row flex justify-between">
                            <h5>Productos</h5>
                            <BuscarProductoQR @productocodbarra="addCarrito" />
                            <q-checkbox v-model="chkProducto" label="UNIDAD" />
                            <ProductComponent ref="mdlproducto" @addCard="addCarrito"/>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <div class="q-pa-md">
                        <q-table
                            :rows="rows"
                            :columns="columns"
                            row-key="name"
                            :loading="isLoadingTable"
                            :visible-columns="['cantidad','precio','producto','total']"
                        >
                            <template v-slot:no-data="{ icon, message, filter }">
                                <div class="full-width row flex-center text-accent q-gutter-sm">
                                <q-icon size="2em" name="local_grocery_store" />
                                <span>
                                    no tiene ningun producto en su carrito..
                                </span>
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
                                        <q-input v-if="col.name === 'cantidad'" v-slot="scope" filled v-model="props.row.cantidad" type="number" min="1" :dense="true" style="width:70px" @change="updateTotal(props.row)"/>
                                        <q-input v-else-if="col.name === 'precio'" v-slot="scope" filled v-model="props.row.precio" :disable="habilitarInputPrecio" type="number" min="1" :dense="true" style="width:100px" @change="alterprecio(props.row)"/>
                                        <q-input v-else-if="col.name === 'total'" v-slot="scope" filled v-model="props.row.total" type="number" min="1" :dense="true" style="width:100px" readonly/>
                                        <div v-else>{{ col.value }}</div>
                                    </q-td>
                                    <q-td auto-width>
                                        <q-btn size="md" color="red-8" icon="delete" @click="deleteItem(props.rowIndex)" round dense />
                                    </q-td>
                                </q-tr>                                    
                            </template>
                        </q-table>
                    </div>
                    
                </q-card>
            </div>
            <!-- COMPONENTES -->
            <AdelantoComp ref="compadelantoinput" @mimontodeclare="shormodaladelanto"></AdelantoComp>
            <OtherProductComp ref="compotherproducto" @addOtherProducto="addCarrito"></OtherProductComp>
            <!-- END COMPONENTES -->
            <div class="col-md-4 q-pa-xs">
                <q-card style="background:#3A3B41;color:#FFF">
                    <q-card-section>
                        <div class="flex justify-between items-center">
                            <h5>Datos de la venta</h5>
                            <q-btn round color="amber" size="xs" glossy text-color="black" icon="cleaning_services" @click="limpiar()">
                                <q-tooltip>
                                    Limpiar Todo
                                </q-tooltip>
                            </q-btn>
                        </div>
                    </q-card-section>
                    <q-separator color="blue-grey-10"/>
                    <q-card-section>
                        <q-input :dense="isdense" clearable @keyup="buscarcupon($event)" color="grey-1" label="N° Cupon" dark v-model="numeroCupon">
                            <template v-slot:prepend>
                            <q-icon name="fact_check" />
                            </template>
                        </q-input>
                        <q-input class="q-mt-md" :dense="isdense" clearable @keyup="buscarcliente($event)" color="grey-1" label="Cliente" dark v-model="dniCliente">
                            <template v-slot:prepend>
                            <q-icon name="badge" />
                            </template>
                        </q-input>
                        <div class="line-pago q-mt-md">
                            Seleccione el tipo de Pago:
                            <q-btn-toggle @click="otherPago($event)" v-model="bntpago" :options="otionPago"/>
                            <!-- MODAL TIPO PAGO -->
                            <q-dialog v-model="modaltipoPago">
                                <q-card style="width: 700px; max-width: 80vw;">
                                    <q-card-section>
                                    <div class="text-h5">TIPO DE PAGO</div>
                                    </q-card-section>
                                    <q-separator />

                                    <q-card-section class="q-pt-none">
                                        <q-table
                                            :rows="rowsPago"
                                            :columns="columnsPago"
                                            :visible-columns="['descripcion_corta','numero_cuenta','monto']"
                                            row-key="name"
                                            :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
                                        >
                                        <template v-slot:body="props">
                                            <q-tr :props="props">
                                                <q-td key="descripcion_corta" :props="props">
                                                    {{ props.row.descripcion_corta }}
                                                </q-td>
                                                <q-td key="numero_cuenta" :props="props">
                                                    {{ props.row.numero_cuenta }}
                                                </q-td>
                                                <q-td key="monto" :props="props">
                                                    <q-input v-slot="scope" filled v-model="props.row.monto" type="number" min="1" :dense="true" style="width:170px" />
                                                </q-td>
                                            </q-tr>
                                        </template>
                                        </q-table>
                                    </q-card-section>

                                    <q-card-actions align="right" class="bg-white text-teal">
                                    <q-btn flat label="OK" v-close-popup />
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>
                            <!-- END MODAL TIPO PAGO -->
                        </div>
                        <q-input  disable color="grey-1" label="Total venta" dark v-model="montoventa" input-style="font-size:18px">
                            <template v-slot:prepend>
                            <q-icon name="local_atm" />
                            </template>
                        </q-input>
                        <q-input  disable color="grey-1" label="IGV" dark v-model="montoIGV" input-style="font-size:18px">
                            <template v-slot:prepend>
                            <q-icon name="price_check" />
                            </template>
                        </q-input>
                        <q-input  disable color="grey-1" label="Descuento" dark v-model="montoDescuento" input-style="font-size:18px">
                            <template v-slot:prepend>
                            <q-icon name="redeem" />
                            </template>
                        </q-input>
                        <q-input  disable color="grey-1" label="Total apagar" dark v-model="montoTotal" input-style="font-size:18px">
                            <template v-slot:prepend>
                            <q-icon name="account_balance_wallet" />
                            </template>
                        </q-input>   
                        <!-- modal vuelco calcula -->    
                        <q-dialog v-model="mdlcalcula" >
                            <q-card style="min-width: 350px;background:#3A3B41;color:#FFF">
                                <q-card-section>
                                <div class="text-h6">Calcular vuelto!</div>
                                </q-card-section>

                                <q-card-section class="q-pt-none">
                                <q-input  label="Total a Pagar"  dark v-model="montoTotal" disable  input-style="font-size:25px"/>

                                <q-input  label="Monto" color="grey-1" @keyup="calculavuelto($event)"  dark v-model="montoPaga"   input-style="font-size:22px" autofocus/>
                                
                                <q-input  label="Vuelto" label-color="rojo-10"  dark v-model="vuelto" disable input-style="font-size:25px"/>
                                </q-card-section>

                                <q-card-actions align="right" class="text-primary">
                                <q-btn color="red" style="width:100%" icon="shopping_cart" @click="saveVenta()" icon-right="send" label="Procesar venta" />
                                </q-card-actions>
                            </q-card>
                        </q-dialog>
                        <!-- fin calcula -->                 
                    </q-card-section>                        
                    <q-card-actions>
                        <q-btn color="red" style="width:100%" icon="shopping_cart" @click="saveVenta()" icon-right="send" label="Procesar venta" />
                    </q-card-actions>
                </q-card>
            </div>
        </div>
   </q-page>
</template>
<style lang="css" scoped>
   h5{
    font-weight:700;
    font-size: 15px;
  }    
</style>
<script src="./Venta.ts"></script>