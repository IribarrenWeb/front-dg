<template>
    <div>
        <table-header :title="type_for">
            <q-btn v-if="type_for != 'carretera' && role == 'business'" outline color="primary" label="Generar"
                @click="generate" />
            <q-btn v-if="role == 'business'" color="primary" label="Agregar" @click="showAdd = true" />
        </table-header>
        <q-table :loading="loading" table-class="table" table-header-class="thead-light" :rows="data" :columns="columns"
            row-key="name">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn-dropdown class="custom-drop" flat rounded icon="fa-solid fa-ellipsis-vertical"
                        color="grey-7">
                        <q-list bordered>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="toDelete(props.row.id)" v-if="role == 'business'">
                                <q-item-section>
                                    <q-item-label>Eliminar</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="open(props.row?.document?.public_url)">
                                <q-item-section>
                                    <q-item-label>Ver</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-td>
            </template>
        </q-table>

        <q-dialog v-model="showAdd" persistent>
            <q-card style="min-width: 700px;">
                <q-card-section>
                    <cartage-form :tab="type_for" :modalMode="true" @close="showAdd = false"
                        @saved="showAdd = false, getData()" />
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
import { Notify } from 'quasar'
import { moment } from '../../boot/plugins'
import { useStore } from 'vuex'

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
        const store = useStore();
        const role = computed(() => {
            return store.getters.ROLE;
        });
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
                field: row => moment(row.date).format('DD/MM/YYYY'),
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
            {
                name: 'actions',
            },
        ]
        const loading = ref(false)

        async function getData() {
            loading.value = true
            try {
                const type = props.type_for ? props.type_for?.replace('s', '') : null
                const where = JSON.stringify({
                    type: type,
                    // installation_id: props.installation_id
                })
                const includes = JSON.stringify([
                    'document',
                    'installation'
                ])
                const res = await modelService.apiNoLoading({ url: `cartage-letter?wheres=${where}&includes=${includes}` })
                data.value = res.data?.data;
            } catch (err) {
                console.log('aqui', err.response);
                const message = err?.response?.data?.message ?? 'No pudimos cargar el listado';
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
            loading.value = false
        }

        function generate() {
            window.open(generateUrl.value, '_blank').focus();
        }

        function open(url) {
            window.open(url, '_blank').focus();
        }

        async function toDelete(id) {
            loading.value = true
            try {
                await modelService.apiNoLoading({ url: `cartage-letter/${id}`, method:'delete' })
                getData()
            } catch (err) {
                console.log('aqui', err.response);
                const message = err?.response?.data?.message ?? 'No pudimos eliminar el registro';
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
            loading.value = false
        }

        getData();

        return {
            data,
            columns,
            loading,
            generateUrl,
            baseUrl,
            showAdd,
            role,

            generate,
            getData,
            open,
            toDelete
        }
    }
}
</script>