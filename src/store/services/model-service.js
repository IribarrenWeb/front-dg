import { axios } from '@/axios';
import { store as storage } from '@/store';
import $Swal from 'sweetalert2';
import { toUpper, isEmpty } from "lodash";

const $swal = $Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-primary'
    },
    buttonsStyling: false,
    cancelButtonText: "Cancelar"
})

import { createToaster } from "@meforma/vue-toaster";
import { map } from 'lodash';
const toaster = createToaster({
    maxToasts: 1,
    queue: true, 
});

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
    formation: "formations",
    training: "trainings",
    visit: "visits",
    non: "nonconformities",
    report: "reports",
    non_actions: "nonconformities-action",
    documents: "admin-docs",
    province: "provinces",
    // city: "cities",

}
async function api(model, method = 'GET', params = null, page = null, data = null) {
    storage.commit('loading');
    let url_model = `/${model}?_method=${method}`;

    if (page != null) {
        url_model += `&page=${page}&`
    }

    if (params != null) {
        url_model += params
    }

    const config = {
        method: method,
        url: url_model,
        data: data
    }
    
    return await axios.request(config).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });
}

async function getIndex(model, page = 1, params = null) {
    storage.commit('loading');
    console.log(model);
    let url_model = `/${apis[model]}?`;

    if (page != null) {
        url_model += `page=${page}&`
    }

    if (params != null) {
        url_model += params
    }

    return await axios.get(url_model).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });
}


function users_select(query = null, roles = [], ext_params = null) {
    storage.commit('loading');
    let params = 'users?';
    if (!isEmpty(query)) {
        params += `name=${query}&`;
    }

    if (roles) {
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            if (i > 0) {
                params += '&'
            }
            params += 'roles[]=' + role
        }
    }
    if (ext_params != null) {
        params += ext_params;
    }

    return axios.get(params).then((response) => {
        storage.commit('loading');
        const data = response.data.data;
        let options = map(data, (user) => {
            let label = user.full_name;
            if (user.role_id == 2 && !isEmpty(query)) {
                const compare = toUpper(query)
                const name = toUpper(user?.name),
                    last_name = toUpper(user?.last_name),
                    delegation_name = toUpper(user?.delegate?.delegation_name);

                if (name.includes(compare) || last_name.includes(compare)) {
                    label = name + ' ' + last_name;
                }else if(delegation_name.includes(compare)){
                    label = delegation_name
                }
            }
            return {
                id: user.id,
                value: user,
                label: label,
            };
        });
        return options;
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });
}

function store(model, payload, multipart = false) {
    const options = {};

    if (multipart) {
        options.headers = {
            'content-type': 'multipart/form-data'
        }
    }

    storage.commit('loading');
    return axios.post(`/${apis[model]}`, payload, options).then((response) => {
        $swal.fire('Registro completado', 'El registro se ha completado correctamente', 'success')
        storage.commit('loading');
        toaster.success(response.data.message)
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });;
}

function show(model, id, params = "") {

    storage.commit('loading');
    return axios.get(`/${apis[model]}/${id}?${params}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
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
        return axios.delete(`/${apis[model]}/${id}`).then((response) => {
            storage.commit('loading');
            toaster.success(response.data.message)
            return response
        }).catch(err => {
            storage.commit('loading');
            errors(err)
            toaster.error('No se pudo eliminar el registro')
            throw err
        })
    } else {
        storage.commit('loading');
        return null
    }
}

function instByBusiness(id, page = 1) {
    storage.commit('loading');
    return axios.get(`/installations?page=${page}&includes[]=auditable.user&includes[]=employees&business_id=${id}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });;
}

function dashEmployee(id) {
    storage.commit('loading');
    return axios.get(`/employees/dashboard?installation_id=${id}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
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
    return axios.post(`/${apis[model]}/${id}?_method=PUT`, data, options).then((response) => {
        storage.commit('loading');

        let message = getMessage(response) ? response.data.message : 'Registro actualizado'

        toaster.success(message)
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });
}

function getDocument(id) {
    storage.commit('loading');
    return axios.get(`/documents/${id}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });;
}

function users(params) {
    storage.commit('loading');
    return axios.get(`/index?${params}`).then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });;
}

function dashboard() {
    storage.commit('loading');
    return axios.get('/dashboard').then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');

        errors(err)
        throw err
    });;
}

function instOperations(id) {
    storage.commit('loading');
    return axios.get('/installations/' + id + '/operations').then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });;
}

function getReport(id) {
    storage.commit('loading');
    return axios.get('/reports/' + id + '/generate').then((response) => {
        storage.commit('loading');
        return response
    }).catch(err => {
        storage.commit('loading');
        errors(err)
        throw err
    });;
}

function errors(err) {
    console.log(err?.response, err);
    const status = err?.response?.status;
    const message = err?.response?.data?.message;
    let title = '';
    let body = '';

    switch (status) {
        case 500:
            title = 'Error inesperado';
            body = message != null ? message : 'Parece que ocurrio un error en el servidor, porfavor intentalo mas tarde.';
            break;

        case 404:
            title = 'No encontrado';
            body = message != null ? message : 'Parece que ocurrio un error al intentar entontrar el recurso solicitado.';
            break;

        case 422:
            title = 'Problema con los datos enviados';
            body = message != null ? message : "Algunos de los datos enviados son incorrectos.";
            break;

        case 401:
            title = 'No autenticado';
            body = message != null ? message : 'No estas autenticado en el sistema';
            window.location.href = '/';
            break

        case 403:
            title = 'No estas autorizado';
            body = message != null ? message : "No tienes el rol necesario para realizar esta acción";
            break

        case 409:
            title = 'Validaciones fallidas';
            body = message != null ? message : "Algunas validaciones fallaron";
            break

        default:
            title = 'Error inesperado';
            body = message != null ? message : 'Ocurrio un error inesperado';
            break;
    }
    const type = status >= 500 ? 'error' : 'warning';
    $swal.fire(title, body, type)
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
    dashEmployee,
    instOperations,
    getReport,
    users_select,
    api
}