<template>
	<div class="card mt-3">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Instalaciones</h4>
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
					<th>Direccion</th>
					<th>Provincia</th>
					<th>Empleados</th>
					<th>Auditor</th>
					<th>Acciones</th>
				</template>

				<template v-slot:default="row">
					<th scope="row" class="text-capitalize">
						{{ row.item.name }}
					</th>
					<td class="text-uppercase">
						{{ row.item.address }}
					</td>
					<td class="text-uppercase">
						{{ row.item.province.name }}
					</td>
					<td>
						{{ row.item.employees.length }}
					</td>
					<td class="text-uppercase">
						<a v-if="row.item.auditable != null" href="#" @click="showAuditor()"
							>{{ row.item.auditable.user.name }}
							{{ row.item.auditable.user.last_name }}</a
						>
                        <span v-else>SIN AUDITOR</span>
					</td>
					<td>
						<a
							href="#"
							@click.prevent="view(row.item.id)"
							class="btn btn-sm btn-default"
							><i class="fa-regular fa-eye"></i></a
						>
						<a
							href="#"
							@click.prevent="destroy(row.item.id)"
							class="btn btn-sm btn-outline-default"
							><i class="fa-regular fa-trash-can"></i></a
						>
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
			<loader v-if="loader"></loader>

			<modal
				v-if="this.modal"
				v-model:show="this.modal"
				:action="action"
				@close="action = 'registrar'"
				modalClasses="modal-xl"
				model="instalación"
			>
				<form-installation
					v-if="!isView"
					@close="this.modal = false"
					@reload="getInstallations()"
					:business_id="business_id"
				></form-installation>
				<installation-show
					v-else
					:installation_id="installation_id"
					@close="(this.modal = false), (this.isView = false)"
				></installation-show>
			</modal>
		</div>
	</div>
</template>
<script>
	import FormInstallation from "../../components/forms/Installation/FormInstallation.vue";
	import service from "../../store/services/model-service";
	import InstallationShow from "../Shows/InstallationShow.vue";
	export default {
		components: { FormInstallation, InstallationShow },
		name: "installation-table",
		props: {
			business_id: {},
		},
		data() {
			return {
				tableData: {},
				modal: false,
				delegate: {},
				metaData: {},
				page: 1,
				isView: false,
				action: "Registrar",
				installation_id: {},
			};
		},
		mounted() {
			this.getInstallations();
		},
		methods: {
			handleAdd() {
				this.modal = true;
			},
			async getInstallations() {
				const response = await service.instByBusiness(
					this.business_id,
					this.page
				);
				this.tableData = response.data.data;
				this.metaData = response.data.meta.page;
				this.page = this.metaData.currentPage;
			},
			async destroy(id) {
				try {
					await service.destroy("installation", id);
					this.getInstallations();
				} catch (error) {
					console.log(error);
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}

				const response = await service.instByBusiness(this.business_id, event);
				this.tableData = response.data.data;
				this.metaData = response.data.meta.page;
				this.page = this.metaData.currentPage;
			},
			async view(id) {
				try {
					this.isView = true;
					this.modal = true;
					this.action = "editar";
					this.installation_id = id;
				} catch (err) {
					console.log(err);
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
