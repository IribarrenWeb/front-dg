<template>
	<div :class="`card shadow ${classes}`">
		<div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent' : ''">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						{{ title }}
					</h3>
				</div>
				<div class="col text-right">
					<base-button type="default" size="sm" @click="modal = true">Agregar</base-button>
				</div>
			</div>
		</div>

		<div class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row items-center q-col-gutter-sm filter-container">
			<installation-filter-v-2 v-model="filters.installation_id" class="col q-mb-none"
				v-if="$store.state.is_business && !installation_id" />
			<text-filter-v-2 debounce="1000" outlined dense :loading="loading" type="number" class="col q-mb-none"
				v-model="customFilters.un_code" label="UN" />
			<text-filter-v-2 debounce="1000" outlined dense :loading="loading" type="text" class="col q-mb-none"
				v-model="customFilters.name" label="Nombre" />
			<q-space class="d-none d-md-block" />
			<q-btn color="primary" label="Borrar" @click="clearFilters" />
		</div>
		<div class="table-responsive">
			<base-table class="table align-items-center table-flush" :class="type === 'dark' ? 'table-dark' : ''"
				:thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'" tbody-classes="list" :data="tableData">
				<template v-slot:columns>
					<th v-if="role == 'business'">Instalación</th>
					<th>UN</th>
					<th>Nombre</th>
					<th>Operación</th>
					<th>Denominación</th>
					<th>Clase</th>
					<th>GE</th>
					<th>Depósito</th>
					<th>Cantidad</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<td v-if="role == 'business'">{{ row.item?.installation.name }}</td>
					<td>
						{{ row.item?.material?.un_code ?? 'MQ' }}
					</td>
					<td>{{ row.item?.name }}</td>
					<td>{{ row.item?.operation?.name }}</td>
					<td>
						<span class="truncate-250">
							{{ row.item?.material?.denomination_name ?? 'MQ' }}
						</span>
						<q-tooltip v-if="row.item?.material?.denomination_name">
							{{ row.item?.material.denomination_name }}
						</q-tooltip>
					</td>
					<td>{{ row.item?.material?.class?.code }}</td>
					<td>{{ row.item?.material?.packing?.code }}</td>
					<td>{{ row.item?.equipment.name }}</td>
					<td>{{ row.item?.quantity }}</td>
					<td class="text-right">
						<q-btn color="primary" @click="clone(row.item?.id)" class="q-mr-sm" flat dense
							icon="fa-regular fa-clone">
							<q-tooltip>
								Clonar registro
							</q-tooltip>
						</q-btn>
						<a class="btn btn-primary btn-sm" href="#" @click.prevent="handleView(row.item?.id)"><i
								class="fa-regular fa-eye"></i></a>
						<a class="btn btn-primary btn-sm" href="#" @click.prevent="handleEdit(row.item)"><i
								class="fa-solid fa-pen"></i>
						</a>
						<a class="btn btn-outline-primary btn-sm" href="#" @click.prevent="destroy(row.item?.id)"><i
								class="fa-regular fa-trash-can"></i></a>
					</td>
				</template>
			</base-table>

			<base-pagination :perPage="metaData?.perPage" :value="page" @changePage="handleChange($event)"
				:total="metaData.total" align="center">
			</base-pagination>
		</div>

		<q-dialog v-model="modal" persistent full-width>
			<q-card class="q-pa-lg full-width">
				<q-card-section>
					<material-show @close="handleClose" :id="material_id" v-if="material_id != null"></material-show>
					<form-material class="pb-5" v-else :material="material" @close="handleClose"
						@reload="getMaterials(page, installation_id)" :installation_id="installation_id"
						:residue="residue">
					</form-material>
				</q-card-section>
			</q-card>
		</q-dialog>
	</div>
</template>
<script>
import { useStore } from 'vuex';
import InstallationFilter from '../filters/InstallationFilter.vue';
import service from "../../store/services/model-service";
import MaterialShow from "./MaterialShow.vue";
import { Notify } from 'quasar'
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { forEach, isEmpty, keys } from 'lodash';
import { swal } from '../../boot/plugins';
import InstallationFilterV2 from '../filters/InstallationFilterV2.vue';
import TextFilterV2 from '../filters/TextFilterV2.vue';

