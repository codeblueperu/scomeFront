<template>
    <div class="q-md">
         <q-layout class="">
             <q-page-container>
                <div class="row panel">
                    <div class="col-xs-hidden col-sm-6 col-md-8 banner">
                      
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-4 panel-login shadow-6">
                       <div class="row">
                            <div class="col-md-12 q-mt-xl flex items-center">
                                <span class="material-symbols-sharp logo q-ml-lg">widgets</span>
                                <h5 class="q-ml-sm name-app">CODEBLUEPERU</h5>
                            </div>
                       </div>
                       <q-page-container>
                            <RouterView />
                       </q-page-container>
                       <div class="container-copy">
                            <p>Copyright © <b><a href="#">codeblueperu</a> - 2022</b></p>
                       </div>
                    </div>
                </div>
             </q-page-container>
         </q-layout>
    </div>
</template>
<style scoped>
    @import 'container.css';
</style>