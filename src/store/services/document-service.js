import { axios } from '@/axios';

const url = process.env.VUE_APP_API_BASE_URL;
const tokenName = process.env.VUE_APP_USER_TOKEN_NAME
const baseApi = "/documents";

function getDocument(id) {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
        // responseType: 'arraybuffer'
    };

    return axios.get(url + baseApi + '/' + id, options).then((response) => {
        return response
    });
}

export default {
    getDocument
}