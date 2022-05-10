import { axios } from '@/axios';
import { store } from '@/store';

const url = process.env.VUE_APP_API_BASE_URL;
// const baseApi = "admin";

function getUsers(params) {
    return axios.get(url + '/index?' + params).then((response) => {
        return response
    });
}

function dashboard() {
    storage.commit('loading');
    return axios.get(url + '/dashboard').then((response) => {
        return response
    });
}

export default {
    getUsers,
    dashboard
}