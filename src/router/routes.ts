import { createRouter, createWebHashHistory } from 'vue-router'
import AuthView from '@/modules/auth/container/ContainerView.vue'
import HomeView from '@/modules/home/HomeView.vue'
import ContainerMain from '@/modules/container/ContainerView.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes:[
        {
            path:'/auth',
            name:'auth',
            component:AuthView,
            children:[
                {
                    path:'',
                    name:'login',
                    component: () => import('../modules/auth/login/LoginView.vue')
                }
            ]
        },
        {
            path:'/main',
            name:'main',
            component:ContainerMain,
            meta:{requireAuth:true},
            children:[
                {
                    path:'',
                    name:'home',
                    component:HomeView
                },
                {
                    path:'family',
                    name:'family',
                    component: () => import('../modules/mantenimiento/familia/FamiliaView.vue')
                },
                {
                    path:'categoria',
                    name:'categoria',
                    component: () => import('../modules/mantenimiento/categoria/CategoriaView.vue')
                },
                {
                    path:'marca',
                    name:'marca',
                    component: () => import('../modules/mantenimiento/marca/MarcaView.vue')
                },
                {
                    path:'catalogo',
                    name:'catalogo',
                    component: () => import('@/modules/catalogo/digital/CatalogoView.vue')
                },
                {
                    path:'producto',
                    name:'producto',
                    component: () => import('@/modules/catalogo/registerproducto/RegisterproductoView.vue'),
                    children:[
                        {
                            path:'list',
                            name:'list',
                            component: () => import('@/modules/catalogo/registerproducto/lista/ListaView.vue')
                        },
                        {
                            path:'kardex',
                            name:'kardex',
                            component: () => import('@/modules/catalogo/registerproducto/kardex/KardexView.vue')
                        },
                        {
                            path:'add',
                            name:'add',
                            component: () => import('@/modules/catalogo/registerproducto/addproducto/AddView.vue')
                        },
                        {
                            path:'add/:id',
                            name:'addedit',
                            component: () => import('@/modules/catalogo/registerproducto/addproducto/AddView.vue'),
                            props:true
                        },
                    ]
                },
                
            ]
        },
        {
            path:'/operation',
            name:'operation',
            component:ContainerMain,
            meta:{requireAuth:true},
            children:[
                {
                    path:'',
                    name:'cashregister',
                    component: () => import('@/modules/operation/caja/CajaView.vue')
                },
                {
                    path:'carrito',
                    name:'carrito',
                    component: () => import('@/modules/operation/ventas/VentaView.vue')
                },
                {
                    path:'cuponventa',
                    name:'cuponventa',
                    component: () => import('@/modules/operation/cupones/venta/CuponVentaView.vue')
                },
                {
                    path:'gastos',
                    name:'gastos',
                    component: () => import('@/modules/operation/gastos/GastoView.vue')
                },
                {
                    path:'viewsales',
                    name:'viewsales',
                    component: () => import('@/modules/operation/ventas/view/DataVentas.vue')
                }
            ]
        },
        {
            path:'/credito',
            name:'credito',
            component:ContainerMain,
            meta:{requireAuth:true},
            children:[
                {
                    path:'',
                    name:'aperturarcredito',
                    component: () => import('@/modules/creditos/clientes/AperturarCreditoView.vue')
                },
            ]
        },
        {
            path:'/security',
            name:'security',
            component:ContainerMain,
            meta:{requireAuth:true},
            children:[
                {
                    path:'',
                    name:'newuser',
                    component: () => import('@/modules/security/usuarios/UsersView.vue')
                },
                {
                    path:'permisos',
                    name:'accesos',
                    component: () => import('@/modules/security/permisos/PermisoView.vue')
                },
            ]
        },
        {
            path:'/',
            redirect:'/auth',
        }
    ],
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
});

router.beforeEach((to, from, next) => {
    const rutaProtegida = to.matched.some(record => record.meta.requireAuth);
    const token = localStorage.getItem('token');
    if(rutaProtegida && token === null || token === ''){
        next({name: 'login'})  
    }else{
      next()
    }
  
  })
export default router