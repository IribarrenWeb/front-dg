import { createStore } from 'vuex';
import auth from "./modules/auth";
import reset from "./modules/reset";
import profile from "./modules/profile-module";

export const store = createStore({
    state() {
        return {
            role: 0,
            loader: false,
            apiErrors: {},
            tokenName: process.env.VUE_APP_USER_TOKEN_NAME,
            business_schema: {
                business_name: "",
                property_phone: "",
                property_dni: "",
                business_phone: "",
                business_nif: "",
                name: "",
                last_name: "",
                province_id: "",
                email: "",
                bank_code: "",
                iban_number: "",
                holder_name: "",
                file_document: {
                    base64: "",
                    file: ""
                },
                file_date: {
                    date: "",
                    toForm: ""
                },
                postal_code: ""
            },
            installation_schema: {
                name: "",
                address: "",
                business_id: null,
                auditable_id: null,
                province_id: null,
                file_document: {
                    base64: "",
                    file: []
                },
                auditable: null,
                operation_types_ids: [],
                equipments_ids: [],
                responsible: {
                    name: "",
                    last_name: "",
                    email: "",
                    dni: "",
                    phone_number: "",
                    position: "",
                    driver: false,
                    dangerous_goods: false,
                    driver_document: {
                        base64: "",
                        file: []
                    },
                    driver_document_date: {
                        date: "",
                        toForm: ""
                    },
                    adr_permit_id: null,
                    file_firm: {
                        base64: "",
                        file: []
                    },
                    date_firm: {
                        date: "",
                        toForm: ""
                    },
                    file_certification: {
                        base64: "",
                        file: []
                    },
                    date_certification: {
                        date: "",
                        toForm: ""
                    },
                },
            }
        }
    },
    getters: {
        BUSINESS_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.business_schema))
        },
        INSTALLATION_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.installation_schema))
        },
    },
    mutations: {
        loading(state) {
            state.loader = !state.loader
        },
        resetApiErrors(state) {
            state.apiErrors = {}
        },
        setErrors(state, payload) {
            state.apiErrors = payload
        }
    },
    actions: {
        setApiValidation({ commit }, serverErrors) {
            let errors = {};
            Object.keys(serverErrors).forEach((element) => {
                errors[element] = serverErrors[element];
            });

            commit('setErrors', errors);
        },
        logout({ state }) {
            localStorage.removeItem(...state.tokenName);
            window.location.reload
            return true
        },
        isAuth({ state }) {
            var token = localStorage.getItem(...state.tokenName);
            if (token) { // Token is present
                if (token.split('.').length === 3) { // Token with a valid JWT format XXX.YYY.ZZZ
                    try { // Could be a valid JWT or an access token with the same format
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        var exp = JSON.parse(window.atob(base64)).exp;
                        if (typeof exp === 'number') { // JWT with an optonal expiration claims
                            return Math.round(new Date().getTime() / 1000) < exp;
                        }
                    } catch (e) {
                        return true; // Pass: Non-JWT token that looks like JWT
                    }
                }
                return true; // Pass: All other tokens
            }
            return false
        },
        formatDate(date, format = "en-US") {
            return new Date(date).toLocaleDateString(format);
        },
    },
    modules: {
        auth: auth,
        reset: reset,
        profile: profile,
    },
});