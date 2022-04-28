import service from '@/store/services/auth-service'
import router from '../../router';
import { store } from '@/store';
export default {
    namespaced: true,
    state: {
        isAuthenticated: service.isAuth(process.env.VUE_APP_USER_TOKEN_NAME),
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
            return await service.login(payload.user).then(() => {
                context.commit("isAuthenticated", {
                    isAuthenticated: service.isAuth()
                });
                store.dispatch('profile/me')
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