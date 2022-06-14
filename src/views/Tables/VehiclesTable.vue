<template>
	<div :class="`card shadow ${classes}`">
		<div
			class="card-header border-0"
			:class="type === 'dark' ? 'bg-transparent' : ''"
		>
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						Vehiculos
					</h3>
				</div>
				<div class="col text-right">
					<base-button type="default" size="sm" @click="handleAdd"
						>Agregar</base-button
					>
				</div>
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
					<th>Matricula</th>
					<th>Flota</th>
					<th>Tara</th>
					<th>MMA</th>
					<th>Tipo</th>
					<th>Designacion ADR</th>
					<th>Fecha Instalación KIT ADR</th>
					<th>Estado</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.registration_number }}
					</th>
					<td class="budget">
						{{ row.item.fleet }}
					</td>
					<td>
						{{ row.item.tara }}
					</td>
					<td>{{ row.item.mma }}</td>
					<td>{{ row.item.type.name }}</td>
					<td>{{ row.item.adr.code }}</td>
					<td>{{ row.item.adr_kit_date }}</td>
					<td>
						<badge
							class="badge-dot mr-4"
							:type="setStatusType(row.item.status)"
						>
							<i :class="`bg-${setStatusType(row.item.status)}`"></i>
							<span class="status">{{
								row.item.status ? "VIGENTE" : "CADUCADO"
							}}</span>
						</badge>
					</td>
					<td class="text-right">
						<a class="btn btn-primary btn-sm" href="#" @click.prevent="vehicle = row.item, modal = true"
							><i class="fa-regular fa-eye"></i
						></a>
						<a
							class="btn btn-danger btn-sm"
							href="#"
							@click.prevent="destroy(row.item.id)"
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

		<modal
			v-if="this.modal"
			v-model:show="this.modal"
			modalClasses="modal-xl"
			model="vehiculos"
		>
			<form-vehicle
				@close="this.modal = false, vehicle = null"
				:vehicle="vehicle"
				@reload="getVehicles(page)"
				:installation_id="installation_id"
			></form-vehicle>
		</modal>
	</div>
</template>
<script>
	import utils from "@/mixins/utils-mixin";
	import FormVehicle from "../../components/forms/FormVehicle.vue";
	import service from "../../store/services/model-service";

	export default {
		mixins: [utils],
		components: { FormVehicle },
		name: "vehicle-table",
		props: {
			type: {
				type: String,
			},
			title: String,
			installation_id: {
				required: false,
				default: null,
			},
			classes: {
				type: String,
			},
			business_id: {
				required: false,
				default: null,
			},
			transported: {
				required: false,
				default: false,
			},
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				loader: false,
				page: 1,
				modal: false,
				vehicle: null,
			};
		},
		mounted() {
			this.getVehicles(this.page);
		},
		methods: {
			async getVehicles(page) {
				let params = "includes[]=adr&includes[]=type";

				if (this.installation_id != null) {
					params += "&installation_id=" + this.installation_id;
				}

				if (this.business_id != null) {
					params += "&business_id=" + this.business_id;
				}

				const resp = await service.getIndex("vehicle", page, params);

				if (typeof resp.data.data != "undefined") {
					this.tableData = resp.data.data;
					this.metaData = resp.data.meta.page;
					this.page = this.metaData.currentPage;
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.getVehicles(event, this.installation_id);
			},
			setStatusType(status) {
				let type = "";
				switch (status) {
					case 0:
						type = "danger";
						break;
					case 1:
						type = "success";
						break;
					default:
						break;
				}
				return type;
			},
			async destroy(id) {
				try {
					await service.destroy("vehicle", id);

					this.getVehicles();
				} catch (error) {
					console.log(error);
				}
			},
			handleAdd() {
				if (!this.transported) {
					this.$swal(
						"No puede agregar vehiculos",
						"No puede agregar vehiculos ya que las operaciones de esta instalación no son de transporte.",
						"warning"
					);
				} else {
					this.modal = true;
				}
			},
		},
	};
</script>
<style></style>
