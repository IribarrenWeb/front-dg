<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Empresas</h3>
				</div>
				<div class="col text-right">
					<a
						href="#"
						@click.prevent="handleAdd()"
						class="btn btn-sm btn-default"
						>Agregar</a
					>
				</div>
			</div>
		</div>
		<div></div>
		<div class="table-responsive">
			<div class="card-header border-0 pl-2 py-3 bac-ligth d-flex align-items-center">
				<delegate-filter v-model:clear="clear" @updated="handleFilter('delegate',$event)" v-if="$store.state.is_admin"></delegate-filter>
				<city-filter v-model:clear="clear" @updated="handleFilter('city',$event)"></city-filter>
				<div>
					<base-button size="sm" @click="params_filter = params,getBusiness(),clear = true">Borrar filtros</base-button>
				</div>
			</div>
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Ciudad</th>
					<th>Instalaciones</th>
					<th></th>
					<th>Delegación</th>
					<th>Acciones</th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.user.full_name }}
					</th>
					<td class="text-uppercase">{{row.item?.address?.city}}</td>
					<td>
						{{ row.item?.installations.length }}
					</td>
					<td>
						<span
							v-for="installation in row.item?.installations"
							:key="installation.key"
						>
							{{ installation.name }},
						</span>
					</td>
					<td>
						{{ row.item?.administrable?.user?.full_name }}
					</td>
					<td class="d-flex">
						<router-link
							:to="`/business/${row.item?.id}`"
							class="btn btn-sm btn-default"
							><i class="fa-regular fa-eye"></i></router-link
						>
						<delete-button model="business" :id="row.item?.id" @deleted="getBusiness"></delete-button>
					</td>
				</template>
			</base-table>
			<div>
				<base-pagination
					v-if="metaData"
					:perPage="this.metaData.perPage"
					:value="this.page"
					@changePage="handleChange($event)"
					:total="this.metaData.total"
					align="center"
				></base-pagination>
			</div>

			<modal
				v-if="this.modal"
				v-model:show="this.modal"
				modalClasses="modal-xl"
				model="Empresa"
			>
				<form-business
					v-if="this.modal"
					@close="this.modal = false"
					@reload="getBusiness()"
				/>
			</modal>
		</div>
	</div>
</template>
<script>
	import FormBusiness from "../../components/forms/Business/FormBusiness.vue";
	import service from "../../store/services/model-service";
	import DeleteButton from "../../components/Utils/DeleteButton.vue";
	import DelegateFilter from "../../components/filters/DelegateFilter.vue";
	import CityFilter from "../../components/filters/CityFilter.vue";

	export default {
		components: { FormBusiness, DeleteButton, DelegateFilter, CityFilter },
		name: "business-table",
		data() {
			return {
				tableData: {},
				modal: false,
				delegate: {},
				loader: false,
				metaData: {},
				clear: false,
				page: 1,
				params: `&includes[]=user&includes[]=installations&includes[]=administrable.user`,
				params_filter: null,
			};
		},
		mounted() {
			this.params_filter = this.params
			this.getBusiness(this.page);
		},
		methods: {
			handleAdd() {
				this.modal = true;
			},
			handleView(id) {
				this.$router.push("/business/" + id);
			},
			handleFilter(type = 'delegate', value){
				console.log(value, type);
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=`+value
					this.getBusiness(null)
				}else{
					this.params_filter = this.params
					this.getBusiness(null)
				}
			},
			async getBusiness(page) {
				const response = await service.getIndex(
					"business",
					page,
					this.params_filter
				);
				this.tableData = response.data.data;
				this.metaData = response.data?.meta?.page;
				this.page = this.metaData?.currentPage;
			},
			async handleChange(event) {
				if (this.page == event) {
					return;
				}
				this.getBusiness(event);
			},
			async destroy(id) {
				try {
					await service.destroy(id);
					this.getBusiness();
				} catch (err) {
					console.log(err.response);
				}
			},
		},
	};
</script>
<style>
	.max-h-modal {
		max-height: 850px;
	}
	
</style>
