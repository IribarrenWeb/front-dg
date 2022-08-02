import AuditLayout from "@/layout/AuditLayout";
import auth from "@/middleware/auth";
import Step_1 from "@/views/Audits/Steps/Step_1";
import Step_2 from "@/views/Audits/Steps/Step_2";
import Step_3 from "@/views/Audits/Steps/Step_3";
import Step_4 from "@/views/Audits/Steps/Step_4";
import Step_5 from "@/views/Audits/Steps/Step_5";
import Step_6 from "@/views/Audits/Steps/Step_6";
import Step_7 from "@/views/Audits/Steps/Step_7";
import Step_8 from "@/views/Audits/Steps/Step_8";
import Step_9 from "@/views/Audits/Steps/Step_9";
import Step_10 from "@/views/Audits/Steps/Step_10";
import Step_11 from "@/views/Audits/Steps/Step_11";
import Step_12 from "@/views/Audits/Steps/Step_12";
import Step_13 from "@/views/Audits/Steps/Step_13";

const auditInit = {
    path: "/audit-init/:id",
    name: "auditoria",
    component: AuditLayout,
    meta: { middleware: auth, audit: true },
    children: [{
            path: "page/1",
            name: "step.1",
            component: Step_1,
            meta: { middleware: auth },
        },
        {
            path: "page/2",
            name: "step.2",
            component: Step_2,
            meta: { middleware: auth },
        },
        {
            path: "page/3",
            name: "step.3",
            component: Step_3,
            meta: { middleware: auth },
        },
        {
            path: "page/4",
            name: "step.4",
            component: Step_4,
            meta: { middleware: auth },
        },
        {
            path: "page/5",
            name: "step.5",
            component: Step_5,
            meta: { middleware: auth },
        },
        {
            path: "page/6",
            name: "step.6",
            component: Step_6,
            meta: { middleware: auth },
        },
        {
            path: "page/7",
            name: "step.7",
            component: Step_7,
            meta: { middleware: auth },
        },
        {
            path: "page/8",
            name: "step.8",
            component: Step_8,
            meta: { middleware: auth },
        },
        {
            path: "page/9",
            name: "step.9",
            component: Step_9,
            meta: { middleware: auth },
        },
        {
            path: "page/10",
            name: "step.10",
            component: Step_10,
            meta: { middleware: auth },
        },
        {
            path: "page/11",
            name: "step.11",
            component: Step_11,
            meta: { middleware: auth },
        },
        {
            path: "page/12",
            name: "step.12",
            component: Step_12,
            meta: { middleware: auth },
        },
        {
            path: "page/13",
            name: "step.13",
            component: Step_13,
            meta: { middleware: auth },
        },
    ]
};

export default auditInit;