import axios from "axios";
import { store } from "@/store";
import { env } from "../boot/env";

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const host = window.location.hostname;
var apiUrl = import.meta.env.VITE_API_BASE_URL;
var baseUrl = import.meta.env.VITE_API_URL;

if (host == 'localhost') {
    apiUrl = import.meta.env.VITE_API_BASE_URL_DEV
    baseUrl = import.meta.env.VITE_API_URL_DEV
}

axios.defaults.baseURL = apiUrl;

axios.interceptors.request.use(function(config) {
    console.log('config', config.method);
    if (config.method == 'post') {
        store.commit('resetApiErrors')
    }
    const token = localStorage.getItem(env.tokenName);
    config.baseURL = apiUrl;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function(err) {
    return Promise.reject(err);
});

axios.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function(error) {
    const status = error.response.status;
    if (status == 401) {
        store.dispatch('logout');
    } else if (status == 422 && error?.response?.data?.errors) {
        store.commit('setErrors', error.response.data.errors)
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export { axios, apiUrl, baseUrl };