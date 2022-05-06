import { defineAsyncComponent } from 'vue'
import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
import Loader from "@/components/Loader";

const Dashboard = defineAsyncComponent({
    loader: () =>
        import ("@/views/Dashboard.vue"),
    loadingComponent: Loader
});

const Profile = defineAsyncComponent({
    loader: () =>
        import ("@/views/UserProfile.vue"),
    loadingComponent: Loader
});

const Audits = defineAsyncComponent({
    loader: () =>
        import ("@/views/Audits.vue"),
    loadingComponent: Loader
});

const Users = defineAsyncComponent({
    loader: () =>
        import ("@/views/Users.vue"),
    loadingComponent: Loader
});

const AuditorTable = defineAsyncComponent({
    loader: () =>
        import ("@/views/Tables/AuditorsTable.vue"),
    loadingComponent: Loader
});

const Business = defineAsyncComponent({
    loader: () =>
        import ("@/views/Business.vue"),
    loadingComponent: Loader
});

const BusinessDetail = defineAsyncComponent({
    loader: () =>
        import ("@/views/BusinessDetail.vue"),
    loadingComponent: Loader
});

const DelegateTable = defineAsyncComponent({
    loader: () =>
        import ("@/views/Tables/DelegateTable.vue"),
    loadingComponent: Loader
});

const Login = defineAsyncComponent({
    loader: () =>
        import ("@/views/Auth/Login.vue"),
    loadingComponent: Loader
});

const ResetPassword = defineAsyncComponent({
    loader: () =>
        import ("@/views/Auth/ResetPassword.vue"),
    loadingComponent: Loader
});

const ResetPasswordRequest = defineAsyncComponent({
    loader: () =>
        import ("@/views/Auth/ResetPasswordRequest.vue"),
    loadingComponent: Loader
});

// import Icons from "../views/Icons.vue";
// import Tables from "../views/Tables.vue";
// import MaterialTable from "../views/Tables/MaterialTable.vue"
// import NotFound from "../pages/NotFoundPage.vue";

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
                path: "/business/:id",
                name: "business.show",
                components: { default: BusinessDetail },
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
            },
            {
                path: "/audits",
                name: "audits",
                components: { default: Audits },
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