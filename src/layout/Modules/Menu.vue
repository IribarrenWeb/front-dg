<template>
    <div class="q-py-md custom-menu" style="max-width: 350px">
        <q-list bordered class="">
            <q-item clickable v-ripple class="nav-link" v-for="menu, idx in enabled_menus" :key="idx" :to="menu.path">
                <q-item-section avatar>
                    <i :class="menu.icon"></i>
                </q-item-section>

                <q-item-section>{{ menu.name }}</q-item-section>
            </q-item>
        </q-list>
        <q-list>
            <q-item clickable v-ripple v-for="menu, idx in system_menues" :key="idx" :to="menu.path">
                <q-item-section avatar>
                    <i :class="menu.icon"></i>
                </q-item-section>

                <q-item-section>{{ menu.name }}</q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
<script>
import { computed, ref } from '@vue/runtime-core'
import { isEmpty } from 'lodash'
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
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Usuarios',
                icon: 'fa-solid fa-users text-default',
                path: '/users',
                roles: ['superadmin'],
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Planes',
                icon: 'fa-solid fa-bolt text-default',
                path: '/plans',
                roles: ['superadmin'],
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Empresas',
                icon: 'fa-solid fa-building-columns text-default',
                path: '/business',
                roles: ['business', 'business_no_adr', 'superadmin'],
                not_condition: true,
                no_adr: false,
                or_not_conditions: {
                    business_id: true,
                    roles: ['auditor']
                },
            },
            {
                name: 'Cartas de porte',
                icon: 'fa-solid fa-envelope-open-text text-default',
                path: '/cartage-letters',
                roles: ['superadmin'],
                not_condition: true,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Instalaciones',
                icon: 'ni ni-shop text-default',
                path: '/installations',
                roles: ['business', 'business_no_adr'],
                not_condition: false,
                no_adr: false,
                or_conditions: [
                    {
                        business_id: true,
                        roles: ['auditor']
                    },
                ]
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Empleados',
                icon: 'fa-solid fa-briefcase text-default',
                path: '/employees',
                roles: ['business', 'business_no_adr'],
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Mercancías',
                icon: 'fa-solid fa-atom text-default',
                path: '/materials',
                roles: ['business', 'business_no_adr'],
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Vehiculos',
                icon: 'fa-solid fa-truck text-default',
                path: '/vehicles',
                roles: 'business',
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Auditorías',
                icon: 'fa-solid fa-clipboard-list text-default',
                path: '/audits',
                roles: ['superadmin'],
                not_condition: true,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Informes anuales',
                icon: 'ni ni-book-bookmark text-default',
                path: '/informs',
                roles: ['superadmin'],
                not_condition: true,
                no_adr: false,
                or_not_conditions: {
                    no_adr: true,
                    roles: ['business'],
                },
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Delegación',
                icon: 'ni ni-single-02 text-default',
                path: '/delegates',
                roles: ['admin'],
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Auditores',
                icon: 'ni ni-hat-3 text-default',
                path: '/auditors',
                roles: ['admin', 'delegate'],
                not_condition: false,
                no_adr: false,
                or_conditions: [
                    // {
                    //     consultancy_id: true,
                    //     roles: ['business'],
                    //     no_adr: true,
                    // },
                    {
                        consultancy_id: false,
                        administrable_type: false,
                        roles: ['business'],
                    },
                ]
            },
            {
                name: 'Formaciones',
                icon: 'fa-solid fa-book-bookmark text-default',
                path: '/formations',
                roles: ['delegate', 'auditor'],
                not_condition: false,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Visitas',
                icon: 'fa-regular fa-calendar-check text-default',
                path: '/visits',
                roles: ['superadmin'],
                not_condition: true,
                no_adr: false,
                // or_conditions: {
                //     // consultancy_id: false
                // },
            },
            {
                name: 'Solicitudes',
                icon: 'fa-solid fa-bell-concierge text-default',
                path: '/business-aplication',
                roles: ['delegate', 'auditor', 'business'],
                not_condition: false,
                no_adr: false,
                or_conditions: [
                    {
                        consultancy_id: false,
                        not_roles: ['admin', 'superadmin']
                    },
                ]
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

        function validateEmpty(value) {
            let empty = false;
            if (typeof value == 'number') {
                empty = !(parseInt(value) >= 1)
            } else {
                empty = isEmpty(value)
            }
            return empty;
        }

        function validateOr(conditions) {
            let count = 0;
            let total = Object.entries(conditions).length
            Object.entries(conditions).forEach(entry => {
                const [key, value] = entry;

                if (key == 'roles' && value.includes(role.value)) {
                    count++
                } else if (key == 'not_roles' && !value.includes(role.value)) {
                    count++
                } else if (!['not_roles', 'roles'].includes(key) && user.value?.profile && ((value && !validateEmpty(user.value?.profile[key])) || (!value && validateEmpty(user.value.profile[key])))) {
                    count++
                }

            });

            return count == total
        }

        function validate(menu) {
            let validation = true;

            if (menu.roles) {
                if (menu.not_condition) {
                    validation = !menu.roles.includes(role.value)
                } else {
                    validation = menu.roles.includes(role.value)
                }
            }
            if (validation && menu.no_adr && role.value == 'business') {
                validation = store.state.is_bussines_no_adr
            }

            if (!validation && menu?.or_conditions?.length) {
                let pass = false;
                menu?.or_conditions.forEach(conditions => {
                    if (pass) return
                    pass = validateOr(conditions)
                });

                validation = pass
                console.log('orConditions', validation);

            }

            if (validation && menu?.or_not_conditions) {
                let count = 0;
                let total = Object.entries(menu?.or_not_conditions).length
                Object.entries(menu?.or_not_conditions).forEach((entry, idx) => {
                    const [key, value] = entry;

                    if (key == 'roles' && value.includes(role.value)) {
                        count++
                    } else if (!['not_roles', 'roles'].includes(key) && user.value?.profile && ((value && !validateEmpty(user.value?.profile[key])) || (!value && validateEmpty(user.value.profile[key])))) {
                        count++
                    }
                    console.log('notor', total, count);

                });
                validation = total == count ? false : true
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