<template>
	<div>
		<base-steps
			:currentStep="currentStep"
			listClasses="mb-md-4 pb-md-2"
			:steps="steps"
			:edit="true"
			@step="currentStep = $event"
			@navigate="currentStep = $event"
		></base-steps>
		<template v-if="currentStep == 1">
			<div>
				<div class="mb-1">
					<h4>Datos de la empresa</h4>
				</div>
				<div class="overflow-auto">
					<table class="table table-bordered table-sm mb-3 rounded">
						<tbody>
							<tr>
								<td>Nombre de empresa</td>
								<td>Dirección</td>
								<td>Código Postal</td>
								<td>Ciudad</td>
								<td>CIF</td>
							</tr>
							<tr>
								<th>{{ report.business.user.full_name }}</th>
								<th>{{ report.business?.address?.address }}</th>
								<th>{{ report.business?.address?.code }}</th>
								<th>{{ report.business?.address?.city }}</th>
								<th>{{ report.business?.business_nif }}</th>
							</tr>
							<tr>
								<td>Empleados</td>
								<td>VS</td>
								<td>Fijo</td>
								<td colspan="2">Email</td>
							</tr>
							<tr>
								<th>{{ report.business?.employees_count }}</th>
								<th>{{ report.business?.security }}</th>
								<th>{{ report.business?.business_phone }}</th>
								<th colspan="2">{{ report.business?.user.email }}</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="mt-3">
				<div class="mb-1">
					<h4>Consejeros ADR</h4>
				</div>
				<div class="overflow-auto">
					<table
						class="table table-bordered table-responsive-sm table-sm rounded"
					>
						<thead>
							<tr>
								<td>Nombre</td>
								<td>NIF</td>
								<td>Móvil</td>
								<td>Email</td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="auditor in report.auditables" :key="auditor.id">
								<th>{{ auditor?.user.full_name }}</th>
								<th>{{ auditor?.dni }}</th>
								<th>{{ auditor?.phone_number }}</th>
								<th>{{ auditor?.user.email }}</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- </form-validate> -->
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 2">
			<div>
				<div class="row border rounded border-light bg-white px-4 py-2">
					<div class="col-lg-12">
						<base-field name="operations" label="Tipos de operaciones">
							<div
								v-for="operation in operations"
								:key="operation.key"
								class="form-check"
							>
								<div class="form-check">
									<input
										class="form-check-input"
										type="checkbox"
										:value="operation.value"
										disabled
										:checked="operation.checked"
									/>
									<label class="form-check-label" for="flexCheckDefault">
										{{ operation.label }}
									</label>
								</div>
							</div>
						</base-field>
					</div>
				</div>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 3">
			<div class="mb-1">
				<h4>Mercancías ADR</h4>
			</div>
			<div class="overflow-auto">
				<table class="table table-bordered table-sm rounded">
					<thead>
						<tr>
							<td>Instalación</td>
							<td>Tipo de operación</td>
							<td>Grupo de embalaje</td>
							<td>Peligros</td>
							<td>Cantidad</td>
							<td>Domicilio</td>
						</tr>
					</thead>
					<tbody v-if="materials != null && materials.length >= 1">
						<tr v-for="(material, idx) in materials" :key="material.id">
							<th>
								#{{ idx + 1 }} -
								{{ material.installation.name }}
							</th>
							<th>{{ material.operation.name }}</th>
							<th>{{ material.material.packing.code }}</th>
							<th>{{ material.material.class.code }}</th>
							<th>{{ material.quantity_operation }} {{ material.unit }}</th>
							<th>{{ material.installation.full_address }}</th>
						</tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td colspan="6">No hay materiales registrados</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
		<!-- ------------------------------------------------------- -->

		<!-- ------------------------------------------------------- -->
		<template v-if="currentStep == 4">
			<div>
				<vehicles-table
					:business_id="report.business.id"
					:installation_id="installation_id"
				></vehicles-table>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 5">
			<div>
				<div class="mb-1">
					<h4>Visitas</h4>
				</div>
				<div class="overflow-auto">
					<table class="table table-bordered table-sm rounded">
						<thead>
							<tr>
								<td>Fecha</td>
								<td>Periodicidad</td>
								<td>Domicilio</td>
							</tr>
						</thead>
						<tbody v-if="visits != null && visits.length >= 1">
							<tr v-for="visit in visits" :key="visit.id">
								<th>{{ visit.date }}</th>
								<th>{{ visit.installation.periodicity }}</th>
								<th>{{ visit.installation.full_address }}</th>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="3">No hay visitas registradas</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 6">
			<div class="row">
				<!-- formaciones -->
				<div class="col-lg-12">
					<div>
						<base-field
							label="¿El personal implicado de la empresa ha recibido una formación adecuada?"
						>
							<div class="custom-control custom-radio">
								<input
									class="custom-control-input"
									type="radio"
									name="has_formations"
									id="has_formations1"
									:value="true"
									v-model="model.has_formations"
								/>
								<label class="custom-control-label" for="has_formations1">
									SI
								</label>
							</div>
							<div class="custom-control custom-radio">
								<input
									class="custom-control-input"
									type="radio"
									:value="false"
									name="has_formations"
									id="has_formations2"
									v-model="model.has_formations"
								/>
								<label class="custom-control-label" for="has_formations2">
									NO
								</label>
							</div>
						</base-field>
					</div>
					<div v-if="model.has_formations">
						<div class="row">
							<base-field
								v-if="report.last_training"
								class="col-md-3"
								label="Cantidad de empleados"
							>
								<input
									class="form-control"
									type="text"
									v-model="model.formation_data.employees_count"
								/>
							</base-field>
							<base-field
								v-if="report.last_training"
								class="col-md-3"
								label="Fecha de la formación"
							>
								<input
									class="form-control"
									type="date"
									v-model="model.formation_data.date_formation"
								/>
							</base-field>
							<base-field
								v-if="report.last_training"
								class="col-md-3"
								label="Hora de la formación"
							>
								<input
									class="form-control"
									type="text"
									v-model="model.formation_data.time_formation"
								/>
							</base-field>
							<base-field class="col-md-12" label="Descripción de la formación">
								<textarea
									class="form-control"
									cols="30"
									rows="10"
									v-model="model.formation_desc"
								></textarea>
							</base-field>
						</div>
					</div>
					<div v-if="!model.has_formations">
						<base-field
							label="Indicar motivos y medidas emprendidas por la empresa para subsanar la deficiencia"
						>
							<textarea
								class="form-control"
								cols="30"
								rows="10"
								v-model="model.deficiency_desc"
							></textarea>
						</base-field>
					</div>
				</div>
				<div class="col-lg-12">
					<base-field
						label="¿Figura la formación recibida en el exprediente del personal?"
					>
						<div class="custom-control custom-radio">
							<input
								class="custom-control-input"
								type="radio"
								name="has_formations_records"
								id="has_formations_records1"
								:value="true"
								v-model="model.has_formations_records"
							/>
							<label class="custom-control-label" for="has_formations_records1">
								SI
							</label>
						</div>
						<div class="custom-control custom-radio">
							<input
								class="custom-control-input"
								type="radio"
								:value="false"
								name="has_formations_records"
								id="has_formations_records2"
								v-model="model.has_formations_records"
							/>
							<label class="custom-control-label" for="has_formations_records2">
								NO
							</label>
						</div>
					</base-field>
				</div>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->

		<div class="mt-4 float-md-right">
			<base-button
				type="default"
				@click="currentStep--"
				v-if="currentStep !== 1"
				>Anterior</base-button
			>
			<base-button
				type="default"
				@click="handleNext"
				v-if="currentStep < steps.length"
				>Siguiente</base-button
			>
			<base-button
				type="default"
				@click="generate"
				v-if="currentStep == steps.length && report.status == 'PENDIENTE'"
				>Generar</base-button
			>
			<base-button
				v-if="ROLE != 'business' && report.status == 'POR REVISAR'"
				type="default"
				@click="generate"
				>Aceptar</base-button
			>
			<base-button
				type="default"
				:outline="true"
				class="ml-auto"
				@click="handleClose"
				>Cerrar
			</base-button>
		</div>

		<modal
			v-if="errors"
			v-model:show="errors"
			action="Validaciones"
			modalClasses="modal-xl"
			model="informe anual"
		>
			<validation-errors :errors="errors" />
		</modal>
	</div>
