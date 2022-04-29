import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;
const tokenName = process.env.VUE_APP_USER_TOKEN_NAME
const baseApi = "/employees";

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

export default {
    getIndex
}