export default {
	components: { MaterialShow, InstallationFilter, InstallationFilterV2, TextFilterV2 },
	name: "material-table",
	props: {
		type: {
			type: String,
		},
		installation_id: {
			required: false,
			default: null,
		},
		residue: {
			type: String,
			default: "false",
		},
		title: {
			type: String,
			default: "Mercancías ADR",
		},
		classes: {
			type: String,
		},
		installations: {
			type: Object,
			required: false,
			default: null
		}
	},
	setup(props) {
		const store = useStore();
		const role = computed(() => {
			return store.getters.role;
		});
		const material_id = ref(null)
		const tableData = ref([])
		const metaData = ref({})
		const page = ref(1)
		const modal = ref(false)
		const material = ref(null)
		const clear = ref(false)
		const loading = ref(false)
		const filters = ref({
			installation_id: null,
			business_id: null,
			is_residue: null,
			name: null,
		})
		const customFilters = ref({
			un_code: null,
			name: null,
		})

		async function getMaterials(num_page = 1) {

			const includes = JSON.stringify([
				'material.class',
				'equipment',
				'material.packing',
				'documents',
				'installation',
				'operation',
			])

			if (props.installation_id) {
				filters.value.installation_id = props.installation_id
			}

			if (props.residue == "false") {
				filters.value.is_residue = 0
			} else {
				filters.value.is_residue = 1
			}

			let dataFilters = [];

			forEach(filters.value, (v, k) => {
				if (v || v == 0) dataFilters[k] = v;
			})

			let where = JSON.stringify({
				...dataFilters
				// installation_id: props.installation_id
			})

			let url = `materials?page=${num_page}&wheres=${where}&includes_json=${includes}`

			forEach(customFilters.value, (v, k) => {
				if (v || v == 0) url += `&${k}=${v}`;
			})

			loading.value = true

			// const resp = await service.getIndex("material", num_page, params);
			const res = await service.apiNoLoading({ url })

			loading.value = false
			tableData.value = res?.data?.data;
			metaData.value = res?.data?.meta?.page;
			page.value = metaData.value?.currentPage;
		}

		async function handleChange(event) {
			if (event == page.value) {
				return;
			}
			getMaterials(event);
		}

		function clearFilters() {
			filters.value = {
				installation_id: null,
				business_id: null,
				cartage_destinatary_id: null,
				cartage_carrier_id: null
			}
			customFilters.value = {
				un_code: null,
				name: null,
			}
		}

		function handleFilter(type = 'delegate', value) {
			console.log(value, type);
			if (!isEmpty(value) || value >= 1) {
				params_filter.value += `&${type}_id=` + value
				getMaterials(page.value)
			} else {
				params_filter.value = params.value
				getMaterials(page.value)
			}
		}

		function handleView(id) {
			material_id.value = id
			modal.value = true;
		}

		function handleEdit(data) {
			material.value = data;
			modal.value = true
		}

		function handleClose() {
			modal.value = false;
			material_id.value = null;
			material.value = null
		}

		async function destroy(id) {
			try {
				await service.destroy("material", id);
				getMaterials(page.value, props.installation_id);
			} catch (error) {
				console.log(error);
			}
		}

		async function clone(id) {
			const result = await new swal({
				title: "¿Estas seguro de clonar este registro?",
				icon: "question",
				text: "Este registro se va a clonar.",
				showCancelButton: true,
				confirmButtonText: "Clonar",
				// customClass: {
				// 	confirmButton: "btn btn-primary",
				// 	cancelButton: "btn btn-outline-primary",
				// },
			}).then(async (result) => {
				if (result.isConfirmed) {
					return true;
				} else {
					return false;
				}
			});
			if (result) {
				try {
					await service.api({ url: "materials/clone/" + id });
					getMaterials()
				} catch (err) {
					Notify.create({
						message: 'No se pudo clonar el registro',
						color: 'negative'
					})
				}
			}
		}

		getMaterials()

		watch(() => filters.value, (v) => getMaterials(), { deep: true })
		watch(() => customFilters.value, (v) => getMaterials(), { deep: true })

		return {
			material_id,
			tableData,
			metaData,
			page,
			modal,
			material,
			clear,
			role,
			filters,
			customFilters,
			loading,

			getMaterials,
			handleChange,
			handleFilter,
			handleView,
			handleEdit,
			handleClose,
			destroy,
			clearFilters,
			clone,
		};
	},
};
</script>
<style>

</style>
