import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { Quasar, Loading, Notify } from "quasar";
import router from "./router/routes";
import axios from "axios";
import VueAxios from "vue-axios";
import "./interceptors/MainInterceptor";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons-sharp/material-icons-sharp.css";
import "@quasar/extras/material-symbols-sharp/material-symbols-sharp.css";
import "quasar/src/css/index.sass";
import "./style.css";
import storage from './storage/storage'

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const pinia = createPinia();
const app = createApp(App);

app.use(Quasar, {
  config: {
    brand: {
      primary: "#7b1fa2",
      secondary: "#ffcebb",
      accent: "#67697b",
      dark: "#151832",
      positive: "#91f7b6",
      negative: "#d7174c",
      info: "#a5d4fe",
      warning: "#e9b545",
    },
    extrax: ["roboto-font"],
    loading: {},
  },
  plugins: {
    Loading,
    Notify,
  },
  // import Quasar plugins and add here
  extrax: ["roboto-font"],
});

app.use(router);
app.use(pinia);
app.use(VueAxios, axios);
app.use(VueSweetalert2);
app.use(storage);
window.Swal = app.config.globalProperties.$swal;
app.mount("#app");
app.config.performance = true;
