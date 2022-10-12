import { axios } from '@/axios';
import { store } from '@/store';

// const baseApi = "admin";

function getUsers(params) {
    return axios.get('/index?' + params).then((response) => {
        return response
    });
}

function dashboard() {
    store.commit('loading');
    return axios.get('/dashboard').then((response) => {
        return response
    });
}

export default {
    getUsers,
    dashboard
}