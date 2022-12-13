<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Documentos</h3>
				</div>
				<slot name="button"></slot>
			</div>
		</div>

		<div class="custom-table">
			<q-table hide-pagination ref="tableRef" @request="onRequest" v-model:pagination="pagination"
				:loading="loading" table-class="table" table-header-class="thead-light" :rows="tableData"
				:columns="columns" row-key="id">
				<template v-slot:top>
					<business-filter class="col-md-3" v-model:clear="clear" @updated="filters.business_id = $event"
						v-if="!$store.state.is_business" />
					<select-filter class="col-md-3" placeholder="Tipos" v-model:clear="clear"
						:options="[{ label: 'General', value: 1 }, { label: 'Empresas', value: 2 }]"
						@updated="filters.type_id = $event" />

					<folder-filter-v-2 v-model:clear="clear" v-model="filters.folder_id" class="col-md-3" />

					<div class="col-md-2">
						<base-button size="sm" @click="clearFilters">Borrar
							filtros</base-button>
					</div>
				</template>

				<template v-slot:body-cell-name="props">
					<q-td :props="props">
						<q-img class="q-mr-md" :src="getExtIcon(props.row.extension)" spinner-color="primary"
							height="30px" width="30px" spinner-size="10px" />
						{{ `${props.row.doc_name}.${props.row.extension}` }}
					</q-td>
				</template>

				<template v-slot:body-cell-actions="props">
					<q-td>
						<q-btn-dropdown class="custom-drop" flat rounded icon="fa-solid fa-ellipsis-vertical"
							color="grey-7">
							<q-list bordered>
								<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
									@click="addFolder = true, selected_document_id = props.row.id">
									<q-item-section>
										<q-item-label>Agregar carpeta</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</q-btn-dropdown>
						<!-- <div class="flex items-center justify-center">
							<q-btn dense color="primary" class="mr-2" icon="fa-solid fa-folder-plus"
								@click="addFolder = true, selected_document_id = props.row.id">
								<q-tooltip>
									Agregar carpeta
								</q-tooltip>
							</q-btn>
							<delete-button
								v-if="$store.state.is_admin || $store.state.is_delegate || $store.state?.profile?.me?.id == props.row?.created_by?.id"
								@deleted="manualRequest" model="documents" :id="props.row.id"></delete-button>
						</div> -->
					</q-td>
				</template>


				<template v-slot:bottom class="items-center justify-center">
					<base-pagination :perPage="pagination?.rowsPerPage" :value="pagination.page"
						@changePage="manualRequest($event)" :total="pagination.rowsNumber"
						align="center"></base-pagination>
				</template>
			</q-table>
		</div>

		<document-folder-modal @update="manualRequest" v-if="addFolder" v-model="addFolder"
			:document_id="selected_document_id" />
	</div>
</template>
<script>
import BusinessFilter from '../filters/BusinessFilter.vue';
import SelectFilter from '../filters/SelectFilter.vue';
import DeleteButton from "../Utils/DeleteButton.vue";
import service from "../../store/services/model-service";
import DocumentFolderModal from '../DocumentFolder/DocumentFolderModal.vue';
import FolderFilterV2 from '../filters/FolderFilterV2.vue';
import { ref } from '@vue/reactivity';
import { forEach, isEmpty } from 'lodash';
import { watch } from '@vue/runtime-core';

