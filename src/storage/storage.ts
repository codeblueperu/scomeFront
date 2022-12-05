import { createStore } from "vuex";
import VuexPersistence from "vuex-persist"

const appSotore =createStore({
    state: {
        ismenus: null,
        dataLogin: null,
        token_refresh:null
    },
    mutations: {
        setMenusList(state:any,value:any){
            state.ismenus = value
        },
        setDataLogin(state:any,value:any){
            state.dataLogin = value
        },
        setRefreshToken(state:any,value:any){
            state.token_refresh = value
        }
    },
    plugins:[
        new VuexPersistence({
            storage: window.localStorage
        }).plugin
    ]
});

export default appSotore;