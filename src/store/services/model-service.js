import { axios } from '@/axios';
import { store as storage } from '@/store';
import $Swal from 'sweetalert2';
// import _ from "lodash";

const $swal = $Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-primary'
    },
    buttonsStyling: false,
    cancelButtonText: "Cancelar"
})

import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ /* options */ });

const url = process.env.VUE_APP_API_BASE_URL;

const apis = {
    auditor: "auditors",
    delegate: "delegate",
    subcontractor: "subcontractor",
    vehicle: "vehicles",
    business: "business",
    audit: "audits",
    employee: "employees",
    installation: "installations",
    material: "materials",
    audit_image: "audit-images",
}

async function getIndex(model, page = 1, params) {
    storage.commit('loading');
    return await axios.get(`${url}/${apis[model]}?page=${page}&${params}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status
        console.log(status);
        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
    });
}

/**
 * Method to store a model
 * @param {String} model Model api name
 * @param {Object} payload Payload data
 * @param {Bool} multipart If is multipart data
 * @returns Promise
 */
function store(model, payload, multipart = false) {
    const options = {};

    if (multipart) {
        options.headers = {
            'content-type': 'multipart/form-data'
        }
    }

    storage.commit('loading');
    return axios.post(`${url}/${apis[model]}`, payload, options).then((response) => {
        $swal.fire('Registro completado', 'El registro se ha completado correctamente', 'success')
        storage.commit('loading');
        toaster.success(response.data.message)
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status
        console.log(status);

        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');

    });;
}

/**
 * 
 * @param {String} model Model api name
 * @param {Integer} id Model id
 * @param {String} params Request params
 * @returns Promise
 */
function show(model, id, params = "") {

    storage.commit('loading');
    return axios.get(`${url}/${apis[model]}/${id}?${params}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');
    });
}

async function destroy(model, id) {
    storage.commit('loading');
    let deletes = false
    await $swal.fire({
        title: "¿Estas seguro de esto?",
        text: "Una vez eliminado no podra recuperarse este registro",
        icon: "warning",
        showCancelButton: true,
        showLoaderOnConfirm: true
    }).then((res) => {
        if (res.isConfirmed) {
            deletes = true
        } else {
            deletes = false
        }
    })

    if (deletes) {
        return axios.delete(`${url}/${apis[model]}/${id}`).then((response) => {
            storage.commit('loading');
            toaster.success(response.data.message)
            return response
        }).catch(err => {
            storage.commit('loading');
            const status = err.response.status

            let message = null;
            if (status == 422) {
                message = err.response.data.message
            }
            errors(status, message)
            toaster.error('No se pudo eliminar el registro')
            throw Error('Error');
        })
    } else {
        storage.commit('loading');
        return null
    }
}

function instByBusiness(id, page = 1) {
    storage.commit('loading');
    return axios.get(`${url}/installations?page=${page}&includes[]=auditable.user&includes[]=employees&business_id=${id}&includes[]=province`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');
    });;
}

function dashEmployee(id) {
    storage.commit('loading');
    return axios.get(`${url}/employees/dashboard?installation_id=${id}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');
    });;
}

function update(model, id, data, multipart = false) {
    storage.commit('loading');
    const options = {};

    if (multipart) {
        options.headers = {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(`${url}/${apis[model]}/${id}?_method=PUT`, data, options).then((response) => {
        storage.commit('loading');

        let message = getMessage(response) ? response.data.message : 'Registro actualizado'

        toaster.success(message)
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        let message = null;
        if (status == 422 || status == 403) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');
    });
}

function getDocument(id) {
    storage.commit('loading');
    return axios.get(`${url}/documents/${id}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');
    });;
}

function users(params) {
    storage.commit('loading');
    return axios.get(`${url}/index?${params}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        let message = null;
        if (status == 422) {
            message = err.response.data.message
        }
        errors(status, message)
        throw Error('Error');
    });;
}

function dashboard() {
    storage.commit('loading');
    return axios.get(url + '/dashboard').then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        const status = err.response.status

        errors(status)
        throw Error('Error');
    });;
}

function errors(code, message = null) {
    switch (code) {
        case 500:
            // router.back()
            $swal.fire('Error', message != null ? message : 'Parece que ocurrio un error en el servidor, porfavor intentalo mas tarde.', 'error')
            break;

        case 404:
            $swal.fire('No encontrado', message != null ? message : 'Parece que ocurrio un error al intentar entontrar el recurso solicitado.', 'error')
            break;

        case 422:
            $swal.fire('Algunos campos son incorrectos', message != null ? message : "Algunos de los datos enviados son incorrectos.", 'error')
            break;

        case 401:
            window.location.href = '/';
            break

        case 403:
            $swal.fire('Algunos campos son incorrectos', message != null ? message : "Algunos de los datos enviados son incorrectos.", 'error')
            break

        default:
            // router.back()
            $swal.fire('Error inesperado', message != null ? message : 'Ocurrio un error inesperado', 'error')
            break;
    }
}

function getMessage(res) {
    if (typeof res.data.message != 'undefined') {
        return true
    } else {
        return false
    }
}

export default {
    getIndex,
    store,
    show,
    destroy,
    instByBusiness,
    update,
    getDocument,
    users,
    errors,
    dashboard,
    dashEmployee
}