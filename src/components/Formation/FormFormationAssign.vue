<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <ul class="nav nav-pills mb-md-4 justify-content-center">
                <li class="nav-item" v-for="step in steps" :key="step.key">
                    <a class="nav-link p-2" :class="[
                        { active: currentStep == step.number },
                        { disabled: !step.valid && currentStep != step.number },
                    ]" href="#" @click.prevent="meta.valid ? (currentStep = step.number) : ''">
                        <i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i>
                        {{ step.title }}
                    </a>
                </li>
            </ul>

            <template v-if="currentStep == 1">
                <div class="row">
                    <div class="col-md-6">
                        <base-field name="installation_id" label="Instalación" v-if="installations">
                            <field-validate as="select" class="form-control" name="installation_id" rules="required"
                                label="instalación" v-model="installation_id">
                                <option v-for="installation in installations" :key="installation.key"
                                    :value="installation.id">
                                    {{ installation?.name }}
                                </option>
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field name="date" label="Fecha">
                            <field-validate name="date" label="fecha" v-model="model.date" v-slot="{ field }">
                                <input type="date" :min="currentDate" class="form-control" v-bind="field">
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field name="time" label="Hora">
                            <field-validate type="time" class="form-control" name="time" label="hora"
                                v-model="model.time" />
                        </base-field>
                    </div>
                </div>
            </template>

            <template v-if="currentStep == 2">
                <div>
                    <div class="row q-gutter-md mx-0 align-items-end mb-4">
                        <base-field label="Buscar">
                            <input class="form-control" style="min-width:300px" placeholder="Buscar" v-model="filter" />
                        </base-field>
                        <base-field label="Ultima formación">
                            <q-input outlined v-model="filter_date" mask="date">
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy style="height: 400px;" cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="date">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </base-field>
                    </div>
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>DNI</th>
                                <th>CARGO</th>
                                <th>ULTIMA FORMACIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="employees_rows?.length < 1">
                                <td colspan="4">No hay empleados disponibles</td>
                            </tr>
                            <tr v-for="employee in employees_rows" :key="employee.id">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" :value="employee.id"
                                            v-model="model.employees_ids">
                                        <label class="form-check-label" for="flexCheckDefault">
                                            {{ employee?.full_name }}
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    {{ employee?.dni }}
                                </td>
                                <td>
                                    {{ employee?.position }}
                                </td>
                                <td>
                                    {{ employee?.last_formation == null ? 'SIN FORMACIÓN' :
                                            employee.last_formation.date_formatted
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>

            <div class="mt-4 float-md-right">
                <base-button type="default" @click="currentStep--" :outline="true" v-if="currentStep !== 1">Anterior
                </base-button>
                <base-button type="default" nativeType="submit" v-if="currentStep !== 2">Siguiente</base-button>
                <base-button type="default" nativeType="submit" v-if="currentStep === 2">Aceptar</base-button>
                <base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
                </base-button>
            </div>

        </form-validate>
    </div>
</template>

<script>
import service from "@/store/services/model-service";
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';

export default {
    props: ['formation_id'],
    setup(props, { emit }) {
        const steps = ref([
            {
                number: 1,
                title: "Instalación",
                valid: false,
            },
            {
                number: 2,
                title: "Empleados",
                valid: false,
            },
        ])

        const model = ref({
            employees_ids: [],
            date: "",
            time: "",
            customer_formation_id: props.formation_id,
            installation_id: null
        })

        const date = ref("");
        const time = ref("");
        const installation_id = ref(null);
        const employees = ref([]);
        const installations = ref([]);
        const currentStep = ref(1);
        const currentDate = ref("");
        const filter = ref(null);
        const employees_rows = computed(() => {
            return employees.value?.filter((e) => {
                return filter.value ? e.full_name.toLowerCase().includes(filter.value) : e;
            }) ?? []
        })
        currentDate.value = new Date().toISOString().split('T')[0]


        async function onSubmit(values, { resetForm }) {
            if (currentStep.value == 1) {
                loadEmployees(installation_id.value)
                model.value.installation_id = installation_id.value
                // model.value.date += `${values.date} ${values.time}`;
            }

            if (currentStep.value == 2) {
                try {
                    await service.store('training', model.value)
                    // $toast.value.success('Asignación registrada')
                    resetForm()
                    emit('reload')
                    emit('close')
                } catch (error) {
                    console.log(error);
                }
            }

            if (currentStep.value != 2) {
                currentStep.value++;
            }
        }

        async function loadEmployees(id) {
            try {
                console.log('peticion 1', id);
                const resp = await service.getIndex('employee', null, 'installation_id=' + id + '&not_formation_id=' + props.formation_id);
                console.log('peticion', id, resp);
                employees.value = resp.data.data;
            } catch (err) {
                console.err(err);
                model.value.date = ''
            }
        }

        async function loadInstallations() {
            try {
                const resp = await service.getIndex('installation', null);
                installations.value = resp.data.data;
            } catch (err) {
                console.log(err.response);
                // this.$toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        }

        function handleClose(reset) {
            reset()
            emit('close')
        }


        loadInstallations()

        return {
            date,
            time,
            installation_id,
            employees,
            installations,
            currentStep,
            currentDate,
            filter,
            steps,
            model,
            currentDate,
            employees_rows,

            handleClose,
            onSubmit
        }

    }

}
</script>