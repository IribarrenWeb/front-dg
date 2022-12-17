<template>
    <div class="q-py-md custom-menu" style="max-width: 350px">
        <q-list bordered class="">
            <q-item clickable v-ripple class="nav-link" v-for="menu, idx in enabled_menus" :key="idx" :to="menu.path">
                <q-item-section avatar>
                    <icon :class="menu.icon" />
                </q-item-section>

                <q-item-section>{{menu.name}}</q-item-section>
            </q-item>
        </q-list>
        <q-list>
            <q-item clickable v-ripple v-for="menu, idx in system_menues" :key="idx" :to="menu.path">
                <q-item-section avatar>
                    <icon :class="menu.icon" />
                </q-item-section>

                <q-item-section>{{menu.name}}</q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
<script>
import { computed, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    props: {

    },
    setup(props) {
        const store = useStore()
        const user = computed(() => store.state.profile.me)
        const role = computed(() => store.getters.ROLE)
        const menues = ref([
            {
                name: 'Dashboard',
                icon: 'ni ni-tv-2 text-default',
                path: '/dashboard',
                roles: null,
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Empresas',
                icon: 'fa-solid fa-building-columns text-default',
                path: '/business',
                roles: ['business','business_no_adr'],
                not_condition: true,
                no_adr: false,
            },
            {
                name: 'Cartas de porte',
                icon: 'fa-solid fa-envelope-open-text text-default',
                path: '/cartage-letters',
                roles: null,
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Instalaciones',
                icon: 'ni ni-shop text-default',
                path: '/installations',
                roles: ['business','business_no_adr'],
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Empleados',
                icon: 'fa-solid fa-briefcase text-default',
                path: '/employees',
                roles: ['business','business_no_adr'],
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Mercancías',
                icon: 'fa-solid fa-atom text-default',
                path: '/materials',
                roles: ['business','business_no_adr'],
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Vehiculos',
                icon: 'fa-solid fa-truck text-default',
                path: '/vehicles',
                roles: 'business',
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Auditorias',
                icon: 'fa-solid fa-clipboard-list text-default',
                path: '/audits',
                roles: null,
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Informes',
                icon: 'ni ni-book-bookmark text-default',
                path: '/informs',
                roles: null,
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Delegación',
                icon: 'ni ni-single-02 text-default',
                path: '/delegates',
                roles: ['admin'],
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Auditores',
                icon: 'ni ni-hat-3 text-default',
                path: '/auditors',
                roles: ['admin', 'delegate'],
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Formaciones',
                icon: 'fa-solid fa-book-bookmark text-default',
                path: '/formations',
                roles: ['delegate', 'auditor'],
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Visitas',
                icon: 'fa-regular fa-calendar-check text-default',
                path: '/visits',
                roles: null,
                not_condition: false,
                no_adr: false,
            },
            {
                name: 'Solicitudes',
                icon: 'fa-solid fa-bell-concierge text-default',
                path: '/business-aplication',
                roles: null,
                not_condition: false,
                no_adr: true,
            }
        ])

        const enabled_menus = computed(() => menues.value.filter((m) => validate(m)))
        
        const system_menues = ref([
            {
                name: 'Documentación',
                icon: 'fa-solid fa-book',
                path: '/documents',
                roles: null,
                not_condition: false
            }
        ])

        function validate(menu) {
            let validation = true;
            if (menu.roles) {
                if (menu.not_condition) {
                    validation = !menu.roles.includes(role.value)
                } else {
                    validation = menu.roles.includes(role.value)
                }
            }
            if (validation && menu.no_adr) {
                validation = store.state.is_bussines_no_adr
            } 

            return validation;
        }

        return {
            user,
            role,
            menues,
            system_menues,
            enabled_menus,
            validate
        }
    }
}
</script>

<style lang="scss">
.custom-menu a {
    padding: .65rem 1.5rem;
    display: flex;
    align-items: center;
    color: #00000080;
    background-color: transparent;
    font-size: .9rem;
}
</style>