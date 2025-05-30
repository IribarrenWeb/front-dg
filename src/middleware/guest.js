import { store } from "../store";

export default function guest({ next, router }) {
    if (store.getters["auth/isAuthenticated"]) {
        return router.push({ name: "dashboard" });
    }

    return next();
}