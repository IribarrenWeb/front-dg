import { defineAsyncComponent } from 'vue'
import DashboardLayoutV2 from "@/layout/DashboardLayoutV2";
import AuthLayout from "@/layout/AuthLayout";
import PageLoader from "../loaders/PageLoader.vue"
import TableLoader from "../loaders/TableLoader.vue"
import AuthLoader from "../loaders/AuthLoader.vue"

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

const EmployeesTable = defineAsyncComponent({ loader: () => import('../components/Employee/EmployeesTable.vue'),loadingComponent: TableLoader}); 

const VehiclesTable = defineAsyncComponent({ loader: () => import('../components/Vehicle/VehiclesTable.vue'),loadingComponent: TableLoader}); 

const MaterialsTable = defineAsyncComponent({ loader: () => import('../components/Materials/MaterialTable.vue'),loadingComponent: TableLoader}); 

const AuditsTable = defineAsyncComponent({ loader: () => import('../components/Audit/AuditTable.vue'),loadingComponent: TableLoader}); 

const NonTable = defineAsyncComponent({ loader: () => import('../components/Non/NonTable.vue'),loadingComponent: TableLoader}); 

const Profile = defineAsyncComponent({ loader: () => import('../views/UserProfile.vue'),loadingComponent: PageLoader});

const Audits = defineAsyncComponent({ loader: () => import('../views/Audits.vue'),loadingComponent: PageLoader});

const Informs = defineAsyncComponent({ loader: () => import('../views/Informs.vue'),loadingComponent: PageLoader}); 

const Formations = defineAsyncComponent({ loader: () => import('../views/Formation.vue'),loadingComponent: PageLoader}); 

const Business = defineAsyncComponent({ loader: () => import('../views/Business.vue'),loadingComponent: PageLoader}); 

const BusinessDetail = defineAsyncComponent({ loader: () => import('../components/Business/BusinessDetail.vue'),loadingComponent: PageLoader}); 

const Auditors = defineAsyncComponent({ loader: () => import('../views/Auditor.vue'),loadingComponent: PageLoader}); 

const Login = defineAsyncComponent({ loader: () => import('../views/Auth/Login.vue'),loadingComponent: AuthLoader}); 

const ResetPassword = defineAsyncComponent({ loader: () => import('../views/Auth/ResetPassword.vue'),loadingComponent: AuthLoader}); 

const ResetPasswordRequest = defineAsyncComponent({ loader: () => import('../views/Auth/ResetPasswordRequest.vue'),loadingComponent: AuthLoader}); 

const Visits = defineAsyncComponent({ loader: () => import('../views/Visits.vue'),loadingComponent: PageLoader}); 

const Cartage = defineAsyncComponent({ loader: () => import('../views/CartageLetters.vue'),loadingComponent: PageLoader}); 

const Aplication = defineAsyncComponent({ loader: () => import('../views/BusinessAplication.vue'),loadingComponent: PageLoader}); 

const Users = defineAsyncComponent({ loader: () => import('../views/Users.vue'),loadingComponent: PageLoader}); 

const Billing = defineAsyncComponent({ loader: () => import('../views/Billing.vue'),loadingComponent: PageLoader});

const Plans = defineAsyncComponent({ loader: () => import('../views/Plans.vue'),loadingComponent: PageLoader}); 

const NoAuthorize = defineAsyncComponent({ loader: () => import('../views/NoAuthorize.vue'),loadingComponent: PageLoader}); 
const TrainingTable = defineAsyncComponent({ loader: () => import('../components/Training/TrainingTable.vue'),loadingComponent: PageLoader}); 


//import middleware
import auth from "@/middleware/auth";
import guest from "@/middleware/guest";
import billable from "@/middleware/billable";

import auditInit from './routes/audit_routes';

const routes = [{
        path: "/",
        redirect: "/dashboard",
        component: DashboardLayoutV2,
        children: [{
                path: "/dashboard",
                name: "dashboard",
                components: { default: Dashboard },
                meta: { middleware: auth },
            },
            {
                path: "/business/:id",
                name: "business_detail",
                components: { default: BusinessDetail },
                meta: { middleware: auth, description: 'detalle de empresa' },
            },
            {
                path: "/billing",
                name: "billing",
                components: { default: Billing },
                meta: { middleware: [auth, billable], description: "Subscripciones" },
            },
            {
                path: "/plans",
                name: "plans",
                description: "Planes",
                components: { default: Plans },
                meta: { middleware: [auth], description: 'Planes' },
            },
            {
                path: "/business",
                name: "empresas",
                components: { default: Business },
                meta: { middleware: auth },
            },
            {
                path: "/users",
                name: "usuarios",
                components: { default: Users },
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
                        name: "nonconformities",
                        components: { default: NonTable },
                        meta: { middleware: auth, description: "no conformidades" },

                    },
                ]
            },
            {
                path: "/cartage-letters",
                name: "cartas de porte",
                components: { default: Cartage },
                meta: { middleware: auth }
            },
            {
                path: "/business-aplication",
                name: "solicitudes",
                components: { default: Aplication },
                meta: { middleware: auth }
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
                        path: "keinher",
                        name: "",
                        components: { default: TrainingTable },
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
            {
                path: "/no-authorized",
                name: "unauth",
                components: { default: NoAuthorize },
                meta: { middleware: auth, description:'No autorizado' },
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
    { path: "/:pathMatch(.*)*", name: "not-found", component: NoAuthorize },
];

export default routes;