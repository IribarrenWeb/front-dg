<template>
    <div class="custom-table">
        <table-header :title="type_for">
            <q-btn v-if="type_for != 'carretera' && role == 'business'" outline color="primary" label="Generar"
                @click="generate" />
            <q-btn v-if="role == 'business'" color="primary" label="Agregar" @click="showAdd = true" />
            <q-btn v-if="(role == 'business' && type_for == 'carretera')" color="primary" label="Registros C/D/T"
                @click="showRecords = true" />
        </table-header>
        <q-table :visible-columns="visibleColumns" :loading="loading" table-class="table"
            table-header-class="thead-light" :rows="data" :columns="columns" row-key="id">
            <template v-slot:top>
                <!-- <div class="row"> -->
                <installation-filter-v-2 v-model="filters.installation_id" class="col q-mb-none" />
                <business-filter-v-2 v-if="role != 'business'" v-model="filters.business_id" class="col q-mb-none" />
                <cargate-filter-v-2 v-if="type_for == 'carretera'" label="Destinatario"
                    v-model="filters.cartage_destinatary_id" class="col q-mb-none" />
                <!-- </div> -->
                <q-space class="d-none d-md-block" />
                <q-btn color="primary" label="Limpiar" @click="clearFilters" />
                <!-- <q-input borderless dense debounce="300" color="primary" v-model="filter">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input> -->
            </template>
            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <q-badge class="text-capitalize" rounded :color="getStatusColor(props.row.status)"
                        v-if="props.row.status"
                        :label="role != 'business' && props.row.status == 'EN REVISION' ? 'PENDIENTE' : props.row.status" />
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
                                @click="toReview(props.row.id)" v-if="role == 'business' && !props.row.review">
                                <q-item-section>
                                    <q-item-label>{{ type_for == 'carretera' ? 'Solicitar revisión' : reviewText
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="toReviewDetail(props.row.id)">
                                <q-item-section>
                                    <!-- <q-item-label>{{ role != 'business' ? type_for == 'carretera' ? 'Revisión' :
                                            reviewText : 'Detalle revisión'
                                    }}
                                    </q-item-label> -->

                                    <q-item-label>Detalle</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="open(props.row?.document?.public_url)" v-if="props.row?.document?.public_url">
                                <q-item-section>
                                    <q-item-label>Ver documento</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="handleClone(props.row)" v-if="(role == 'business' && type_for == 'carretera')">
                                <q-item-section>
                                    <q-item-label>Clonar</q-item-label>
                                </q-item-section>
                            </q-item>
                            <!-- <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="toLoadDocument(props.row?.id)"
                                v-if="role == 'business' && !props.row?.document?.public_url && type_for == 'carretera'">
                                <q-item-section>
                                    <q-item-label>Cargar documento</q-item-label>
                                </q-item-section>
                            </q-item> -->
                            <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
                                @click="generateRoad(props.row?.print_url)"
                                v-if="role == 'business' && type_for == 'carretera'">
                                <q-item-section>
                                    <q-item-label>Generar PDF</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-td>
            </template>
        </q-table>

        <q-dialog v-model="showAdd" persistent>
            <q-card :style="{ 'min-width': type_for == 'carretera' ? '80vw' : '60vw' }">
                <q-card-section>
                    <cartage-form :cloneId="cloneId" :tab="type_for" :modalMode="true" @close="showAdd = false, cloneId = null"
                        @saved="showAdd = false, cloneId = null, getData()" />
                </q-card-section>
            </q-card>
        </q-dialog>

        <cartage-review v-if="showDetail" @reload="getData()" :cartage_review_id="cartage_review_id"
            v-model="showDetail" />

        <cartage-road-document-form v-if="showDocumentRoad" v-model:show="showDocumentRoad"
            :cartage_id="cartage_letter_id" @reload="cartage_letter_id = null, getData()" />

        <cartage-records-modal v-if="showRecords" v-model="showRecords" />
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import TableHeader from '../Utils/TableHeader.vue'
import { baseUrl } from '../../axios'
import { computed, watch } from '@vue/runtime-core'
import CartageForm from './CartageForm.vue'
import { Notify } from 'quasar'
import { moment } from '../../boot/plugins'
import { useStore } from 'vuex'
import CartageReview from './CartageReview.vue'
import functions from '../../utils/functions'
import CartageRoadDocumentForm from './Forms/CartageRoadDocumentForm.vue'
import CartageRecordsModal from './CartageRecordsModal.vue'
import InstallationFilterV2 from '../filters/InstallationFilterV2.vue'
import { forEach, map } from 'lodash'
import CargateFilterV2 from '../filters/CargateFilterV2.vue'
import BusinessFilterV2 from '../filters/BusinessFilterV2.vue'

export default {
    components: { TableHeader, CartageForm, CartageReview, CartageRoadDocumentForm, CartageRecordsModal, InstallationFilterV2, CargateFilterV2, BusinessFilterV2 },
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
        const showRecords = ref(false)
        const showDocumentRoad = ref(false)
        const cartage_review_id = ref(null)
        const cartage_letter_id = ref(null)
        const document_review = ref({})
        const filters = ref({
            installation_id: null,
            business_id: null,
            cartage_destinatary_id: null,
            cartage_carrier_id: null
        })
        const cloneId = ref(null)
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
                field: row => row?.destinatary?.business_name,
                // format: val => `${val}`,
                sortable: false
            },
            {
                name: 'carrier',
                label: 'Transportista',
                align: 'left',
                field: row => row?.carrier?.business_name,
                // format: val => `${val}`,
                sortable: false
            },
            {
                name: 'loader',
                label: 'Cargador',
                align: 'left',
                field: row => row.same_loader ? row?.business?.user?.full_name : row?.loader?.business_name,
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
                name: 'created',
                label: 'Fecha de creación',
                align: 'left',
                field: row => moment(row.created_at).format('DD/MM/YYYY h:mm a'),
                // format: val => `${val}`,
                sortable: true
            },
            {
                name: 'materials_count',
                label: 'Mercancías peligrosas',
                align: 'center',
                field: row => (row?.materials.map(m => m.name)).join(', ') ?? '',
                // field: row => row?.materials_count ?? 0,
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
                'actions',
                'created'
            ]
            let visible = [];
            if (role.value == 'business') {
                visible = all.filter(a => !['business'].includes(a))
            } else {
                visible = all
            }

            if (props.type_for == 'carretera') {
                visible = visible.filter(a => !['description', 'date'].includes(a))
            } else {
                visible = visible.filter(a => !['destinatary', 'carrier', 'loader', 'materials_count', 'created'].includes(a))
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

        function handleClone(cartage) {
            cloneId.value = cartage?.id
            showAdd.value = true
        }

        async function getData() {
            loading.value = true
            try {
                const type = props.type_for ? props.type_for?.replace('s', '') : null

                let dataFilters = [];

                forEach(filters.value, (v, k) => {
                    if (v) dataFilters[k] = v;
                })
                const where = JSON.stringify({
                    type: type,
                    ...dataFilters
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
                    'carrier',
                    'materials'
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

        async function generateRoad(url) {
            try {
                const rep = await modelService.api({ url });
                const b64 = rep.data.data;
                const fileUrl = await functions.formatDoc(b64);
                window.open(fileUrl);
            } catch (err) {
                console.error(err);
                Notify.create({
                    message: 'Ocurrio un error al generar el pdf',
                    color: 'negative'
                })
            }
        }

        function toReviewDetail(id = null) {
            showDetail.value = true
            cartage_review_id.value = id
        }

        function toLoadDocument(id) {
            showDocumentRoad.value = true
            cartage_letter_id.value = id
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

        function clearFilters() {
            filters.value = {
                installation_id: null,
                business_id: null,
                cartage_destinatary_id: null,
                cartage_carrier_id: null
            }
        }

        async function toReview(id, isRoad = false) {
            loading.value = true
            try {
                let data = new FormData();
                data.append('cartage_letter_id', id)
                if (document_review.value && isRoad) data.append('document', document_review.value)
                else if (isRoad) {
                    Notify.create({
                        message: 'El documento es requerido',
                        color: 'negative'
                    })
                    return
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

        watch(() => filters.value, (v) => getData(), { deep: true })

        return {
            data,
            columns,
            loading,
            showRecords,
            generateUrl,
            baseUrl,
            showAdd,
            role,
            reviewText,
            showDetail,
            cartage_review_id,
            visibleColumns,
            document_review,
            cartage_letter_id,
            showDocumentRoad,
            filters,
            cloneId,

            clearFilters,
            handleClone,
            toLoadDocument,
            generateRoad,
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

<style lang="scss">
.custom-table .q-table__top {
    background-color: #f6f9fc;
    color: #8898aa;
}
</style>