import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArgonDashboard from "./plugins/argon-dashboard";
import { store } from "./store";
import "element-plus/lib/theme-chalk/index.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toaster from "@meforma/vue-toaster";
import "./assets/main.css";

import { localize, setLocale } from "@vee-validate/i18n";
import es from "@vee-validate/i18n/dist/locale/es.json";
import { configure } from 'vee-validate';

import { defineRule } from "vee-validate";
import AllRules from "@vee-validate/rules";
// import this component
import flatPickr from 'vue-flatpickr-component';
import '../node_modules/flatpickr/dist/flatpickr.css';
import functions from './utils/functions';
import schemas from './schemas';
import { isEmpty, isNil } from "lodash";
import timeago from 'vue-timeago3' // import timeago
import { es as esp } from 'date-fns/locale' // import custom locale
import moment from "moment"

Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule]);
});

configure({
    generateMessage: localize({
        es
    }),
});

setLocale("es");

const options = {
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-outline-primary'
  },
  buttonsStyling: false
}

const appInstance = createApp(App);

// define options
const timeagoOptions = {
  converterOptions: {
      includeSeconds: true,
  },
  locale: esp,
}

appInstance.use(timeago,  timeagoOptions)
// appInstance.use(VeeValidate);
appInstance.use(Toaster, {
    // One of the options
    maxToasts: 1,
    queue: true,
});

appInstance.config.globalProperties.$functions = functions;
appInstance.config.globalProperties.$moment = moment;
appInstance.config.globalProperties.$empty = (val) => {
    return isEmpty(val) || isNil(val)
};
appInstance.config.globalProperties.$schemas = schemas;

appInstance.component('date-picker', flatPickr);
appInstance.use(store);
appInstance.use(router);
appInstance.use(VueSweetalert2,options);
appInstance.use(ArgonDashboard);
appInstance.config.errorHandler = (err, vm, info) => {
    console.log(err, 'ERRRORRR', vm, info);
}
appInstance.mount("#app");