</template>

<script>
	import service from "../../store/services/model-service";
	import dataService from "@/store/services/data-service";
	import VehiclesTable from "@/views/Tables/VehiclesTable.vue";
	import utils from "@/mixins/utils-mixin";

	import _ from "lodash";
	import { mapGetters } from "vuex";
	import ValidationErrors from "../../components/AnnualReport/ValidationErrors.vue";

	export default {
		name: "installation-show",
		components: {
			VehiclesTable,
			ValidationErrors,
		},
		mixins: [utils],
		props: {
			report_id: {
				required: true,
			},
		},
		data() {
			return {
				report: null,
				materials: null,
				operations: [],
				visits: null,
				business_id: null,
				currentStep: 1,
				steps: [],
				model: {
					has_formations: null,
					formation_desc: null,
					deficiency_desc: null,
					has_formations_records: null,
					formation_data: {
						employees_count: null,
						date_formation: null,
						time_formation: null,
					},
				},
				errors: null,
			};
		},
		created() {
			this.getReport();
			this.formatSteps();
		},
		methods: {
			async getReport() {
				try {
					const res = await service.show(
						"report",
						this.report_id,
						"includes[]=business.province.city&includes[]=business.user" +
							"&includes[]=business.auditors.user" +
							"&includes[]=business.delegates.user" +
							"&includes[]=business.operations"
					);
					this.report = this.$functions.copy(res.data.data);

					this.model.has_formations =
						this.report.has_formations == 0 ? false : true;
					this.model.formation_desc =
						this.report?.last_training?.formation?.content;
					this.model.formation_data.employees_count =
						this.report?.last_training?.employees_count;
					this.model.formation_data.date_formation =
						this.report?.last_training?.year_date;
					this.model.formation_data.time_formation =
						this.report?.last_training?.time_date;
					this.model.deficiency_desc = this.report.deficiency_desc;
					this.model.has_formations_records =
						this.report.has_formations_records == 0 ? false : true;

					this.business_id = this.report.business.id;
				} catch (err) {
					console.log(err);
				}
			},
			async generate() {
				if (this.report == "PENDIENTE") {
					if (
						_.isNull(this.model.has_formations) ||
						_.isNull(this.model.has_formations_records)
					) {
						this.$swal(
							"Campos incompletos",
							"Debes rellenar los campos antes de generar el informe",
							"warning"
						);
						return;
					} else if (
						(this.model.has_formations && _.isEmpty(this.model.formation_desc)) ||
						(!this.model.has_formations && _.isEmpty(this.model.deficiency_desc))
					) {
						this.$swal(
							"Campos incompletos",
							"Debes rellenar los campos solicitados antes de generar el informe",
							"warning"
						);
						return;
					}
				}

				const result = await this.$swal({
					title: "¿Estas seguro?",
					icon: "question",
					text: "Una vez generado el reporte no se pueden editar los campos.",
					showCancelButton: true,
					confirmButtonText: "Generar",
					customClass: {
						confirmButton: "btn btn-primary",
						cancelButton: "btn btn-outline-primary",
					},
				}).then(async (result) => {
					if (result.isConfirmed) {
						return true;
					} else {
						return false;
					}
				});
				if (result) {
					try {
						const data = this.$functions.cleanData(this.model);
						await service.update("report", this.report_id, data);
						this.$emit("close");
						this.$emit("reload");
					} catch (err) {
						const errors = err?.response?.data?.data;
						if (errors) {
							this.errors = errors;
						}
						// this.$toast.error(
						// 	typeof err.response.data != undefined
						// 		? err.data.message
						// 		: "Ocurrio un error al generar el informe"
						// );
					}
				}
			},
			async getMaterials() {
				try {
					const res = await service.getIndex(
						"material",
						null,
						"includes[]=material&includes[]=operation" +
							"&includes[]=installation" +
							"&business_id=" +
							this.business_id
					);
					this.materials = this.$functions.copy(res.data.data);
				} catch (err) {
					console.log(err);
				}
			},
			async getVisits() {
				try {
					const res = await service.getIndex(
						"visit",
						null,
						"includes[]=installation" + "&business_id=" + this.business_id
					);
					this.visits = this.$functions.copy(res.data.data);
				} catch (err) {
					console.log(err);
				}
			},
			async handleNext() {
				if (this.currentStep == 1) {
					//
				}

				if (this.currentStep == 3) {
					//
				}

				this.currentStep++;
			},
			handleClose() {
				this.$emit("close");
			},
			async loadOperations() {
				const res = await dataService.getOperations();
				const data = res.data.data;
				let operations = _.map(data, (operation) => {
					let checked = false;
					for (let i = 0; i < this.report.business.operations.length; i++) {
						const op = this.report.business.operations[i];
						if (operation.id == op.id) {
							checked = true;
						}
					}
					return { value: operation.id, label: operation.name, checked: checked };
				});
				this.operations = operations;
				return;
			},
			handleCancel(model) {
				switch (model) {
					case "document":
						this.new_document.new = false;
						this.model.file_document = null;
						break;

					case "auditable":
						this.new_auditable.new = false;
						this.new_auditable.value = false;
						break;

					default:
						break;
				}
			},
			formatSteps() {
				let steps = [
					"Empresa",
					"Operaciones",
					"Mercancías",
					"Vehiculos",
					"Visitas",
					"Formación",
				];
				let count = 1;
				const $this = this;
				_.forEach(steps, function (s) {
					$this.steps.push({
						number: count,
						title: s,
						valid: false,
					});
					count++;
				});
			},
		},
		computed: {
			...mapGetters(["ROLE", "CLEAN_DATA"]),
		},
		watch: {
			oper() {
				let oper_ids = this.$functions.pluck(this.model.operations, "id");
				this.update.op = !_.isEqual(this.oper, oper_ids);
			},
			currentStep(newVal) {
				if (newVal == 3) {
					this.getMaterials();
				} else if (newVal == 5) {
					this.getVisits();
				} else if (newVal == 2) {
					this.loadOperations();
				}
			},
		},
	};
</script>