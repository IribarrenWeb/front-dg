import { store } from "../store";

export default function billable({ next, router }) {

    // if (!store.getters['profile/me']?.is_billable) {
    //     return router.push({ name: "dashboard" });
    // }

    return next();
}