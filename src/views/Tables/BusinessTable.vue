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

	export default {
		components: { FormBusiness, DeleteButton },
		name: "business-table",
		data() {
			return {
				tableData: {},
				modal: false,
				delegate: {},
				loader: false,
				metaData: {},
				page: 1,
			};
		},
		mounted() {
			this.getBusiness(this.page);
		},
		methods: {
			handleAdd() {
				this.modal = true;
			},
			handleView(id) {
				this.$router.push("/business/" + id);
			},
			async getBusiness(page) {
				const response = await service.getIndex(
					"business",
					page,
					`&includes[]=user&includes[]=installations&includes[]=administrable.user`
				);
				this.tableData = response.data.data;
				this.metaData = response.data.meta.page;
				this.page = this.metaData.currentPage;
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
