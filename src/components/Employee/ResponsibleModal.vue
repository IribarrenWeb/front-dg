<template>
    <div>
        <modal :show="show" action="Agregar" @update:show="$emit('update:show',$event)" modalClasses="modal-xxl"
            model="Responsables">

            <form-employee v-if="addResponsible" @reload="get" @close="addResponsible = false, employee_id = null" :installation_id="installation_id" :responsible="true" :employee_id="employee_id"/>
            <div v-else>
                <!-- <div class="pl-2 pb-2">
                    <h3>Listado de empleados</h3>
                </div> -->
                <div class="row mx-0 align-items-end mb-4">
                    <base-input groupClasses="mb-0" class="mb-0" style="width:300px" label="Buscar" placeholder="Buscar" v-model="filter" />
                    <base-button icon="fa-solid fa-plus" class="ml-3 mb-1" outline icon-only @click="addResponsible = true" />
                </div>


                <table class="table table-sm table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>DNI</th>
                            <th>CARGO</th>
                            <th>RESPONSABLE</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="employees_rows?.length < 1">
                            <td colspan="4">No hay empleados disponibles</td>
                        </tr>
                        <tr v-for="employee in employees_rows" :key="employee.id">
                            <td>
                                <div class="form-check">
                                    <input v-if="!employee.is_representative" class="form-check-input"
                                        :disabled="employee.is_representative ? true :false" type="checkbox"
                                        :value="employee.id" v-model="employees_ids" />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        {{ employee.full_name }}
                                    </label>
                                </div>
                            </td>
                            <td>
                                {{ employee.dni }}
                            </td>
                            <td>
                                {{ employee.position }}
                            </td>
                            <td>
                                {{ employee.is_representative ? 'SI' : 'NO' }}
                                
                            </td>
                            <td>
                                <base-button icon="fa-regular fa-eye" class="ml-3 mb-1" outline icon-only size="sm" @click="employee_id = employee.id,addResponsible = true "/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-4 row justify-content-end">
                    <base-button type="primary" @click="save" :disabled="!employees_ids || employees_ids?.length < 1">
                        Asignar como responsables
                    </base-button>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core';
import FormEmployee from './FormEmployee.vue';

export default {
	components: { FormEmployee },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        installation_id: {
            type: Number
        }
    },
    setup(props) {
        const store = useStore()
        const employees = ref([]);
        const employees_ids = ref([])
        const filter = ref(null)
        const employees_rows = computed(() => {
            return employees.value.filter((e) => {
                return filter.value ? e.full_name.toLowerCase().includes(filter.value) : e;
            })
        })
        const employee_id = ref(null);
        const addResponsible = ref(false);

        async function get() {
            const custom_where = JSON.stringify({
                // is_representative: 0
            })

            const res = await store.dispatch('employee/get', '&installation_id=' + props.installation_id + '&custom_wheres=' + custom_where)
            employees.value = res.data.data;
        }

        async function save() {
            try {
                await store.dispatch('employee/updateResponsibles', {
                    employees_ids: employees_ids.value
                })
                get()
            } catch (error) {
                console.log(error);
            }

        }

        watch(() => props.show, (v) => {
            if (v) {
                get()
            }
        }, { immediate: true })

        return {
            employees,
            employees_ids,
            employees_rows,
            filter,
            save,
            addResponsible,
            employee_id,
            get
        }
    }
}
</script>