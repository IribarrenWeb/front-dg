import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;

function get(params = null) {
    const token = localStorage.getItem(process.env.VUE_APP_USER_TOKEN_NAME);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(`${url}/me?`+params, options).then((response) => {
        return {
            list: response.data,
            meta: response.data.meta,
        };
    });
}

function update(payload) {
    const token = localStorage.getItem(process.env.VUE_APP_USER_TOKEN_NAME);

    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.patch(`${url}/me`, payload, options).then((response) => {
        return response.data;
    });
}

export default {
    get,
    update
};