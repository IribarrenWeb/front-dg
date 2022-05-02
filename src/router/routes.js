import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";
// import Icons from "../views/Icons.vue";
import Maps from "../views/Maps.vue";
import Profile from "../views/UserProfile.vue";
import Tables from "../views/Tables.vue";
import Users from "../views/Users.vue";
import AuditorTable from "../views/Tables/AuditorsTable.vue";
import Business from "../views/Business.vue";
import DelegateTable from "../views/Tables/DelegateTable.vue";
// import NotFound from "../pages/NotFoundPage.vue";

import Login from "../views/Auth/Login.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import ResetPasswordRequest from "../views/Auth/ResetPasswordRequest.vue";

//import middleware
import auth from "@/middleware/auth";
import guest from "@/middleware/guest";

const routes = [{
        path: "/",
        redirect: "/dashboard",
        component: DashboardLayout,
        children: [{
                path: "/dashboard",
                name: "dashboard",
                components: { default: Dashboard },
                meta: { middleware: auth },
            },
            {
                path: "/business",
                name: "business",
                components: { default: Business },
                meta: { middleware: auth },
                // redirect: { name: "business.all" },
                // children: [{
                //     path: "/business/all",
                //     name: "business.all",
                //     components: { default: BusinessTable },
                //     meta: { middleware: auth },
                // }, ],
            },
            {
                path: "/maps",
                name: "maps",
                components: { default: Maps },
                meta: { middleware: auth },
            },
            {
                path: "/profile",
                name: "profile",
                components: { default: Profile },
                meta: { middleware: auth },
            },
            {
                path: "/users",
                name: "users",
                components: { default: Users },
                meta: { middleware: auth },
                redirect: { name: "delegates" },
                children: [{
                        path: "/users/delegates",
                        name: "delegates",
                        components: { default: DelegateTable },
                        meta: { middleware: auth },
                    },
                    {
                        path: "/users/auditors",
                        name: "auditors",
                        components: { default: AuditorTable },
                        meta: { middleware: auth },
                    },
                ],
                // children: [{
                //         path: "/delegates",
                //         name: "login",
                //         components: { default: Login },
                //         // meta: { middleware: auth },
                //     },
                //     {
                //         path: "/auditors",
                //         name: "login",
                //         components: { default: Login },
                //         // meta: { middleware: guest },
                //     },
                //     {
                //         path: "/business",
                //         name: "login",
                //         components: { default: Login },
                //         // meta: { middleware: guest },
                //     },
                // ],
            },
            {
                path: "/tables",
                name: "tables",
                components: { default: Tables },
                meta: { middleware: auth },
            },
        ],
    },
    {
        path: "/",
        redirect: "login",
        component: AuthLayout,
        children: [{
                path: "/login",
                name: "login",
                components: { default: Login },
                meta: { middleware: guest },
            },
            {
                path: "/reset-password-request",
                name: "reset-request",
                components: { default: ResetPasswordRequest },
                meta: { middleware: guest },
            },
            {
                path: "/reset-password/:email",
                name: "reset-password",
                components: { default: ResetPassword },
                meta: { middleware: guest },
            },
        ],
    },
    // { path: "*", component: NotFound },
];

// const router = createRouter({
//     history: createWebHashHistory(),
//     linkActiveClass: "active",
//     routes,
// });

export default routes;