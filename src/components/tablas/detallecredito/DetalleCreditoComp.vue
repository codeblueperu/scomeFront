<template>
  <q-dialog v-model="isOpen" class="container">
      <q-card style="width: 75vw; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Mi Detalle</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pt-none">
          <q-table
            class="q-pd-md"
            style="width:99%"
            :rows="rows"
            :columns="columns"
            row-key="name"
            :loading="isLoadingTable"
            :filter="filterdata"
            :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
            :visible-columns="iscolumnvisible"
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
                  <span>No tiene ningun detalle...</span>
              </div>
            </template> 

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn size="sm" color="indigo-9" icon="data_saver_on" round dense @click="onSumarAdelanto(props.row)"></q-btn>
                <!-- <q-btn size="sm" class="q-ml-xs" color="negative" icon="delete" round dense @click="onDelete(props.row)"></q-btn> -->
              </q-td>
            </template>

          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="propmodal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ingrese un monto?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="montoadelanto" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn outline  color="red" label="Cancelar" v-close-popup />
          <q-btn color="purple" label="Guardar monto" @click="onSaveAdelanto()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script src="./DetalleCredito.ts"></script>
