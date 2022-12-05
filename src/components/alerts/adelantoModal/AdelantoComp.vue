<template>
    <q-dialog v-model="estadomodal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Deseas agregar un adelanto?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input  label="Ingrese un monto" v-model="montoadelanto" @keyup="$emit('mimontodeclare', $event.target.value)" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn outline  color="red" label="Cancelar" v-close-popup />
          <q-btn color="purple" label="Aceptar" v-close-popup @click="$emit('mimontodeclare',montoadelanto)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script src="./Adelanto.ts"></script>