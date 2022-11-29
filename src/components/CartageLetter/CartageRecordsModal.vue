<template>
    <q-dialog>
        <q-card style="min-width: 1000px;">
            <q-card-section>
                <q-tabs v-model="tab" class="text-primary">
                    <q-tab name="destinatary" icon="fa-solid fa-user" label="Destinatarios" />
                    <q-tab name="carrier" icon="fa-solid fa-truck" label="Transportistas" />
                    <q-tab name="loader" icon="fa-solid fa-upload" label="Cargadores" />
                </q-tabs>
                <q-separator spaced />
                <q-table :title="tableTitle" :rows="data" :columns="columns" row-key="id" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { computed, watch } from '@vue/runtime-core'
export default {
    components: {  },
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


        watch(() => tab.value, (v) => {
            if (v) getRecords();
        }, { immediate: true })

        return {
            loading,
            tab,
            tableTitle,
            columns,
            data
        }
    }
}
</script>