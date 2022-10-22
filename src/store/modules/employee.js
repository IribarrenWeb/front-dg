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
            return await service.api({url:'employees?'+payload})
        },
        async updateResponsibles(context, payload) {
            return await service.api({url:'employees/update-responsibles', method:'PUT',data:payload})
        },
    }
};