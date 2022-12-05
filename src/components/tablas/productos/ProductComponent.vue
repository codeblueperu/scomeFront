<template>
    <q-btn style="width:40px;height:40px" round size="sm" @click="openComponet()" :disable="bloquedBtn"  icon="add_business" color="primary">
        <q-tooltip>
            Catalogo de productos
        </q-tooltip>
    </q-btn>
    <q-dialog v-model="isModalCatalogo">
      <q-card style="width: 60vw; max-width: 90vw;">
        <q-card-section>
        
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pt-none">
            <q-table
                title="Mis Productos"
                :rows="rows"
                :columns="columns"
                row-key="name"
                :loading="isLoadingTable"
                :filter="filterdata"
                :visible-columns="['sotck','producto','preciounitario','cantidad']"
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
                        <span>Upps! producto no encontrado...</span>
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
                            <q-input v-if="col.name === 'cantidad'" v-slot="scope" filled v-model="props.row.cantidad" type="number" min="1" :dense="true" style="width:100px"/>
                            <q-btn-toggle size="sm" v-else-if="col.name === 'presentacion'" v-model="props.row.istalla"  toggle-color="primary" :options="col.value"/>
                            <!-- <div v-else-if="col.name === 'presentacion'">{{ col.value }}</div> -->
                            <div v-else>{{ col.value }}</div>
                        </q-td>
                        <q-td auto-width>
                            <q-btn size="md" color="grey-10" icon="add_shopping_cart" @click="$emit('addCard', props.row)" round dense />
                        </q-td>
                    </q-tr>                                    
                </template>
            </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script src="./Product.ts"></script>