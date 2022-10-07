import service from '../services/model-service'
export default {
    namespaced: true,
    state: {
    },

    getters: {
        
    },

    mutations: {
        
    },

    actions: {
        async get(context, payload) {
            return await service.api('employees', 'GET', payload)
        },
        async updateResponsibles(context, payload) {
            return await service.api('employees/update-responsibles', 'PUT',null,null, payload)
        },
    }
};