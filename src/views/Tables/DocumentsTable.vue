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

		<div class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row align-items-center">
			<business-filter 
				class="col-md-3"
				v-model:clear="clear"
				@updated="handleFilter('business_id', $event)"
				v-if="!$store.state.is_business"
			/>
			<select-filter
				class="col-md-3"
				placeholder="Tipos"
				v-model:clear="clear"
				:options="[{label: 'General',value:1},{label:'Empresas',value:2}]"
				@updated="handleFilter('type_id', $event)"
			/>
			<div class="col-md-2">
				<base-button
					size="sm"
					@click="(params_filter = params), getDocuments(page), (clear = true)"
					>Borrar filtros</base-button
				>
			</div>
		</div>
		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Tipo</th>
					<th>Empresa</th>
					<th>Extension</th>
					<th>Tamaño</th>
					<th>Fecha</th>
					<th>Subido por</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						<a :href="row.item.link" target="_blank">{{
							row.item?.doc_name
						}}</a>
					</th>
					<td>
						{{ row.item?.type?.name }}
					</td>
					<td>
						{{ row.item?.business?.user?.full_name }}
					</td>
					<td>
						{{ row.item?.extension }}
					</td>
					<td>{{ row.item?.size }} kB</td>
					<td>
						{{ row.item?.created_date }}
					</td>
					<td>
						{{ row.item?.created_by?.full_name }}
					</td>
					<td class="d-flex">
						<!-- <a
							href="#"
							@click.prevent="handleView(row.item?.id)"
							class="btn btn-sm btn-default"
							><i class="fa-regular fa-eye"></i
						></a> -->
						<delete-button
							v-if="$store.state.is_admin || $store.state.is_delegate || $store.state?.profile?.me?.id == row.item?.created_by?.id"
							@deleted="getDocuments"
							model="documents"
							:id="row.item.id"
						></delete-button>
					</td>
				</template>
			</base-table>
			<div v-if="tableData.length >= 1">
				<base-pagination
					:perPage="this.metaData.perPage"
					:value="this.page"
					@changePage="handleChange($event)"
					:total="this.metaData.total"
					align="center"
				></base-pagination>
			</div>
			<loader v-if="loader"></loader>
		</div>
	</div>
</template>
<script>
	import BusinessFilter from '../../components/filters/BusinessFilter.vue';
	import SelectFilter from '../../components/filters/SelectFilter.vue';
	import DeleteButton from "../../components/Utils/DeleteButton.vue";
	import service from "../../store/services/model-service";
	export default {
		components: { DeleteButton, SelectFilter, BusinessFilter },
		name: "documents-table",
		props: ["reload"],
		data() {
			return {
				tableData: {},
				metaData: {},
				page: 1,
				submit: false,
				loader: false,
				action: "Registrar",
				params: 'includes[]=type&includes[]=business.user&includes[]=createdBy',
				params_filter: null,
				clear: false
			};
		},
		mounted() {
			this.getDocuments(this.page);
		},
		methods: {
			async getDocuments(page = 1) {
				if (this.params_filter == null) {
					this.params_filter = this.params
				}
				try {
					const response = await service.getIndex("documents", page,this.params_filter);
					this.tableData = response.data.data;
					this.metaData = response.data.meta.page;
					this.page = this.metaData.currentPage;
				} catch (err) {
					console.log(err);
				}
			},
			async handleChange(event) {
				if (event != this.page) {
					this.getDocuments(event);
				}
			},
			handleFilter(type = 'delegate_id', value){
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}=`+value
					this.getDocuments(this.page)
				}else{
					this.params_filter = this.params
					this.getDocuments(this.page)
				}
			},
		},
		watch: {
			modal(newVal) {
				if (!newVal) {
					this.action = "Registrar";
				}
			},
			reload(val) {
				if (val) {
					this.getDocuments(this.page);
					this.$emit("reloaded");
				}
			},
		},
	};
</script>
<style></style>
