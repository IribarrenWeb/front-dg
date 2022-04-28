import { createStore } from 'vuex';
import auth from "./modules/auth";
import reset from "./modules/reset";
import profile from "./modules/profile-module";

export const store = createStore({
    modules: {
        auth: auth,
        reset: reset,
        profile: profile,
    },
});