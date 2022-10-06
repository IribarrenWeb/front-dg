<template>
	<div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
		<div
			class="card-header border-0"
			:class="type === 'dark' ? 'bg-transparent' : ''"
		>
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						Subcontratistas
					</h3>
				</div>
				<div class="col text-right">
                    <base-button type="default" size="sm" :href="url+'uploads/checklist.pdf'" tag="a" :outline="true"
						><i class="fa-solid fa-list-check"></i>Checklist</base-button
					>
					<base-button type="default" size="sm" :href="url+'uploads/control.pdf'" tag="a" :outline="true"
						><i class="fa-solid fa-list-check"></i>Control proveedores</base-button
					>
					<base-button type="default" size="sm" @click="this.modal = true"
						>Agregar</base-button
					>
				</div>
			</div>
		</div>

		<div class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row align-items-center filter-container" v-if="false">
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
					@click="(params_filter = params), getSubcontractors(page), (clear = true)"
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
					<th>Empresa</th>
					<th>CIF</th>
					<th>Email</th>
					<th>Teléfono</th>
					<th>Servicio</th>
					<th>Nombre</th>
					<th>Apellido</th>
					<th>Fecha checklist</th>
					<th></th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.business }}
					</th>
					<td>{{ row.item?.dni }}</td>
					<td>{{ row.item?.email }}</td>
					<td>
						{{ row.item?.phone_number }}
					</td>
					<th scope="row">
						{{ row.item?.service }}
					</th>
					<td class="budget">{{ row.item?.name }}</td>
                    <td class="budget">
                        {{ row.item?.last_name }}
                    </td>
					<td>{{ row.item?.documents[0]?.document_date }}</td>
					<td>
						<a v-if="!$functions.empty(row.item?.documents)" href="#" @click.prevent="getDocument(row.item?.documents[0].id)">
							{{row.item?.documents[0].name_document ?? 'DOCUMENTACION'}}
						</a>
						<span v-else>
							SIN DOCUMENTACIÓN
						</span>
					</td>
					<td class="text-right">
						<a
							class="btn btn-primary btn-sm"
							href="#"
							@click.prevent="modal = true, sub = row.item"
							><i class="fa-regular fa-eye"></i></a
						>
						<a
							class="btn btn-outline-primary btn-sm"
							href="#"
							@click.prevent="destroy(row.item?.id)"
							><i class="fa-regular fa-trash-can"></i></a
						>
					</td>
				</template>
			</base-table>
			<loader v-if="loader"></loader>

			<base-pagination
				:perPage="this.metaData.perPage"
				:value="this.page"
				@changePage="handleChange($event)"
				:total="this.metaData.total"
				align="center"
			>
			</base-pagination>
		</div>

		<modal
			v-if="this.modal"
			v-model:show="this.modal"
			modalClasses="modal-xxl"
			model="subcontratistas"
		>
			<form-subcontractor
				@close="modal = false, sub = null"
				:subcontractor="sub"
				@reload="getSubcontractors(page)"
				:installation_id="installation_id"
			></form-subcontractor>
		</modal>
	</div>
</template>
<script>
	import FormSubcontractor from "./FormSubcontractor.vue";
	import service from "../../store/services/model-service";
	import utils from "@/mixins/utils-mixin";

	export default {
		components: { FormSubcontractor },
		mixins: [utils],
		name: "subcontractor-table",
		props: {
			type: {
				type: String,
			},
			title: String,
			installation_id: {
				required: true,
				default: null,
			}
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				loader: false,
				page: 1,
				modal: false,
				url: process.env.VUE_APP_API_URL,
				sub: null,
				params: "includes[]=documents",
				params_filter: null,
				clear: false
			};
		},
		mounted() {
			this.getSubcontractors(this.page);
		},
		methods: {
			async getSubcontractors(page) {
				if (this.params_filter == null) {
					this.params_filter = this.params
				}

				let params = this.params_filter;

				if (this.installation_id != null) {
					params += "&installation_id=" + this.installation_id;
				}

				const resp = await service.getIndex("subcontractor", page, params);

				this.tableData = resp?.data?.data;
				this.metaData = resp?.data?.meta?.page;
				this.page = this?.metaData?.currentPage;
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.getSubcontractors(event, this.installation_id);
			},
			handleFilter(type = 'delegate', value){
				console.log(value, type);
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=`+value
					this.getSubcontractors(this.page)
				}else{
					this.params_filter = this.params
					this.getSubcontractors(this.page)
				}
			},
			async destroy(id) {
				try {
					await service.destroy("subcontractor", id).then(() => {
						this.getSubcontractors();
					});
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>
<style></style>
