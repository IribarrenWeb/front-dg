<template>
    <div>
        <table-header :title="type_for">
            <q-btn v-if="type_for != 'carretera' && role == 'business'" outline color="primary" label="Generar"
                @click="generate" />
            <q-btn v-if="role == 'business'" color="primary" label="Agregar" @click="showAdd = true" />
        </table-header>
        <q-table :visible-columns="visibleColumns" :loading="loading" table-class="table" table-header-class="thead-light" :rows="data" :columns="columns"
            row-key="id">
            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <q-badge class="text-capitalize" rounded :color="getStatusColor(props.row.status)" v-if="props.row.status" :label="role != 'business' && props.row.status == 'EN REVISION' ? 'PENDIENTE' : props.row.status" />
                </q-td>
            </template>
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
                                @click="toReview(props.row.id)" v-if="role == 'business' && !props.row.review && type_for != 'carretera'">
                                <q-item-section>
                                    <q-item-label>{{ reviewText }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="toReviewDetail(props.row.id)" v-if="props.row.review && type_for != 'carretera'">
                                <q-item-section>
                                    <q-item-label>{{role != 'business' ? reviewText : 'Detalle revisión'}}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="open(props.row?.document?.public_url)" v-if="type_for != 'carretera'">
                                <q-item-section>
                                    <q-item-label>Ver</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item disable style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="openRoad()" v-else>
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
            <q-card :style="{'min-width': type_for == 'carretera' ? '80vw' :'60vw'}">
                <q-card-section>
                    <cartage-form :tab="type_for" :modalMode="true" @close="showAdd = false"
                        @saved="showAdd = false, getData()" />
                </q-card-section>
            </q-card>
        </q-dialog>

        <cartage-review v-if="showDetail" @reload="getData()" :cartage_review_id="cartage_review_id" v-model="showDetail"/>
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
import CartageReview from './CartageReview.vue'

export default {
    components: { TableHeader, CartageForm, CartageReview },
    props: {
        type_for: {
            type: String,
            default: 'maritimas'
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
        const showDetail = ref(false)
        const cartage_review_id = ref(null)
        const prefix_review_text = computed(() => role.value == 'business' ? 'Asesor' : 'Revisión')
        const reviewText = computed(() => props.type_for == 'maritimas' ? prefix_review_text.value + ' IMO' : prefix_review_text.value + ' IATA')
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
                name: 'installation',
                label: 'Instalación',
                align: 'left',
                field: row => row.installation.name,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'business',
                label: 'Empresa',
                align: 'left',
                field: row => row?.business?.user?.full_name,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'destinatary',
                label: 'Destinatario',
                align: 'left',
                field: row => row?.destinatary?.name,
                // format: val => `${val}`,
                sortable: false
            },
            {
                name: 'carrier',
                label: 'Transportista',
                align: 'left',
                field: row => row?.carrier?.name,
                // format: val => `${val}`,
                sortable: false
            },
            {
                name: 'loader',
                label: 'Cargador',
                align: 'left',
                field: row => row.same_loader ? row?.business?.user?.full_name : row?.loader?.name,
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
                name: 'materials_count',
                label: 'Materiales involucrados',
                align: 'center',
                field: row => row?.materials_count ?? 0,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'status',
                label: 'Estado',
                align: 'left',
                field: row => row.status,
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'actions',
            },
        ]
        const visibleColumns = computed(() => {
            const all = [
                'name',
                'description',
                'installation',
                'business',
                'destinatary',
                'carrier',
                'loader',
                'date',
                'status',
                'materials_count',
                'actions'
            ]
            let visible = [];
            if (role.value == 'business') {
                visible = all.filter(a => !['business'].includes(a))
            }else{
                visible = all
            }

            if (props.type_for == 'carretera') {
                visible = visible.filter(a => !['description','date','status'].includes(a))
            }else{
                visible = visible.filter(a => !['destinatary','carrier','loader','materials_count'].includes(a))
            }
            return visible;
        })
        const loading = ref(false)

        function getStatusColor(status) {
            let color = null;
            switch (status.toLowerCase()) {
                case 'en revision':
                    color = 'yellow-10'
                    break;
                case 'pendiente':
                    color = 'yellow-10'
                    break;
                case 'rechazada':
                    color = 'red-10'
                    break;
                case 'aprobada':
                    color = 'green-10'
                    break;

                default:
                    color = 'primary'
                    break;
            }
            return color;
        }

        async function getData() {
            loading.value = true
            try {
                const type = props.type_for ? props.type_for?.replace('s', '') : null
                const where = JSON.stringify({
                    type: type,
                    // installation_id: props.installation_id
                })
                const includes_count = JSON.stringify([
                    'materials',
                ])
                const includes = JSON.stringify([
                    'document',
                    'installation',
                    'business.user',
                    'review',
                    'destinatary',
                    'loader',
                    'carrier'
                ])
                const res = await modelService.apiNoLoading({ url: `cartage-letter?wheres=${where}&includes=${includes}&includes_count=${includes_count}` })
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

        function toReviewDetail(id = null) {
            showDetail.value = true
            cartage_review_id.value = id
        }

        function open(url) {
            window.open(url, '_blank').focus();
        }

        async function toDelete(id) {
            loading.value = true
            try {
                await modelService.apiNoLoading({ url: `cartage-letter/${id}`, method: 'delete' })
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

        async function toReview(id) {
            loading.value = true
            try {
                const data = {
                    cartage_letter_id: id,
                }

                await modelService.apiNoLoading({ url: `cartage-review`, method: 'post', data })

                getData()
            } catch (err) {
                console.log('aqui', err?.response);
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
            reviewText,
            showDetail,
            cartage_review_id,
            visibleColumns,

            getStatusColor,
            generate,
            getData,
            open,
            toDelete,
            toReview,
            toReviewDetail
        }
    }
}
</script>