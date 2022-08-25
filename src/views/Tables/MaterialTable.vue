<template>
	<div :class="`card shadow ${classes}`">
		<div
			class="card-header border-0"
			:class="type === 'dark' ? 'bg-transparent' : ''"
		>
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						{{ title }}
					</h3>
				</div>
				<div class="col text-right">
					<base-button type="default" size="sm" @click="this.modal = true"
						>Agregar</base-button
					>
				</div>
			</div>
		</div>

		<div class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row align-items-center" v-if="$store.state.is_business">
			<installation-filter
				class="col-md-3"
				v-model:clear="clear"
				@updated="handleFilter('installation', $event)"
			></installation-filter>
			<!-- <select-filter
				class="col-md-3"
				placeholder="Mercancias peligrosas"
				v-model:clear="clear"
				:options="[{label: 'Si',value:'true'},{label:'No',value:'false'}]"
				@updated="handleFilter('adr', $event)"
			/> -->
			<div class="col-md-2">
				<base-button
					size="sm"
					@click="(params_filter = params), getMaterials(page), (clear = true)"
					>Borrar filtros</base-button
				>
			</div>
		</div>
		<div class="table-responsive">
			<base-table
				class="table align-items-center table-flush"
				:class="type === 'dark' ? 'table-dark' : ''"
				:thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
				tbody-classes="list"
				:data="tableData"
			>
				<template v-slot:columns>
					<th v-if="ROLE == 'business'">Instalación</th>
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
					<td v-if="ROLE == 'business'">{{ row.item?.installation.name }}</td>
					<td>
						{{ row.item?.material.un_code }}
					</td>
					<td>{{ row.item?.name }}</td>
					<td>{{ row.item?.operation?.name }}</td>
					<td>{{ row.item?.material.denomination_name }}</td>
					<td>{{ row.item?.material.class.code }}</td>
					<td>{{ row.item?.material.packing.code }}</td>
					<td>{{ row.item?.equipment.name }}</td>
					<td>{{ row.item?.quantity }}</td>
					<td class="text-right">
						<a
							class="btn btn-primary btn-sm"
							href="#"
							@click.prevent="handleView(row.item?.id)"
							><i class="fa-regular fa-eye"></i
						></a>
                        <a
							class="btn btn-primary btn-sm"
							href="#"
							@click.prevent="handleEdit(row.item)"
							><i class="fa-solid fa-pen"></i>
                        </a>
						<a
							class="btn btn-outline-primary btn-sm"
							href="#"
							@click.prevent="destroy(row.item?.id)"
							><i class="fa-regular fa-trash-can"></i
						></a>
					</td>
				</template>
			</base-table>

			<base-pagination
				:perPage="this.metaData.perPage"
				:value="this.page"
				@changePage="handleChange($event)"
				:total="this.metaData.total"
				align="center"
			>
			</base-pagination>
		</div>

		<modal v-if="this.modal" modalClasses="modal-xl" v-model:show="this.modal" model="mercancías">
			<material-show
				@close="handleClose"
				:id="material_id"
				v-if="material_id != null"
			></material-show>
			<form-material
				v-else
                :material="material"
				@close="handleClose"
				@reload="getMaterials(page, installation_id)"
				:installation_id="installation_id"
				:residue="residue"
			></form-material>
		</modal>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex';
	import InstallationFilter from '../../components/filters/InstallationFilter.vue';
	import service from "../../store/services/model-service";
	import MaterialShow from "../Shows/MaterialShow.vue";

	export default {
		components: { MaterialShow, InstallationFilter },
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
		data() {
			return {
				material_id: null,
				tableData: [],
				metaData: {},
				page: 1,
				modal: false,
                material: null,
				params: "includes[]=material.class&includes[]=equipment&includes[]=material.packing&includes[]=documents&includes[]=installation&includes[]=operation",
				params_filter: null,
				clear: false
			};
		},
		mounted() {
			this.getMaterials(this.page, this.installation_id);
		},
		computed: {
			...mapGetters(['ROLE'])
		},
		methods: {
			async getMaterials(page = 1, id = null) {

				if (this.params_filter == null) {
					this.params_filter = this.params
				}

				let params = this.params_filter;

				if (id != null) {
					params += "&installation_id=" + id;
				}

				if (this.residue == "false") {
					params += "&is_residue=false";
				} else {
					params += "&is_residue=true";
				}

				const resp = await service.getIndex("material", page, params);

				this.tableData = resp?.data?.data;
				this.metaData = resp?.data?.meta?.page;
				this.page = this?.metaData?.currentPage;
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.getMaterials(event, this.installation_id);
			},
			handleFilter(type = 'delegate', value){
				console.log(value, type);
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=`+value
					this.getMaterials(this.page)
				}else{
					this.params_filter = this.params
					this.getMaterials(this.page)
				}
			},
			handleView(id) {
				(this.material_id = id), (this.modal = true);
			},
            handleEdit(material) {
                this.material = material;
                this.modal = true
			},
			handleClose() {
				this.modal = false;
				this.material_id = null;
                this.material = null
			},
			async destroy(id) {
				try {
					await service.destroy("material", id);
					this.getMaterials(this.page, this.installation_id);
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>
<style></style>
