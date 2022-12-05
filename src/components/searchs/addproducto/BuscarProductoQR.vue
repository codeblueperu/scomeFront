<template>
<!--     <input type="text"  @keydown="searchsProducto()"> -->
    <q-input  @change="searchsProducto" v-model="codigobarra"
        color="teal" filled autocomplete="off"
        :loading="loadingproducto"
        :dense="true" clearable autofocus label="CODIGO BARRA">
        <template v-slot:prepend>
            <q-icon name="qr_code_2" />
        </template>
    </q-input>
</template>
<script src="./BuscarProductoQR.ts"></script>
