import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;
const tokenName = process.env.VUE_APP_USER_TOKEN_NAME
const baseApi = "/installations";

function getIndex(params) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + baseApi + '?' + params, options).then((response) => {
        return response
    });
}

function getByBusiness(id, page = 1) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(`${url}${baseApi}?page=${page}&includes[]=auditable.user&includes[]=employees&business_id=${id}&includes[]=province`, options).then((response) => {
        return response
    });
}

function store(data) {
    console.log(data);
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.post(`${url}${baseApi}`, data, options).then((response) => {
        return response
    });
}

function view(id, params = "") {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(`${url}${baseApi}/${id}?${params}`, options).then((response) => {
        return response
    });
}

function destroy(id) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.delete(`${url}${baseApi}/${id}`, options).then((response) => {
        return response
    });
}

export default {
    getIndex,
    store,
    view,
    getByBusiness,
    destroy
}