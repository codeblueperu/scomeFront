<template>
    <q-page>
        <div class="row flex justify-between items-center">
            <h2 class="col-xs-12 col-sm-12 col-md-6">Administración de Usuarios</h2>
            <div class="q-pa-md flex justify-end  bg-transparent col-xs-hidden col-sm-12 col-md-6">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" :to="{name:'newuser'}" label="Principal"/>                 
                </q-breadcrumbs>
            </div>
        </div> 

        <div class="container">
            <div class="row justify-between items-stretch">
                <div class="col-xs-12 col-md-12">
                    <q-table
                        class="q-pd-md"
                        style="width:100%"
                        :rows="row"
                        :columns="column"
                        row-key="name"
                        :loading="isLoadingTable"
                        :filter="filterdata"
                        :pagination="{sortBy: 'desc',descending: false,page: 1,rowsPerPage: 10}"
                        :visible-columns="visiblecolumns"
                    >
                        <template v-slot:top>
                            <q-space />
                                <div style="width:100%;display: flex; flex-direction: row; justify-content: space-between;">
                                    <q-btn round color="purple-9" icon="person_add_alt" @click="onShowModal">
                                        <q-tooltip>Crear Nuevo Usuario</q-tooltip>
                                    </q-btn>
                                    <!-- modal -->
                                        <NewUserComponent @reloadTable="onListaUsuarios" ref="modaluser"></NewUserComponent>
                                    <!-- end modal -->
                                    <q-input borderless dense debounce="300" label="Buscar" color="primary" v-model="filterdata">
                                        <template v-slot:append>
                                            <q-icon name="search" />
                                        </template>
                                    </q-input>
                                </div>
                        </template>                 
                        <template v-slot:no-data="{ icon, message, filter }">
                            <div class="full-width row flex-center text-accent q-gutter-sm">
                                <q-icon size="2em" name="widgets" />
                                <span>Sin datos que mostrar...</span>
                            </div>
                        </template>

                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn  size="sm" color="yellow-9" @click="onEditModal(props.row.name)" icon="edit_note" round dense class="q-mr-xs"></q-btn>
                                <q-btn  size="sm" color="red-6" @click="onDelete(props.row.name)" icon="delete_outline" round dense ></q-btn>
                           </q-td>
                        </template>
                    </q-table>
                </div>

            </div>

        </div>
    </q-page>
</template>
<script src="./User.ts"></script>