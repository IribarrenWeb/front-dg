<template>
    <div>
        <table-header :title="type_for">
            <q-btn v-if="type_for != 'carretera'" outline color="primary" label="Generar" @click="generate"/>
            <q-btn color="primary" label="Agregar" @click="showAdd = true"/>
        </table-header>
        <q-table :loading="loading" table-class="table" table-header-class="thead-light" :data="data" :columns="columns" row-key="name" />

        <q-dialog v-model="showAdd" persistent>
            <q-card style="min-width: 700px;">
                <q-card-section>
                    <cartage-form :modalMode="true" @close="showAdd = false" />
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import TableHeader from '../Utils/TableHeader.vue'
import { baseUrl } from '../../axios'
import { computed } from '@vue/runtime-core'
import CartageForm from './CartageForm.vue'
export default {
	components: { TableHeader, CartageForm },
    props: {
        type_for: {
            type: String,
            default: 'maritima'
        }
    },
    setup(props) {
        const data = ref([])
        const generateUrl = computed(() => {
            return baseUrl + 'uploads/cartages/' + props.type_for + '.pdf'
        })
        const showAdd = ref(false);
        const columns = [
            {
                name: 'name',
                label: 'Nombre',
                align: 'left',
                field: row => row.name,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'description',
                label: 'Descripción',
                align: 'left',
                field: row => row.description,
                // format: val => `${val}`,
                sortable: false
            },
            {
                name: 'date',
                label: 'Fecha',
                align: 'left',
                field: row => row.date,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'installation',
                label: 'Instalación',
                align: 'left',
                field: row => row.installation.name,
                // format: val => `${val}`,
                sortable: true
            },
        ]
        const loading = ref(false)

        async function getData() {
            try {
                const where = JSON.stringify({
                    type: props.type_for,
                    // installation_id: props.installation_id
                })
                const includes = JSON.stringify([
                    'document',
                    'installation'
                ])
                loading.value = true
                const res = await modelService.apiNoLoading({ url: `cartage-letter?wheres=${where}&includes=${includes}` })
                loading.value = false
            } catch (err) {

            }
        }

        function generate() {
            window.open(generateUrl.value, '_blank').focus();
        }

        getData();

        return {
            data,
            columns,
            loading,
            generateUrl,
            baseUrl,
            showAdd,

            generate
        }
    }
}
</script>