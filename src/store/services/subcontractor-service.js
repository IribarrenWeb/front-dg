import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;
const tokenName = process.env.VUE_APP_USER_TOKEN_NAME
const baseApi = "/subcontractor";

function getIndex(page = 1, params) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(`${url}${baseApi}?page=${page}&${params}`, options).then((response) => {
        return response
    });
}

function store(payload) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.post(`${url}${baseApi}`, payload, options).then((response) => {
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
    destroy
}