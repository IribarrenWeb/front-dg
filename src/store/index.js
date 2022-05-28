import { createStore } from 'vuex';
import auth from "./modules/auth";
import reset from "./modules/reset";
import profile from "./modules/profile-module";
import { axios } from '@/axios';
import $Swal from 'sweetalert2';
import _ from 'lodash';

const $swal = $Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-primary'
    },
    buttonsStyling: false,
    cancelButtonText: "Cancelar"
})

export const store = createStore({
    state() {
        return {
            role: 0,
            loader: false,
            apiErrors: {},
            tokenName: process.env.VUE_APP_USER_TOKEN_NAME,
            business_schema: {
                business_name: null,
                property_phone: null,
                property_dni: null,
                business_phone: null,
                address: null,
                business_nif: null,
                name: null,
                last_name: null,
                province_id: null,
                email: null,
                bank_code: null,
                iban_number: null,
                holder_name: null,
                file_document: {
                    base64: null,
                    file: null
                },
                file_date: "",
                postal_code: ""
            },
            installation_schema: {
                name: "",
                address: "",
                business_id: null,
                auditable_id: null,
                province_id: null,
                periodicity: null,
                file_document: {
                    base64: "",
                    file: []
                },
                auditable: null,
                operation_types_ids: [],
                deposit_types_ids: [],
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
                    driver_document_date: "",
                    adr_permit_id: null,
                    file_firm: {
                        base64: "",
                        file: []
                    },
                    date_firm: "",
                    file_certification: {
                        base64: "",
                        file: []
                    },
                    date_certification: "",
                },
            },
            auditor_schema: {
                dni: "",
                phone_number: "",
                email: "",
                province_id: null,
                name: "",
                address: "",
                last_name: "",
                documents: null,
                file_certification: "",
                certification_date: "",
                file_firm: "",
                firm_date: "",
                delegate_id: "",
                delegate: null
            },
            delegate_schema: {
                dni: "",
                phone_number: "",
                email: "",
                province_id: null,
                name: "",
                delegation_name: "",
                delegation_phone: "",
                cif_nif: "",
                address: "",
                province: {
                    name: null
                },
                last_name: "",
                documents: null,
                file_certification: "",
                certification_date: "",
                file_firm: "",
                firm_date: "",
            },
            formation_schema: {
                name: "",
                formation_type_id: null,
                auditor_id: null,
                duration: "",
                content: "",
                document: "",
            },
            employee_schema: {
                name: "",
                last_name: "",
                email: "",
                dni: "",
                phone_number: "",
                position: "",
                driver: false,
                dangerous_goods: false,
                representative: false,
                installation_id: null,
                driver_document: {
                    base64: "",
                    file: []
                },
                driver_document_date: "",
                adr_permit_id: null,
                file_firm: {
                    base64: "",
                    file: []
                },
                date_firm: "",
                file_certification: {
                    base64: "",
                    file: []
                },
                date_certification: "",
            },
            provinces: null,
            current: new Date().toISOString().split('T')[0],
            api_url: process.env.VUE_APP_API_BASE_URL
        }
    },
    getters: {
        BUSINESS_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.business_schema))
        },
        INSTALLATION_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.installation_schema))
        },
        AUDITOR_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.auditor_schema))
        },
        FORMATION_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.formation_schema))
        },
        DELEGATE_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.delegate_schema))
        },
        EMPLOYEE_SCHEMA(state) {
            return JSON.parse(JSON.stringify(state.employee_schema))
        },
        ROLE(state) {
            let role = state.role
            switch (role) {
                case 1:
                    role = 'admin';
                    break;
                case 2:
                    role = 'delegate';
                    break;
                case 3:
                    role = 'auditor';
                    break;
                case 4:
                    role = 'business';
                    break;

                default:
                    role = false
                    break;
            }

            return role
        },
        COPY: () => (data) => {
            return JSON.parse(JSON.stringify(data))
        },
        CURRENT_DATE(state) {
            console.log(state);
            return state.current
        },
        PLUK: () => (arr, key) => {
            return arr.map(i => i[key]);
        },
        FILTER_DOC: () => (arr, doc_name) => {
            return _.filter(arr, function(o) { return o.type.name == doc_name })[0];
        },
        DIFFERENCE: () => (origObj, newObj) => {
            function changes(newObj, origObj) {
                let arrayIndexCounter = 0
                return _.transform(newObj, function(result, value, key) {
                    if (!_.isEqual(value, origObj[key])) {
                        let resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key
                        result[resultKey] = (_.isObject(value) && _.isObject(origObj[key])) ? changes(value, origObj[key]) : value
                    }
                })
            }
            return changes(newObj, origObj)
        },
        EMPTY: () => (val) => {
            return _.isEmpty(val)
        },
        SET_STATUS: () => (status) => {
            let type = "";
            switch (status) {
                case "PENDIENTE":
                    type = "danger";
                    break;
                case "POR REVISAR":
                    type = "warning";
                    break;
                case "COMPLETADO":
                    type = "success";
                    break;

                default:
                    break;
            }
            return type;
        },
        CLEAN_DATA: () => (model, excludes = []) => {
            let keys_pluck = _.keys(model);
            let data = {};
            _.forEach(keys_pluck, function(k) {
                if ((!_.isEmpty(model[k]) && !_.isNull(model[k]) || (_.isNumber(model[k]) && model[k] >= 1) || (_.isBoolean(model[k]))) && !_.includes(excludes, k)) {
                    data[k] = model[k]
                }
            })
            return data;
        },
        FORMAT_DOC_B64: () => (b64) => {
            console.log(b64);
            var byteCharacters = atob(b64);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var file = new Blob([byteArray], {
                type: "application/pdf;base64",
            });
            var fileURL = URL.createObjectURL(file);
            return fileURL;
        }
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
        },
        setRole(state, payload) {
            state.role = payload
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
        toSchedule({ state }, payload) {
            return $swal.fire({
                title: `Agendar ${payload.name}`,
                html: `<div class="row">` +
                    `<div class="col-md-6"><input id="audit-input1" class="form-control" type="date" min="${state.current}"></div>` +
                    '<div class="col-md-6"><input id="audit-input2" class="form-control" type="time"></div>' +
                    `</div>`,
                focusConfirm: false,
                confirmButtonText: 'Agendar',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                preConfirm: () => {
                    let date = document.getElementById('audit-input1').value;
                    let time = document.getElementById('audit-input2').value
                    if (date && time) {
                        let data = {}
                        if (payload.model == 'trainings') {
                            data = { date: date, time: time }
                        } else {
                            data = { scheduled_date: date, time: time }

                        }
                        return axios.put(`${payload.model}/${payload.id}`, data)
                            .then(response => {
                                const status = response.status
                                if (status >= 300) {
                                    throw new Error(response.data.message)
                                }
                            })
                            .catch(error => {
                                $swal.showValidationMessage('Ocurrio un error: ' + error)
                            })
                    } else {
                        $swal.showValidationMessage('Los campos fecha y hora son requeridos')
                    }
                },
                allowOutsideClick: () => !$swal.isLoading()
            }).then((res) => {
                if (res.isConfirmed) {
                    $swal.fire(`${payload.name} agendada`, `Se ha agendado la ${payload.name}.`, 'success')
                    return true
                }
            });
        },

    },
    modules: {
        auth: auth,
        reset: reset,
        profile: profile,
    },
});