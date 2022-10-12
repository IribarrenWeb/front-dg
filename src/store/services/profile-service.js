import { axios } from '@/axios';


function get(params = null) {
    let formatUrl = `/me`
    if (params) {
        formatUrl += '?' + params;
    }
    return axios.get(formatUrl).then((response) => {
        return {
            list: response.data,
            meta: response.data.meta,
        };
    });
}

function update(payload) {
    return axios.patch(`/me`, payload).then((response) => {
        return response.data;
    });
}

export default {
    get,
    update
};