<template>
<!-- INIT NAVBAR TOP -->
    <q-header elevated class="bg-white flex justify-between items-center">
        <q-toolbar style="height: 65px;">
          <q-btn flat @click="$emit('update:drawernav',drawer = !drawer)" round dense :icon="drawer == true ? 'sort' : 'menu'" />
          <!-- <q-toolbar-title>Header</q-toolbar-title>  drawer = !drawer)       -->  
           <q-space />
          <div class="flex ">          
            <q-btn-dropdown dense flat size="md" icon="more_vert" >
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Perfil</div>
                  <q-toggle v-model="mobileData" label="Use" />
                  <q-toggle v-model="bluetooth" label="Blu" />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                  </q-avatar>

                  <div class="text-subtitle5 q-mt-md q-mb-xs">{{dataLogin.nombres}}</div>

                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    @click="onLogout"
                    size="sm"
                    v-close-popup
                  />
                </div>
              </div>
            </q-btn-dropdown>
          </div>
        </q-toolbar>
      </q-header>
<!-- END NAVBAR TOP -->

<!-- INIT LEF NAVBAR -->
      <q-drawer
        elevated
        class="bg-dark"
        v-model="drawer"
        show-if-above
        :width="260"
        :breakpoint="400"
      >
        <div class="sidebar-logo absolute-top">
          <a href="/main" class="flex justify-center items-center">
          <span class="material-symbols-sharp logo">polymer</span>
          <span class="nombre-logo"><b>CODE</b>BLUE PERU</span> </a>         
        </div>
        <div class="info-user absolute-top bg-transparent">
            <q-avatar size="56px" class="q-mb-sm shadow-8">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="data-user">
              <span>{{dataLogin.nombres}}</span>
              <small>{{ dataLogin.email }}</small>
            </div>
          </div>
        <q-scroll-area  style="height: calc(100% - 160px); margin-top: 160px;
         border-right: 1px solid #ddd;">
          <q-list class="q-mt-sm menu-list">
            <!-- MANTENIMIENTO -->

            <q-expansion-item v-for="lstmenu in menuacceso" :key="lstmenu.grupo" rounded        
              :icon="lstmenu.icono"
              :label="lstmenu.menu"
              group="somegroup"
            >
              <q-item v-for="lstsubmenu in lstmenu.submenu" :key="lstsubmenu.link" active-class="active-link"  exact-active-class="exact-active-link" :to="{name: lstsubmenu.link}" exact>
                <q-item-section avatar><q-icon :name="lstsubmenu.icon" /></q-item-section>
                <q-item-section>{{ lstsubmenu.submenu }}</q-item-section>
              </q-item>
              <!-- <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'categoria'}" exact>
                <q-item-section avatar ><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Categoria</q-item-section>
              </q-item>
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'marca'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Marcas</q-item-section>
              </q-item> -->
            </q-expansion-item>
            <q-separator />

            <!-- MODULO DE ALMACEN -->
          <!--   <q-expansion-item            
              icon="grid_view"
              label="Almacen"
               group="somegroup"
            > 
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'list'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Compra</q-item-section>
              </q-item>
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'kardex'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Kardex</q-item-section>
              </q-item>
            </q-expansion-item>
            <q-separator /> -->

            <!-- MODULO DE CAJA -->
            <!-- <q-expansion-item            
              icon="point_of_sale"
              label="Caja"
              group="somegroup"
            > 
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'cashregister'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Mi Caja</q-item-section>
              </q-item>
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'cuponventa'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Cupon Descuento</q-item-section>
              </q-item>
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'gastos'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Mis Gastos</q-item-section>
              </q-item>
            </q-expansion-item>
            <q-separator /> -->

            <!-- MODULO DE POST -->
            <!-- <q-expansion-item            
              icon="add_shopping_cart"
              label="Post"
               group="somegroup"
            > 
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'carrito'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Vender</q-item-section>
              </q-item>
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'viewsales'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Mis Ventas</q-item-section>
              </q-item>
            </q-expansion-item> -->

            <!-- MODULO DE CREDITOS -->
          <!--   <q-separator />
            <q-expansion-item            
              icon="menu_book"
              label="Creditos"
              group="somegroup"
            > 
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'aperturarcredito'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Seguimiento</q-item-section>
              </q-item>
            </q-expansion-item> -->

            <!-- MODULO DE SEGURIDAD -->
            <!-- <q-separator />
            <q-expansion-item            
              icon="security"
              label="Seguridad"
              group="somegroup"
            > 
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'newuser'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Usuarios</q-item-section>
              </q-item>
              <q-item active-class="active-link" exact-active-class="exact-active-link" :to="{name:'accesos'}" exact>
                <q-item-section avatar><q-icon name="radio_button_unchecked" /></q-item-section>
                <q-item-section>Permisos</q-item-section>
              </q-item>
            </q-expansion-item> -->

          </q-list>
        </q-scroll-area>     
    </q-drawer>
    <!-- END LEF NAVBAR -->
</template>
<style scoped>
  @import './header.css';
</style>
<script src="./header.ts"></script>