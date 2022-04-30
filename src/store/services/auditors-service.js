import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;
const tokenName = process.env.VUE_APP_USER_TOKEN_NAME
const baseApi = "/auditors";

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

function store(data) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
            'content-type': 'multipart/form-data'
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

export default {
    getIndex,
    store,
    view
}