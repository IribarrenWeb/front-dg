<template>
    <div>
        <h3>{{ aplicationId ? 'Detalles de la ' : 'Realizar' }} solicitud</h3>
        <q-separator spaced="20px" />
        <q-form @submit="submit" class="row q-col-gutter-md">
            <installation-filter-v-2 :disable="aplicationId ? true : false" :readonly="aplicationId ? true : false"
                class="col-12" v-model="model.installation_id" />

            <q-input :rules="[val => !!val || 'La fecha es requerida']" class="col-12" dense outlined
                v-model="model.scheduled_date" label="Fecha">
                <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="model.scheduled_date" mask="YYYY-MM-DD HH:mm">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>

                <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="model.scheduled_date" mask="YYYY-MM-DD HH:mm" format24h>
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>

            <q-select :readonly="aplicationId ? true : false"
                :rules="[val => val?.length && val.length >= 1 || 'Los empleados son requeridos']" :loading="loading"
                v-if="model.installation_id && typeAplication == 'formation'" multiple use-chips emit-value map-options
                v-model="model.employees_ids" :options="employeesOp" label="Empleados" outlined dense class="col-12" />

            <q-select :rules="[val => val >= 1 || 'La formación es requerida']" :loading="loading"
                v-if="role != 'business' && typeAplication == 'formation'" emit-value map-options v-model="formation_id"
                :options="formationsOp" label="Formación" outlined dense class="col-12" />

            <div class="col-12 flex items-center justify-end q-gutter-md">
                <q-btn label="Cancelar" type="reset" color="primary" @click="$emit('cancel', true)" flat
                    class="q-ml-sm" />

                <q-btn label="Rechazar" @click="handleUpdate(0)" outline v-if="aplicationId" :loading="loading"
                    color="primary" />

                <q-btn v-if="aplicationId" label="Aceptar" :loading="loading" @click="handleUpdate(1)"
                    color="primary" />

                <q-btn v-else label="Guardar" :disable="!model.installation_id" :loading="loading" type="submit"
                    color="primary" />
            </div>
        </q-form>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import InstallationFilterV2 from '../filters/InstallationFilterV2.vue'
import { computed, watch } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { useStore } from 'vuex'
export default {
    components: { InstallationFilterV2 },
    props: {
        typeAplication: {
            type: String,
            default: 'formation'
        },
        aplicationId: {
            type: Number,
            default: null
        },
        cancel: {
            type: Function
        }
    },
    setup(props, { emit }) {
        const store = useStore();
        const role = computed(() => store.getters.ROLE)
        const model = ref({
            installation_id: null,
            scheduled_date: null,
            employees_ids: [],
            type: props.typeAplication
        })
        const employees = ref([])
        const formations = ref([])
        const formation_id = ref(null)
        const loading = ref(false)
        const employeesOp = computed(() => {
            return employees.value.map(e => {
                return {
                    label: e?.full_name,
                    value: e?.id
                }
            })
        })
        const formationsOp = computed(() => {
            return formations.value.map(e => {
                return {
                    label: e?.name,
                    value: e?.id
                }
            })
        })

        async function submit() {
            try {
                loading.value = true
                await modelService.apiNoLoading({ url: `business-aplication`, method: 'POST', data: model.value })
                loading.value = false

                Notify.create({
                    message: 'Solicitud realizada',
                    color: 'positive'
                })
                emit('saved', true);
            } catch (error) {
                const serverMessage = error?.request?.response ? JSON.parse(error?.request?.response) : null
                const message = serverMessage?.message ?? 'Ocurrio un error al realizar la solicitud';
                loading.value = false
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
        }

        function setModel(data) {
            model.value.installation_id = data.installation_id
            model.value.scheduled_date = data.scheduled_date
            model.value.employees_ids = data.employees.map(e => e.id)
        }

        async function handleUpdate(status) {
            try {
                loading.value = true
                let data = {
                    status: status,
                    scheduled_date: model.value.scheduled_date,
                    type: props.typeAplication,
                }

                if (props.typeAplication == 'formation') {
                    data['customer_formation_id'] = formation_id.value ?? null
                }
                
                await modelService.apiNoLoading({
                    url: `business-aplication/${props.aplicationId}`, method: 'PUT', data: data
                })
                loading.value = false

                Notify.create({
                    message: 'Solicitud actualizada',
                    color: 'positive'
                })
                emit('saved', true);
            } catch (error) {
                const serverMessage = error?.request?.response ? JSON.parse(error?.request?.response) : null
                const message = serverMessage?.message ?? 'Ocurrio un error al actualizar la solicitud';
                loading.value = false
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
        }
        async function getAplicationData() {
            try {
                loading.value = true
                const includes = JSON.stringify([
                    'employees',
                ])
                const res = await modelService.api({ url: `business-aplication/${props.aplicationId}?includes=${includes}` })
                loading.value = false
                const data = res?.data?.data ?? null
                if (data) setModel(data)
                console.log(res);
            } catch (err) {
                loading.value = false

            }
        }

        async function getEmployees() {
            try {
                loading.value = true
                const res = await modelService.api({ url: `employees?installation_id=${model.value.installation_id}` })
                console.log(res);
                employees.value = res?.data?.data ?? []
                loading.value = false
            } catch (error) {
                loading.value = false
                console.error(error);
            }
        }

        async function getFormations() {
            try {
                loading.value = true
                const res = await modelService.api({ url: `formations` })
                console.log(res);
                formations.value = res?.data?.data ?? []
                loading.value = false
            } catch (error) {
                loading.value = false
                console.error(error);
            }
        }

        watch(() => model.value.installation_id, (v) => {
            if (v && props.typeAplication == 'formation') getEmployees()
        }, { deep: true })

        watch(() => props.aplicationId, (v) => {
            if (v) getAplicationData()
        }, { immediate: true })

        watch(() => role.value, (v) => {
            if (v != 'business' && props.typeAplication == 'formation') getFormations()
        }, { immediate: true })

        return {
            model,
            loading,
            employeesOp,
            formationsOp,
            formation_id,
            role,
            submit,
            handleUpdate
        }
    }
}
</script>