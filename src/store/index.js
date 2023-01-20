import { createStore } from 'vuex';
import auth from "./modules/auth";
import reset from "./modules/reset";
import profile from "./modules/profile-module";
import employee from './modules/employee';
import { axios, apiUrl, baseUrl } from '@/axios';
import $Swal from 'sweetalert2';
import _, { isObject, map } from 'lodash';
import service from './services/model-service';
import { each } from 'lodash';
import functions from '../utils/functions';
import schemas from '../schemas';

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
            is_admin: false,
            is_delegate: false,
            is_auditor: false,
            is_business: false,
            is_bussines_no_adr: false,
            is_mobile: window.innerWidth <= 760,
            loader: false,
            apiErrors: {},
            stopCamera: false,
            notifications: [],
            tokenName: import.meta.env.VITE_USER_TOKEN_NAME,
            provinces: null,
            current: new Date().toISOString().split('T')[0],
            api_url: apiUrl,
            api_url_base: baseUrl
        }
    },
    getters: {
        ROLE(state) {
            let role = state.role
            return functions.rolename(role)
        },
        CURRENT_DATE(state) {
            return state.current
        },
        CLEAN_DATA: () => (model, excludes = [], includes = [], formData = false) => {
            let keys_pluck = _.keys(model);
            let data = {};
            if (formData) {
                data = new FormData
            }
            _.forEach(keys_pluck, function (k) {
                if (isObject(model[k])) {
                    let keys_obj = _.keys(model[k]);
                    each(keys_obj, function (eo) {
                        if (_.includes(includes, k) || (!_.isEmpty(model[k][eo]) && !_.isNull(model[k][eo]) || (_.isNumber(model[k][eo]) && model[k][eo] >= 1) || (_.isBoolean(model[k][eo]))) && !_.includes(excludes, k[eo])) {
                            data[k][eo] = model[k][eo];
                        }
                    })
                } else {
                    if (formData) {
                        data.append(k, model[k])
                    } else {
                        data[k] = model[k]
                    }
                }

            })
            return data;
        },
        isMobile() {
            if (screen.width <= 760) {
                return true
            } else {
                return false
            }
        },
        getNotifications(state){
            return state.notifications.reverse()
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
        clearError(state, index) {
            if (index in state.apiErrors) {
                delete state.apiErrors[index] 
            }
        },
        setRole(state, payload) {
            state.role = payload
            state.is_admin = payload == 1;
            state.is_delegate = payload == 2;
            state.is_auditor = payload == 3;
            state.is_business = payload == 4 || payload == 6;
            state.is_bussines_no_adr = payload == 6;
        },
        stopedCamera(state, payload = null) {
            state.stopCamera = payload != null ? payload : !state.stopCamera
        },
        setNotifications(state, payload){
            state.notifications = payload
        },
        markRead(state){
            state.notifications = map(state.notifications, (n) => {
                n.read_at = true
                return n
            })
        },
        pushNotification(state,payload) {
            state.notifications.unshift(payload)
        }
    },
    actions: {
        async getNotifications({commit}){
            try {
                const res = await service.api({url:'notifications'});
                commit('setNotifications', res.data.data)
            } catch (err) {
                console.log(err);
            }
        },
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
                                const message = error?.response?.data?.message ?? error;
                                $swal.showValidationMessage('Ocurrio un error: ' + message)
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
        async users(state, payload) {
            let params = typeof payload.params != undefined ? payload.params : null;

            try {
                const res = await service.users_select(payload.query, payload.roles, params);
                return res
            } catch (err) {
                console.log(err);
            }
        },

        async delete(state, payload) {
            try {
                const res = await service.destroy(payload.model, payload.id);
                return res
            } catch (err) {
                console.log(err);
            }
        },

    },
    modules: {
        auth: auth,
        reset: reset,
        profile: profile,
        employee: employee
    },
});