export default {
	components: { DeleteButton, SelectFilter, BusinessFilter, DocumentFolderModal, FolderFilterV2 },
	name: "documents-table",
	props: ["reload"],
	setup(props, { emit }) {
		const tableData = ref([])
		const metaData = ref([])
		const page = ref(1)
		const submit = ref(false)
		const loading = ref(false)
		const clear = ref(false)
		const addFolder = ref(false)
		const filters = ref({
			folder_id: null,
			type_id: null,
			business_id: null
		})
		const pagination = ref({
			sortBy: 'desc',
			descending: false,
			page: 1,
			rowsPerPage: 15,
			rowsNumber: 10
		})
		const tableRef = ref(null)

		const selected_document_id = ref(null)
		const columns = [
			{
				name: 'name',
				label: 'Nombre',
				align: 'left',
				field: row => row.doc_name,
				format: val => `${val}.${row.extension}`,
				// sortable: true
			},
			{
				name: 'type',
				label: 'Tipo',
				align: 'left',
				field: row => row.type?.name,
				// format: val => `${val}`,
				// sortable: false
			},
			{
				name: 'business',
				label: 'Empresa',
				align: 'left',
				field: row => row.business?.user?.full_name,
				// format: val => `${val}`,
				// sortable: true
			},
			// {
			// 	name: 'extension',
			// 	label: 'Extensión',
			// 	align: 'left',
			// 	field: row => row?.extension,
			// 	// format: val => `${val}`,
			// 	// sortable: true
			// },
			{
				name: 'size',
				label: 'Tamaño',
				align: 'left',
				field: row => row?.size,
				format: val => `${val} kB`,
				// sortable: false
			},
			{
				name: 'created_date',
				label: 'Fecha',
				align: 'left',
				field: row => row?.created_date,
				// field: row => moment(row.date).format('DD/MM/YYYY'),
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'loader',
				label: 'Instalación',
				align: 'left',
				field: row => row.installation?.name,
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'created_by',
				label: 'Subido por',
				align: 'left',
				field: row => row.created_by,
				// format: val => `${val}`,
				// sortable: true
			},
			{
				name: 'actions',
			},
		]

		function getExtIcon(ext) {
			let url = `/icons/`

			if (['pdf', 'xls', 'csv'].includes(ext)) url += `${ext}.png`
			else url += 'file.png'
			return url
		}

		async function getDocuments(p = 1) {
			try {
				let url = `admin-docs?principal=1&includes[]=type&includes[]=business.user&includes[]=createdBy&includes[]=installation&page=${p}`

				forEach(filters.value, (v, k) => {
					if (v || v == 0) url += `&${k}=${v}`;
				})

				const response = await service.api({ url });
				tableData.value = response.data.data;
				metaData.value = response.data.meta.page;
				page.value = metaData.value.currentPage;
			} catch (err) {
				console.log(err);
			}
		}

		async function handleChange(event) {
			if (event != page.value) {
				manualRequest(event);
			}
		}

		function manualRequest(page = 1) {
			// if (page == pagination.value.page) return
			pagination.value.page = page
			tableRef.value.requestServerInteraction()
		}

		function clearFilters() {
			filters.value = {
				folder_id: null,
				type_id: null,
				business_id: null
			}
			clear.value = true
		}

		async function onRequest(props) {
			const { page, rowsPerPage, sortBy, descending } = props.pagination
			loading.value = true

			try {
				const take = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
				let url = `admin-docs?principal=1&with_folders=1&includes[]=type&includes[]=business.user&includes[]=createdBy&includes[]=installation&take=${take}&page=${page}`

				forEach(filters.value, (v, k) => {
					if (v || v == 0) url += `&${k}=${v}`;
				})

				const response = await service.api({ url });
				tableData.value = response.data.data
				pagination.value.page = response.data.meta?.page?.currentPage;
				pagination.value.rowsNumber = response.data?.meta?.page?.total;

				loading.value = false

			} catch (error) {
				loading.value = false
			}
		}

		watch(() => tableRef.value, (v) => {
			if (v) manualRequest()
		}, { immediate: true })

		watch(() => props.reload, (v) => {
			if (v) {
				manualRequest();
				emit("reloaded");
			}
		})

		watch(() => filters.value, (v) => {
			manualRequest()
		}, { deep: true })

		return {
			tableData,
			metaData,
			page,
			submit,
			loading,
			clear,
			addFolder,
			filters,
			selected_document_id,
			tableRef,
			columns,
			pagination,
			getExtIcon,

			onRequest,
			manualRequest,
			clearFilters,
			getDocuments,
			handleChange,
		};
	},
};
</script>
<style lang="scss">
.custom-table .q-table__bottom {
	justify-content: center;
}

.custom-table .q-table__top {
	background-color: #f6f9fc;
	color: #8898aa;
}
</style>
