import { axios, tokenName } from '@/axios';

function getCities() {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get('/cities', options).then((response) => {
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

    return axios.get('/adr-permits', options).then((response) => {
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

    return axios.get('/equipments', options).then((response) => {
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

    return axios.get('/operation-types', options).then((response) => {
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

    return axios.get('/provinces' + '?' + params, options).then((response) => {
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

    return axios.get('/adr-materials' + '?' + params, options).then((response) => {
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

    return axios.get('/deposit-type' + '?' + params, options).then((response) => {
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

    return axios.get('/vehicle-types' + '?' + params, options).then((response) => {
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

    return axios.get('/adr-designations' + '?' + params, options).then((response) => {
        return response
    });
}

function getAdrClass(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get('/adr-class' + '?' + params, options).then((response) => {
        return response
    });
}

function getPacking(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get('/packing' + '?' + params, options).then((response) => {
        return response
    });
}

function getFormationTypes(params = '') {
    const token = localStorage.getItem(tokenName);
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    return axios.get('/formation-types' + '?' + params, options).then((response) => {
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
    getVehicleTypes,
    getAdrClass,
    getPacking,
    getFormationTypes
}