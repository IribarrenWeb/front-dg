import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;
const tokenName = process.env.VUE_APP_USER_TOKEN_NAME

function getCities() {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/cities', options).then((response) => {
        return response
    });
}

function getProvinces(params) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/provinces' + '?' + params, options).then((response) => {
        return response
    });
}

export default {
    getCities,
    getProvinces
}