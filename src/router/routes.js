import { defineAsyncComponent } from 'vue'
import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

const Dashboard = defineAsyncComponent(() =>
    import ("@/views/Dashboard.vue")
);

const Documents = defineAsyncComponent(() =>
    import ("@/views/Documents.vue")
);

const Vehicle = defineAsyncComponent(() =>
    import ("@/views/Vehicles.vue")
);

const Installations = defineAsyncComponent(() =>
    import ("@/views/Installations.vue")
);

const InstallationDetail = defineAsyncComponent(() =>
    import ("../components/Installation/InstallationDetail.vue")
);

const Delegate = defineAsyncComponent(() =>
    import ("@/views/Delegate.vue")
);

const Materials = defineAsyncComponent(() =>
    import ("@/views/Materials.vue")
);

const Employees = defineAsyncComponent(() =>
    import ("@/views/Employees.vue")
);

const EmployeesTable = defineAsyncComponent(() =>
    import ("../components/Employee/EmployeesTable.vue")
);

const VehiclesTable = defineAsyncComponent(() =>
    import ("../components/Vehicle/VehiclesTable.vue")
);

const MaterialsTable = defineAsyncComponent(() =>
    import ("../components/Materials/MaterialTable.vue")
);

const AuditsTable = defineAsyncComponent(() =>
    import ("../components/Audit/AuditTable.vue")
);

const NonTable = defineAsyncComponent(() =>
    import ("../components/Non/NonTable.vue")
);

const Profile = defineAsyncComponent(() =>
    import ("@/views/UserProfile.vue")
);

const Audits = defineAsyncComponent(() =>
    import ("@/views/Audits.vue")
);

const Informs = defineAsyncComponent(() =>
    import ("@/views/Informs.vue")
);

const Formations = defineAsyncComponent(() =>
    import ("@/views/Formation.vue")
);

const Business = defineAsyncComponent(() =>
    import ("@/views/Business.vue")
);

const BusinessDetail = defineAsyncComponent(() =>
    import ("../components/Business/BusinessDetail.vue")
);

const Auditors = defineAsyncComponent(() =>
    import ("@/views/Auditor.vue")
);

const Login = defineAsyncComponent(() =>
    import ("@/views/Auth/Login.vue")
);

const ResetPassword = defineAsyncComponent(() =>
    import ("@/views/Auth/ResetPassword.vue")
);

const ResetPasswordRequest = defineAsyncComponent(() =>
    import ("@/views/Auth/ResetPasswordRequest.vue")
);

const Visits = defineAsyncComponent(() =>
    import ("@/views/Visits.vue"))

// import Icons from "../views/Icons.vue";
// import Tables from "../views/Tables.vue";
// import MaterialTable from "../views/Tables/MaterialTable.vue"
// import NotFound from "../pages/NotFoundPage.vue";

//import middleware
import auth from "@/middleware/auth";
import guest from "@/middleware/guest";

import auditInit from './routes/audit_routes';

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
                name: "detalle de empresa",
                components: { default: BusinessDetail },
                meta: { middleware: auth },
            },
            {
                path: "/business",
                name: "empresas",
                components: { default: Business },
                meta: { middleware: auth },
            },
            {
                path: "/profile",
                name: "perfil",
                components: { default: Profile },
                meta: { middleware: auth },
            },
            {
                path: "/delegates",
                name: "delegados",
                components: { default: Delegate },
                meta: { middleware: auth },
            },
            {
                path: "/informs",
                name: "informes",
                components: { default: Informs },
                meta: { middleware: auth },

            },

            {
                path: "/auditors",
                name: "auditores",
                components: { default: Auditors },
                meta: { middleware: auth },
            },

            {
                path: "/installations/:id",
                name: "instalacion",
                components: { default: InstallationDetail },
                meta: { middleware: auth },
            },

            {
                path: "/installations",
                name: "instalaciones",
                components: { default: Installations },
                meta: { middleware: auth },
            },

            {
                path: "/documents",
                name: "documentos",
                components: { default: Documents },
                meta: { middleware: auth },
            },

            {
                path: "/audits",
                name: "auditorias",
                components: { default: Audits },
                meta: { middleware: auth },
                redirect: "",
                children: [{
                        path: "",
                        name: "auditorias",
                        components: { default: AuditsTable },
                        meta: { middleware: auth },
                    },
                    {
                        path: "nonconformities",
                        name: "no conformidades",
                        components: { default: NonTable },
                        meta: { middleware: auth },

                    },
                ]
            },
            {
                path: "/vehicles",
                name: "vehiculos",
                components: { default: Vehicle },
                meta: { middleware: auth },
                children: [{
                        path: "",
                        name: "vehiculos",
                        components: { default: VehiclesTable },
                        meta: { middleware: auth },
                    },
                    {
                        path: "drivers",
                        name: "choferes adr",
                        components: { default: EmployeesTable },
                        meta: { middleware: auth },

                    },
                ]
            },

            {
                path: "/materials",
                name: "mercancias",
                components: { default: Materials },
                meta: { middleware: auth },
                children: [{
                        path: "",
                        name: "mercancias",
                        components: { default: MaterialsTable },
                        meta: { middleware: auth },
                    },
                    {
                        path: "residues",
                        name: "residuos",
                        components: { default: MaterialsTable },
                        meta: { middleware: auth },

                    },
                ]
            },

            {
                path: "/employees",
                name: "empleados",
                components: { default: Employees },
                meta: { middleware: auth },
                children: [{
                        path: "",
                        name: "empleados",
                        components: { default: EmployeesTable },
                        meta: { middleware: auth },
                    },
                    {
                        path: "/employees/formations",
                        name: "formaciones",
                        components: { default: EmployeesTable },
                        meta: { middleware: auth },

                    },
                ]
            },

            {
                path: "/formations",
                name: "formaciones",
                components: { default: Formations },
                meta: { middleware: auth },
            },

            {
                path: "/visits",
                name: "visitas",
                components: { default: Visits },
                meta: { middleware: auth },
            },
            auditInit
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

export default routes;