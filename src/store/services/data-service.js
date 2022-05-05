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

function getPermits() {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/adr-permits', options).then((response) => {
        return response
    });
}

function getEquipments() {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/equipments', options).then((response) => {
        return response
    });
}

function getOperations() {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/operation-types', options).then((response) => {
        return response
    });
}

function getProvinces(params = '') {
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

function getAdrMaterials(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/adr-materials' + '?' + params, options).then((response) => {
        return response
    });
}

function getDeposits(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/deposit-type' + '?' + params, options).then((response) => {
        return response
    });
}

function getVehicleTypes(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/vehicle-types' + '?' + params, options).then((response) => {
        return response
    });
}

function getAdrDesignations(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get(url + '/adr-designations' + '?' + params, options).then((response) => {
        return response
    });
}

export default {
    getCities,
    getProvinces,
    getPermits,
    getEquipments,
    getOperations,
    getAdrMaterials,
    getDeposits,
    getAdrDesignations,
    getVehicleTypes
}