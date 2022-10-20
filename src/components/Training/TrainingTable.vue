<template>
	<div class="card mb-md-5">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Asignaciones</h4>
				</div>
				<div class="col text-right">
					<!-- <a href="#" class="btn btn-sm btn-default" @click.prevent="handleAdd">Agregar</a> -->
				</div>
			</div>
		</div>

		<div
			class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row align-items-end filter-container"
		>
			<div class="col-md-10">
				<div class="row align-items-end">
					<date-filter
						class="col-12 col-md-4 col-lg-3"
						v-model:clear="clear"
						@updated="handleFilter('date', $event)"
					/>
					<div class="col-12 col-md-4  mt-2 mt-md-0 col-lg-3 filter"  v-if="!$store.state.is_auditor">
						<async-select
							placeholder="Selecciona responsable..."
							v-model:clear="clear"
							@updated="handleFilter('responsible', $event.id)"
							v-if="!$store.state.is_auditor"
							:roles="[2, 3]"
						></async-select>
					</div>
					<business-filter
						class="col-12 col-md-4 mt-2 mt-md-0 col-lg-3"
						v-model:clear="clear"
						@updated="handleFilter('business', $event)"
						v-if="$store.state.is_auditor || $store.state.is_delegate"
					/>
					<installation-filter
						class="col-12 col-md-4 mt-2 mt-md-0 col-lg-3"
						v-model:clear="clear"
						@updated="handleFilter('installation', $event)"
					/>
					<!-- <select-filter
						class="col-12 col-md-4 mt-2 mt-md-0 col-lg-3"
						v-model:clear="clear"
						placeholder="Selecciona un estatus..."
						:options="[
							{ label: 'Pendiente', value: 'false' },
							{ label: 'Completado', value: 'true' },
						]"
						@updated="handleFilter('status', $event)"
					/> -->
				</div>
			</div>
			<div class="col-md-2 mt-2 mt-md-0">
				<base-button
					size="sm"
					@click="(params_filter = params), index(page), (clear = true)"
					>Borrar filtros</base-button
				>
			</div>
		</div>
		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Formación</th>
					<th>Responsable</th>
					<th>Instalación</th>
					<th>Modalidad</th>
					<th>Empleados</th>
					<th>Fecha</th>
					<th>Estatus</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row" class="text-uppercase">
						{{ row.item?.formation.name }}
					</th>
					<th scope="row" class="text-uppercase">
						{{ row.item?.formation.facilitable.user.full_name }}
					</th>
					<td class="text-uppercase">
						{{ row.item?.installation.name }}
					</td>
					<td class="text-uppercase">
						{{ row.item?.formation?.type?.name }}
					</td>
					<td>
						{{ row.item?.employees_count }}
					</td>
					<td>
						{{ row.item?.date_formatted }}
					</td>
					<td>
						<badge
							class="badge-dot mr-4 text-capitalize"
							:type="row.item?.status ? 'success' : 'danger'"
						>
							<i :class="`bg-${row.item?.status ? 'success' : 'danger'}`"></i>
							<span class="status">{{
								row.item?.status ? "Completado" : "Pendiente"
							}}</span>
						</badge>
					</td>
					<td>
						<base-dropdown
							class="dropdown audit-drop"
							position="right"
							direction="custom"
						>
							<template v-slot:title>
								<a
									class="btn btn-sm btn-icon-only text-light"
									role="button"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									<i class="fas fa-ellipsis-v"></i>
								</a>
							</template>
							<a
								class="dropdown-item"
								href="#"
								v-if="!row.item?.status"
								@click="generate(row.item)"
								>Reporte</a
							>
							<a
								class="dropdown-item"
								href="#"
								v-if="!row.item?.status"
								@click="toSchedule(row.item?.id)"
								>Re-agendar</a
							>
							<a
								class="dropdown-item"
								href="#"
								v-if="row.item?.status"
								@click="toComplete(row.item)"
								>Detalle</a
							>
							<a
								class="dropdown-item"
								href="#"
								v-if="!row.item?.status && row.item.can_complete"
								@click="toComplete(row.item)"
								>Completar</a
							>
							<a
								class="dropdown-item"
								href="#"
								v-if="!row.item?.status"
								@click="toReAssign(row.item)"
								>Re-asignar</a
							>
							<a
								class="dropdown-item"
								href="#"
								v-if="!row.item?.status"
								@click="toDelete(row.item)"
								>Eliminar</a
							>
						</base-dropdown>
					</td>
				</template>
			</base-table>
			<base-pagination
				:perPage="metaData.perPage"
				:value="page"
				@changePage="handleChange($event)"
				:total="metaData.total"
				align="center"
			>
			</base-pagination>

			<modal v-if="modal && selected_training" modalClasses="modal-xxl" :action="selected_training.status ? 'detalle' : reAssign ? 're-asignar' : 'completar'" v-model:show="modal" model="Formación">
				<form-complete-formation :toComplete="!reAssign" :installation_id="selected_training.installation_id" :reAssign="reAssign" :isComplete="selected_training.status" :training_id="selected_training.id" @close="modal = false, selected_training = null,reAssign = false" @reload="index"/>
			</modal>
		</div>
	</div>
