import service from '@/store/services/profile-service';

const state = {
    me: null,
};

const mutations = {
    SET_RESOURCE: (state, me) => {
        state.me = me;
    }
};


const actions = {
    me({ commit }, params) {
        return service.get(params)
            .then((profile) => {
                commit('SET_RESOURCE', profile.list.user);
            });
    },

    update({ commit }, params) {
        return service.update(params)
            .then((profile) => {
                commit('SET_RESOURCE', profile);
            });
    },

};

const getters = {
    me: state => state.me
};

const profile = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

export default profile;