<template>
  <div>
    <q-select
      v-model="cod_familia_cat"
      :options="options"
      option-value="cod_familia_cat"
      option-label="descripcion_familia"
      color="primary"
      clearable
      emit-value
      map-options
      label="Seleccione Familia"
      @change="$emit('update:codfamilia',cod_familia_cat)"
    >
      <template v-slot:prepend>
        <q-icon name="diversity_2" />
      </template>
    </q-select>
    {{ cod_familia_cat }}
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import srvFamilia from "@/services/mantenimiento/MantenimientoService";

export default defineComponent({
  props: ['codfamilia'],
  emits:['update:codfamilia'],
  setup(){
    let options:any = ref([]);
    let cod_familia_cat:number|string = 'ni00';

    onMounted(() => {
      srvFamilia.$srvListaDataFamilia().then((resp) => {
        options.value = resp.data;
      });
    });

    return{
      options,
      cod_familia_cat
    }
  }
});
</script>
