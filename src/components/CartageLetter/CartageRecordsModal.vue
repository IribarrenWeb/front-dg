<template>
    <q-dialog>
        <q-card style="min-width: 1000px;">
            <q-card-section>
                <q-tabs v-model="tab" class="text-primary">
                    <q-tab name="destinatary" icon="fa-solid fa-user" label="Destinatarios" />
                    <q-tab name="loader" icon="fa-solid fa-upload" label="Cargadores" />
                    <q-tab name="carrier" icon="fa-solid fa-truck" label="Transportistas" />
                </q-tabs>
                <q-separator spaced />
                <!-- <pre>{{records_models[tab]}}</pre> -->
                <q-btn color="primary" v-if="record_id" class="q-ml-md" flat icon="fa-solid fa-arrow-left" label="Volver" @click="reset"/>
                <q-btn color="primary" v-if="(!newRecord && !record_id)" class="q-ml-auto" flat icon="fa-solid fa-plus" label="Agregar" @click="handleAdd"/>
                <q-table class="record-table" :loading="loading" v-if="(!record_id && !newRecord)" :rows="data" :columns="columns"
                    row-key="id">
                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <q-btn color="primary" flat dense icon="fa-regular fa-pen-to-square" @click="handleSelect(props.row.id)" />
                        </q-td>
                    </template>
                </q-table>
                <q-tab-panels v-else v-model="tab" animated>
                    <q-tab-panel name="destinatary">
                        <form-loader v-if="(!record_data?.id && !newRecord)" />
                        <cartage-destinatary-form v-else :selectMode="false"
                            v-model:address="records_models.destinatary.address" :loading="loading"
                            v-model:business_name="records_models.destinatary.business_name"
                            v-model:nif="records_models.destinatary.nif"
                            v-model:phone_number="records_models.destinatary.phone_number" />
                    </q-tab-panel>
                    <q-tab-panel name="loader">
                        <form-loader v-if="!record_data?.id && !newRecord" />
                        <cartage-loader-form v-else :selectMode="false" :loading="loading"
                            v-model:address="records_models.loader.address"
                            v-model:business_name="records_models.loader.business_name"
                            v-model:nif="records_models.loader.nif"
                            v-model:phone_number="records_models.loader.phone_number" />
                    </q-tab-panel>
                    <q-tab-panel name="carrier">
                        <form-loader v-if="(!record_data?.id && !newRecord)" />
                        <cartage-carrier-form v-else :selectMode="false" :loading="loading"
                            v-model:address="records_models.carrier.address"
                            v-model:business_name="records_models.carrier.business_name"
                            v-model:nif="records_models.carrier.nif"
                            v-model:phone_number="records_models.carrier.phone_number" />
                    </q-tab-panel>
                </q-tab-panels>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" v-close-popup />
                <q-btn flat label="Guardar" color="primary" @click="saveChanges" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { computed, watch } from '@vue/runtime-core'
import functions from '../../utils/functions'
import { keys } from 'lodash'
import CartageDestinataryForm from './Forms/RoadFormModules/CartageDestinataryForm.vue'
import CartageCarrierForm from './Forms/RoadFormModules/CartageCarrierForm.vue'
import CartageLoaderForm from './Forms/RoadFormModules/CartageLoaderForm.vue'
import FormLoader from '../../loaders/FormLoader.vue'

export default {
    components: { CartageDestinataryForm, CartageCarrierForm, CartageLoaderForm, FormLoader },
    inheritAttrs: true,
    props: {
    },
    setup(props, { emit }) {
        const loading = ref(false)
        const tab = ref('destinatary')
        const tableTitle = computed(() => {
            let title = 'Destinatarios'

            if (tab == 'carrier') {
                title = 'Transportistas'
            }

            if (tab == 'loader') {
                title = 'Cargadores'
            }
            return title
        })
        const data = ref([])
        const columns = [
            {
                name: 'business_name',
                label: 'Razón Social',
                align: 'left',
                field: row => row.business_name,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'nif',
                label: 'NIF',
                align: 'left',
                field: row => row.nif,
                // format: val => `${val}`,
                sortable: false
            },
            {
                name: 'actions',
                align: 'left',
                sortable: false
            },
        ];
        const endpoint = computed(() => {
            return `cartage-${tab.value}`;
        })

        const records_models = ref({
            destinatary: functions.schemas('cartage_destinatary'),
            carrier: functions.schemas('cartage_carrier'),
            loader: functions.schemas('cartage_loader')
        })

        const record_id = ref(null)
        const newRecord = ref(false)

        const record_data = ref(null)

        function setModel() {
            const keys_model = keys(records_models.value[tab.value])

            keys_model.forEach(key => {
                if (key in record_data.value) {
                    records_models.value[tab.value][key] = record_data.value[key]
                }
            });
        }

        async function getRecord() {
            loading.value = true
            try {
                const res = await modelService.apiNoLoading({ url: `${endpoint.value}/${record_id.value}` })
                record_data.value = res.data?.data ?? null
                console.log(res);
                if (!record_data.value) {
                    reset()
                }
            } catch (err) {
                loading.value = false
                Notify.create({
                    message: 'No se pudo obtener el registro',
                    color: 'negative'
                })
                reset()
            }
            loading.value = false
        }

        async function saveChanges() {
            loading.value = true
            try {
                const method = newRecord.value && !record_id.value ? 'POST' : 'PUT' 
                let url = `${endpoint.value}`

                if (method == 'PUT') {
                    url += `/${record_id.value}`
                }
                await modelService.apiNoLoading({ url: url, method: method, data: records_models.value[tab.value] })
                reset()
                getRecords()
            } catch (err) {
                loading.value = false
                Notify.create({
                    message: 'No se pudo guardar los cambios',
                    color: 'negative'
                })
                reset()
            }
            loading.value = false
        }

        function handleAdd(){
            newRecord.value = true
        }

        async function getRecords() {
            loading.value = true
            try {
                const res = await modelService.apiNoLoading({ url: `${endpoint.value}` })
                data.value = res?.data?.data ?? []

            } catch (err) {
                console.log(err.response);
                const message = err?.response?.data?.message ?? err?.response?.message
                Notify.create({
                    message: message ?? 'No se pud obtener los registros',
                    color: 'negative'
                })
                emit('update:model-value', false)
            }
            loading.value = false
        }

        function reset() {
            records_models.value = {
                destinatary: functions.schemas('cartage_destinatary'),
                carrier: functions.schemas('cartage_carrier'),
                loader: functions.schemas('cartage_loader')
            }
            record_id.value = null
            record_data.value = null
            newRecord.value = false
        }

        function handleSelect(id) {
            record_id.value = id
            getRecord()
        }

        watch(() => tab.value, (v) => {
            if (v) getRecords();
            reset()
        }, { immediate: true })

        watch(() => record_data.value, (v) => {
            if (v) setModel();
        }, { immediate: true })



        return {
            loading,
            tab,
            tableTitle,
            columns,
            data,
            record_id,
            records_models,
            handleSelect,
            saveChanges,
            reset,
            record_data,
            newRecord,
            handleAdd
        }
    }
}
</script>

<style lang="scss">
.record-table {
    box-shadow: none !important;

    .q-table {
        box-shadow: none !important;

    }
}
</style>