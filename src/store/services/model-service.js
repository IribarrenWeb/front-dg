import { axios } from '@/axios';
import { store as storage } from '@/store';
import Swal from 'sweetalert2';

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
    material: "materials"
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
        Swal.fire('Registro completado', 'El registro se ha completado correctamente', 'success')
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

function destroy(model, id) {
    storage.commit('loading');
    return axios.delete(`${url}/${apis[model]}/${id}`).then((response) => {
        Swal.fire('Registro eliminado', 'El registro se ha eliminado correctamente', 'success')
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

function update(model, id, data) {
    storage.commit('loading');
    return axios.put(`${url}/${apis[model]}/${id}`, data).then((response) => {
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

function errors(code, message = null) {
    switch (code) {
        case 500:
            Swal.fire('Error', message != null ? message : 'Parece que ocurrio un error en el servidor, porfavor intentalo mas tarde.', 'error')
            break;

        case 404:
            Swal.fire('No encontrado', message != null ? message : 'Parece que ocurrio un error al intentar entontrar el recurso solicitado.', 'error')
            break;

        case 422:
            Swal.fire('Algunos campos son incorrectos', message != null ? message : "Algunos de los datos enviados son incorrectos.", 'error')
            break;

        default:
            Swal.fire('Error inesperado', message != null ? message : 'Ocurrio un error inesperado', 'error')
            break;
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
    errors
}