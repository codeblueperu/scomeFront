<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
      <HeaderVue v-model:drawernav="drawer"></HeaderVue>
      <div class="main-container">
        <q-page-container>
          
            <RouterView /> 
         
        </q-page-container>
      </div>
      
    </q-layout>
  </div>
</template>
<style scoped>
  @import '../home/home.css';
</style>
<script lang="ts">
  import { onMounted, ref } from 'vue';
  import HeaderVue from '../../components/layout/Header.vue';

  export default {
    name:'ViewHome',
    components: {
      HeaderVue
    },
    setup () {
      let drawer = ref(false);
      onMounted(() => {
        document.title = 'SCOME'
      })
      return {
        drawer        
      }
      
    }
  }
</script>
