/*!

=========================================================
* Vue Argon Dashboard - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-argon-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/vue-argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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

Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule]);
});

configure({
    generateMessage: localize({
        es
    }),
});

setLocale("es");

const appInstance = createApp(App);

// appInstance.use(VeeValidate);
appInstance.use(Toaster, {
    // One of the options
    maxToasts: 4,
    queue: true,
});
// appInstance.use(VeeValidate);
appInstance.use(store);
appInstance.use(router);
appInstance.use(VueSweetalert2);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");