</template>
<script>
	import AsyncSelect from "../core_components/AsyncSelect.vue";
	import BusinessFilter from "../filters/BusinessFilter.vue";
	import DateFilter from '../filters/DateFilter.vue';
	import InstallationFilter from "../filters/InstallationFilter.vue";
	import FormCompleteFormation from '../Formation/FormCompleteFormation.vue';
	import service from "../../store/services/model-service";
	export default {
		components: { AsyncSelect, BusinessFilter, InstallationFilter, DateFilter, FormCompleteFormation },
		props: {
			reload: {
				type: Boolean,
				defaul: false,
			},
		},
		name: "training-table",
		data() {
			return {
				tableData: [],
				metaData: {},
				modal: false,
				action: "Registrar",
				page: 1,
				formation_id: null,
				assign: false,
				params:
					"includes[]=installation.company&counts[]=employees&includes[]=formation.facilitable.user&includes[]=formation.type",
				params_filter: null,
				clear: null,
				selected_training: null,
				reAssign: false
			};
		},
		mounted() {
			this.index(this.page);
		},
		methods: {
			async index(page = 1) {
				if (this.params_filter == null) {
					this.params_filter = this.params;
				}

				const resp = await service.getIndex("training", page, this.params_filter);
				this.tableData = resp?.data?.data;
				this.metaData = resp?.data?.meta?.page;
				this.page = this?.metaData?.currentPage;
			},
			handleFilter(type, value) {
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=` + value;
					this.index(this.page);
				} else {
					this.params_filter = this.params;
					this.index(this.page);
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.index(event);
			},
			handleAdd() {
				this.modal = true;
			},
			handleAssign() {
				this.modal = true;
			},
			handleClose() {
				this.modal = false;
			},
			async toSchedule(id) {
				await this.$store.dispatch("toSchedule", {
					model: "trainings",
					id: id,
					name: "formacion",
				});
				this.index();
			},
			async toComplete(item) {
				if (!item.can_complete && !item.status) {
					this.$swal('No se puede completar esta Formación', 
					'Esta formación no se puede completar debido a que la fecha agendada es anterior a la fecha actual.',
					'error')
					return;
				}
				this.selected_training = item;
				this.modal = true;
			},
			async toReAssign(item) {
				this.selected_training = item;
				this.modal = true;
				this.reAssign = true
			},
			async toDelete(item) {
				await this.$store.dispatch('delete', {model: 'training',id: item.id})
				this.index()
			},
			async generate(training) {
				try {
					const rep = await service.api({url:"trainings/report/" + training.id});
					const b64 = rep.data.data;
					const fileUrl = await this.$functions.formatDoc(b64);
					window.open(fileUrl);
				} catch (err) {
					console.log(err);
					this.$toast.error(
						typeof err.response.data != undefined
							? err.data.message
							: "Ocurrio un error al generar el informe"
					);
				}
			},
		},
		watch: {
			reload(newVal) {
				if (newVal == true) {
					console.log(newVal);
					this.index();
					this.$emit("reloaded");
				}
			},
		},
	};
</script>
<style></style>
