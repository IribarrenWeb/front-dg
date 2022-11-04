<template>
    <div>
        <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)">
            <q-card style="min-width: 80vw;">
                <q-card-section class="q-ma-md items-center">
                    <form-employee v-if="addResponsible" @reload="get"
                        @close="addResponsible = false, employee_id = null" :installation_id="installation_id"
                        :responsible="true" :employee_id="employee_id" />
                    <div v-else>
                        <div class="flex mx-0 align-items-end mb-4">
                            <base-input groupClasses="mb-0" class="mb-0" style="width:300px" label="Buscar"
                                placeholder="Buscar" v-model="filter" />
                            <base-button icon="fa-solid fa-plus" class="ml-3 mb-1" outline icon-only
                                @click="addResponsible = true" />
                        </div>


                        <q-table title="Empleados" selection="multiple" :rows="employees_rows" :columns="columns"
                            row-key="id" v-model:selected="responsibles">
                            <template #body-cell-actions="props">
                                <q-td :props="props">
                                    <q-btn color="primary" flat icon="fa-regular fa-eye"
                                        @click="employee_id = props.row.id, addResponsible = true" />
                                </q-td>
                            </template>
                        </q-table>


                        <!-- <table class="table table-sm table-hover table-bordered">
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
                                                :disabled="employee.is_representative ? true : false" type="checkbox"
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
                                        <base-button icon="fa-regular fa-eye" class="ml-3 mb-1" outline icon-only
                                            size="sm" @click="employee_id = employee.id, addResponsible = true" />
                                    </td>
                                </tr>
                            </tbody>
                        </table> -->
                    </div>
                </q-card-section>
                <q-card-actions align="right" v-if="!addResponsible">
                    <q-btn padding="10px 20px" style="border-radius: 8px;" label="Cancelar" color="primary"
                        v-close-popup />
                    <q-btn padding="10px 20px" style="border-radius: 8px;" label="Asignar como responsables"
                        :disable="!canUpdate" color="primary" @click="save" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core';
import FormEmployee from './FormEmployee.vue';
import modelService from '../../store/services/model-service';

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
        const filter = ref(null)
        const employees_rows = computed(() => {
            return employees.value.filter((e) => {
                return filter.value ? e.full_name.toLowerCase().includes(filter.value) : e;
            })
        })
        const canUpdate = computed(() => {
            const model_responsibles_ids = employees.value?.filter(e => e.is_representative)?.map(e => e.id) ?? []
            const responsibles_ids = responsibles.value?.map(e => e.id) ?? []
            const diff = responsibles_ids?.filter(r => !model_responsibles_ids.includes(r))

            return diff.length >= 1 ? true : false;
        })
        const employee_id = ref(null);
        const responsibles = ref([])
        const employees_ids = computed(() => responsibles.value.map(r => r.id))
        const addResponsible = ref(false);
        const columns = ref([
            {
                name: 'full_name',
                label: 'Nombre',
                align: 'left',
                field: row => row.full_name,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'dni',
                label: 'DNI',
                align: 'left',
                field: row => row.dni,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'position',
                label: 'Cargo',
                align: 'left',
                field: 'position',
                // field: row => row.position,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'is_representative',
                label: 'Responsable',
                align: 'left',
                field: row => row.is_representative,
                format: val => `${val ? 'SI' : 'NO'}`,
                sortable: true
            },
            {
                name: 'actions',
                label: '',
                // align: 'left',
                // field: row => row.is_representative,
                // format: val => `${val ? 'SI' : 'NO'}`,
                // sortable: true
            }
        ])

        async function get() {
            const custom_where = JSON.stringify({
                installation_id: props.installation_id
            })

            const res = await modelService.api({ url: 'employees?with[]=formations&with[]=firm_document&custom_wheres=' + custom_where })
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

        function setResponsibles() {
            responsibles.value = employees.value.filter(e => e.is_representative)
        }

        watch(() => props.show, (v) => {
            if (v) {
                get()
            }
        }, { immediate: true })

        watch(() => employees.value, (v) => {
            if (v && v.length >= 1) {
                setResponsibles()
            }
        }, { immediate: true })

        return {
            employees,
            employees_ids,
            employees_rows,
            filter,
            columns,
            responsibles,
            canUpdate,
            save,
            addResponsible,
            employee_id,
            get
        }
    }
}
</script>