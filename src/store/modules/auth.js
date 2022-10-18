import service from '@/store/services/auth-service'
import router from '../../router';
import { store } from '@/store';
import { env } from "../../boot/env";

export default {
    namespaced: true,
    state: {
        isAuthenticated: service.isAuth(env.tokenName),
    },

    getters: {
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        getToken() {
            return service.getToken()
        }
    },

    mutations: {
        isAuthenticated(state, payload) {
            state.isAuthenticated = payload.isAuthenticated;
        }
    },

    actions: {
        async login(context, payload) {
            return await service.login(payload.user).then((res) => {
                context.commit("isAuthenticated", {
                    isAuthenticated: service.isAuth()
                });
                console.log(res.data.user.role_id);
                store.dispatch('profile/me')
                store.commit('setRole', res.data.user.role_id)
                router.push({ name: "dashboard" });
            });
        },

        logout(context) {
            service.logout()
            context.commit("isAuthenticated", {
                isAuthenticated: service.isAuth()
            });
            router.push({ name: "login" });
        },

        sendResetEmail(context, payload) {
            return service.sendResetEmail(payload)
        },

        resetPassword(context, payload) {
            return service.passwordReset(payload)
        }
    }
};