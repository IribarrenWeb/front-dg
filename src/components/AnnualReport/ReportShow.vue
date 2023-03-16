<template>
	<q-dialog full-width>
		<q-card class="q-px-lg q-py-md">
			<q-card-section class="flex items-center q-pl-md">
				<h3>REPORTE </h3>
				<span class="text-muted h6 ml-md-1 text-capitalize"> - generar</span>
			</q-card-section>
			<q-separator spaced />
			<q-card-section>
				<base-steps :currentStep="currentStep" listClasses="pb-md-2" :steps="steps" :edit="true"
					@step="currentStep = $event" @navigate="currentStep = $event"></base-steps>
			</q-card-section>
			<q-card-section class=" scroll" style="max-height: 50vh">
				<div>
					<form-loader v-if="(loading || !report?.id)" />
					<div v-else>

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
												<th>{{ report?.business.user.full_name }}</th>
												<th>{{ report?.business?.address?.address }}</th>
												<th>{{ report?.business?.address?.code }}</th>
												<th>{{ report?.business?.address?.city }}</th>
												<th>{{ report?.business?.business_nif }}</th>
											</tr>
											<tr>
												<td>Empleados</td>
												<td>VS</td>
												<td>Fijo</td>
												<td colspan="2">Email</td>
											</tr>
											<tr>
												<th>{{ report?.business?.employees_count }}</th>
												<th>{{ report?.business?.security }}</th>
												<th>{{ report?.business?.business_phone }}</th>
												<th colspan="2">{{ report?.business?.user.email }}</th>
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
									<table class="table table-bordered table-responsive-sm table-sm rounded">
										<thead>
											<tr>
												<td>Nombre</td>
												<td>NIF</td>
												<td>Móvil</td>
												<td>Email</td>
											</tr>
										</thead>
										<tbody>
											<tr v-for="auditor in report?.auditables" :key="auditor.id">
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
										<!-- <pre>{{ operations }}</pre> -->
										<base-field name="operations" label="Tipos de operaciones">
											<div v-for="operation in operations" :key="operation.key" class="form-check">
												<div class="form-check">
													<input class="form-check-input" type="checkbox" :value="operation.value"
														disabled :checked="operation.checked" />
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
							<div class="overflow-auto w-100">
								<table class="table table-bordered table-sm rounded w-100">
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
												{{ material.installation?.name }}
											</th>
											<th>{{ material.operation.name }}</th>
											<th>{{ material?.material?.packing.code }}</th>
											<th>{{ material?.material?.class?.code }}</th>
											<th>{{ material?.quantity_operation }} {{ material.unit }}</th>
											<th>{{ material?.installation?.full_address }}</th>
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
								<vehicles-table :business_id="report.business.id"
									:installation_id="installation_id"></vehicles-table>
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
						<template v-if="currentStep == 6">
							<div>
								<div class="mb-1 d-flex align-content-center justify-content-between">
									<h4>Sucesos</h4>
									<base-button size="sm" rounded icon="fa-solid fa-plus" icon-only type="primary"
										@click="addAccident" />
								</div>
								<div class="overflow-auto w-100">
									<table class="table table-bordered table-sm rounded w-100">
										<thead>
											<tr>
												<td>Fecha</td>
												<td>Lugar</td>
												<td>Descripción</td>
												<td></td>
											</tr>
										</thead>
										<tbody v-if="model.accidents && model.accidents?.length >= 1">
											<tr v-for="accident, idx in model.accidents" :key="idx">
												<th>
													<input type="date" class="form-control"
														v-model="model.accidents[idx].date" />
												</th>
												<th>
													<input type="text" class="form-control"
														v-model="model.accidents[idx].address" />
												</th>
												<th>
													<input type="text" class="form-control"
														v-model="model.accidents[idx].description" />
												</th>
												<th>
													<base-button size="sm" rounded icon="fa-solid fa-minus" icon-only
														type="primary" @click="removeAccident(idx)" />
												</th>
											</tr>
										</tbody>
										<tbody v-else>
											<tr>
												<td colspan="3">No hay sucesos registrados</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</template>
						<!-- ------------------------------------------------------ -->
						<template v-if="currentStep == 7">
							<div class="row">
								<!-- formaciones -->
								<div class="col-lg-12">
									<div>
										<base-field
											label="¿El personal implicado de la empresa ha recibido una formación adecuada?">
											<div class="custom-control custom-radio">
												<input class="custom-control-input" type="radio" name="has_formations"
													id="has_formations1" :value="true" v-model="model.has_formations" />
												<label class="custom-control-label" for="has_formations1">
													SI
												</label>
											</div>
											<div class="custom-control custom-radio">
												<input class="custom-control-input" type="radio" :value="false"
													name="has_formations" id="has_formations2"
													v-model="model.has_formations" />
												<label class="custom-control-label" for="has_formations2">
													NO
												</label>
											</div>
										</base-field>
									</div>
									<div v-if="model.has_formations">
										<div class="row">
											<base-field v-if="report.last_training" class="col-md-3"
												label="Cantidad de empleados">
												<input class="form-control" type="text"
													v-model="model.formation_data.employees_count" />
											</base-field>
											<base-field v-if="report.last_training" class="col-md-3"
												label="Fecha de la formación">
												<input class="form-control" type="date"
													v-model="model.formation_data.date_formation" />
											</base-field>
											<base-field v-if="report.last_training" class="col-md-3"
												label="Hora de la formación">
												<input class="form-control" type="text"
													v-model="model.formation_data.time_formation" />
											</base-field>
											<base-field class="col-md-12" label="Descripción de la formación">
												<!-- <textarea class="form-control" cols="30" rows="10"
													v-model="model.formation_desc"></textarea> -->
												<qu-input-validation type="textarea" v-model="model.formation_desc"
													cols="30" rows="10" apiName="formation_desc">
												</qu-input-validation>
											</base-field>
										</div>
									</div>
									<div v-if="!model.has_formations">
										<base-field
											label="Indicar motivos y medidas emprendidas por la empresa para subsanar la deficiencia">
											<qu-input-validation type="textarea" v-model="model.deficiency_desc" cols="30"
												rows="10" apiName="deficiency_desc" />
											<!-- <textarea class="form-control" cols="30" rows="10"
												v-model="model.deficiency_desc"></textarea> -->
										</base-field>
									</div>
								</div>
								<div class="col-lg-12">
									<base-field label="¿Figura la formación recibida en el expediente?">
										<div class="custom-control custom-radio">
											<input class="custom-control-input" type="radio" name="has_formations_records"
												id="has_formations_records1" :value="true"
												v-model="model.has_formations_records" />
											<label class="custom-control-label" for="has_formations_records1">
												SI
											</label>
										</div>
										<div class="custom-control custom-radio">
											<input class="custom-control-input" type="radio" :value="false"
												name="has_formations_records" id="has_formations_records2"
												v-model="model.has_formations_records" />
											<label class="custom-control-label" for="has_formations_records2">
												NO
											</label>
										</div>
									</base-field>
								</div>
							</div>
						</template>
						<!-- ------------------------------------------------------ -->

						<div class="mt-4 float-md-right q-gutter-sm">

						</div>

						<validation-errors v-model="showErrors" :errors="errors" />
					</div>
				</div>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn size="md" :loading="(validating || loading)" label="Anterior" color="primary" @click="currentStep--"
					v-if="currentStep !== 1" />
				<q-btn size="md" :loading="(validating || loading)" label="Siguiente" color="primary"
					v-if="currentStep < steps.length" @click="handleNext" />
				<q-btn size="md" :loading="(validating || loading)" color="primary"
					v-if="currentStep == steps.length && report?.status == 'PENDIENTE'"
					:label="validating ? 'Validando..' : 'Generar'" @click="validate" />
				<q-btn size="md" :loading="(validating || loading)" label="Aceptar" color="primary"
					v-if="role != 'business' && report?.status == 'POR REVISAR'" @click="validate" />
				<q-btn size="md" outline :loading="(validating || loading)" label="Cerrar" color="primary"
					@click="handleClose" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import service from "../../store/services/model-service";
import dataService from "@/store/services/data-service";
import VehiclesTable from "../Vehicle/VehiclesTable.vue";

import _ from "lodash";
import { useStore } from "vuex";
import ValidationErrors from "./ValidationErrors.vue";
import { ref } from '@vue/reactivity';
import functions from "../../utils/functions";
import { computed, watch } from '@vue/runtime-core';
import { swal } from '../../boot/plugins';
import FormLoader from '../../loaders/FormLoader.vue';
import QuInputValidation from '../core_components/FormQuasar/QuInputValidation.vue';

export default {
	inheritAttrs: true,
	components: {
		VehiclesTable,
		ValidationErrors,
		FormLoader,
		QuInputValidation,
	},
	props: {
		report_id: {
			required: true,
		},
	},
	setup(props, { emit }) {
		const store = useStore()
		const role = computed(() => {
			return store.getters.ROLE;
		});
		const report = ref(null)
		const materials = ref(null)
		const operations = ref([])
		const visits = ref(null)
		const business_id = ref(null)
		const currentStep = ref(1)
		const validating = ref(false)
		const steps = ref([])
		const model = ref({
			has_formations: null,
			formation_desc: 'Naturaleza de la formación (ADR)- 1.3.2.1 Sensibilización general- 1.3.2.2 Formación específica- 1.3.2.3 Formación en materia de seguridad- 1.3.3 Documentación- Definiciones y obligaciones de los participantes- Normas sobre la operación de transporte-Disposiciones varias a observar por la tripulación del vehículo-Validez y renovación del certificado ADR-Restricciones a la circulación-Procedimientos para la operación de carga-Procedimientos para la operación de descarga-Disposiciones relativas al transporte en bultos-Disposiciones relativas a la carga, a la descarga y a la manipulación-Prohibiciones relativas de cargamento en común-Manipulación y estiba (adr)-Peligro de los productos químicos de la Instalación-ficha se seguridad de los productos manipulados.-Procedimientos en caso de avería, incidente o accidente.-Equipamiento de los camiones destinados al Tte. de materias peligrosas-Equipamiento para cada miembro de la tripulación según adr.-Documentación; carta de porte, instrucciones escritas-Medios de extinción-Normas para la correcta utilización de los extintores portátiles',
			deficiency_desc: null,
			has_formations_records: null,
			formation_data: {
				employees_count: null,
				date_formation: null,
				time_formation: null,
			},
			accidents: []
		})
		const errors = ref(null)
		const showErrors = ref(false)
		const loading = ref(true)

		async function getReport() {
			try {
				loading.value = true
				const res = await service.show(
					"report",
					props.report_id,
					"includes[]=business.province.city&includes[]=business.user" +
					"&includes[]=business.auditors.user" +
					"&includes[]=business.delegates.user" +
					"&includes[]=business.operations"
				);
				report.value = functions.copy(res.data.data);

				model.value.accidents = functions.copy(res.data.data.report_meta_data?.accidents_data ?? [])

				model.value.has_formations =
					report.value.has_formations == 0 ? false : true;
				model.value.formation_desc =
					report.value?.last_training?.formation?.content ?? model.value.formation_desc;
				model.value.formation_data.employees_count =
					report.value?.last_training?.employees_count;
				model.value.formation_data.date_formation =
					report.value?.last_training?.year_date;
				model.value.formation_data.time_formation =
					report.value?.last_training?.time_date;
				model.value.deficiency_desc = report.value.deficiency_desc;
				model.value.has_formations_records =
					report.value.has_formations_records == 0 ? false : true;

				business_id.value = report.value.business.id;
				loading.value = false

			} catch (err) {
				loading.value = false

				console.log(err);
			}
		}

		async function validate() {
			try {
				validating.value = true
				const res = await service.apiNoLoading({ url: `reports/${props.report_id}/validate` })
				console.log(res.data[0]);
				validating.value = false
				if (res.data[1]) {
					errors.value = res.data[0];
				} else {
					generate()
				}

			} catch (err) {
				validating.value = false
			}
		}

		async function generate() {
			if (report.value == "PENDIENTE") {
				if (
					_.isNull(model.value.has_formations) ||
					_.isNull(model.value.has_formations_records)
				) {
					swal(
						"Campos incompletos",
						"Debes rellenar los campos antes de generar el informe",
						"warning"
					);
					return;
				} else if (
					(model.value.has_formations && _.isEmpty(model.value.formation_desc)) ||
					(!model.value.has_formations && _.isEmpty(model.value.deficiency_desc))
				) {
					swal(
						"Campos incompletos",
						"Debes rellenar los campos solicitados antes de generar el informe",
						"warning"
					);
					return;
				}
			}

			const result = await new swal({
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
					const data = functions.cleanData(model.value);
					loading.value = true
					await service.update("report", props.report_id, {
						...data,
						generate: 1
					});
					emit("close");
					emit("reload");
					loading.value = false

				} catch (err) {
					loading.value = false

					const errors_data = err?.response?.data?.data;
					if (errors_data) {
						console.log(err.response?.data?.data);
						errors.value = errors_data;
					}
					// this.$toast.error(
					// 	typeof err.response.data != undefined
					// 		? err.data.message
					// 		: "Ocurrio un error al generar el informe"
					// );
				}
			}
		}

		async function getMaterials() {
			try {
				const res = await service.getIndex(
					"material",
					null,
					"includes[]=material&includes[]=operation" +
					"&includes[]=installation" +
					"&no_chemical=1" +
					"&business_id=" +
					business_id.value
				);
				materials.value = functions.copy(res.data.data);
			} catch (err) {
				console.log(err);
			}
		}

		async function getVisits() {
			try {
				const res = await service.getIndex(
					"visit",
					null,
					"includes[]=installation" + "&business_id=" + business_id.value
				);
				visits.value = functions.copy(res.data.data);
			} catch (err) {
				console.log(err);
			}
		}

		async function handleNext() {
			if (currentStep.value == 1) {
				// loadOperations()
			}

			if (currentStep.value == 6) {
				const realData = model.value.accidents.filter(a => a?.date && (a?.address || a?.description)) ?? []
				model.value.accidents = realData
				service.apiNoLoading({ url: `reports/${props.report_id}`, method: 'PUT', data: {
					accidents: realData
				}})
			}

			currentStep.value++;
		}

		function handleClose() {
			emit("close");
		}

		function addAccident() {
			model.value.accidents.push({
				date: null,
				address: null,
				description: null
			})
		}

		function removeAccident(idx) {
			model.value.accidents.splice(idx, 1)
		}

		async function loadOperations() {
			try {
				loading.value = true
				const res = await dataService.getOperations();
				const data = res.data.data;
				let operations_data = _.map(data, (operation) => {
					let checked = false;
					for (let i = 0; i < report.value.business.operations.length; i++) {
						const op = report.value.business.operations[i];
						if (operation.id == op.id) {
							checked = true;
						}
					}
					return { value: operation.id, label: operation.name, checked: checked };
				});
				loading.value = false
				// console.log(operations_data);
				operations.value = operations_data;
			} catch (err) {
				loading.value = false
				console.error(err);
			}
		}

		function handleCancel(model) {
			switch (model) {
				case "document":
					new_document.value.new = false;
					model.value.file_document = null;
					break;

				case "auditable":
					new_auditable.value.new = false;
					new_auditable.value.value = false;
					break;

				default:
					break;
			}
		}

		function formatSteps() {
			let baseSteps = [
				"Empresa",
				"Operaciones",
				"Mercancías",
				"Vehiculos",
				"Visitas",
				"Sucesos",
				"Formación",
			];
			let count = 1;
			let steps_data = []
			_.forEach(baseSteps, function (s) {
				steps_data.push({
					number: count,
					title: s,
					valid: false,
				});
				count++;
			});
			steps.value = steps_data
		}


		getReport();
		formatSteps();

		// watch(() => oper.value, (v) => {
		// 	let oper_ids = functions.pluck(model.value.operations, "id");
		// 	update.value.op = !_.isEqual(oper, oper_ids);
		// })

		watch(() => errors.value, (v) => {
			console.log(v);
			if (v) showErrors.value = true
		})

		watch(() => currentStep.value, (v) => {
			if (v == 3) {
				getMaterials();
			} else if (v == 5) {
				getVisits();
			} else if (v == 2) {
				loadOperations();
			}
		})

		return {
			report,
			materials,
			operations,
			visits,
			business_id,
			currentStep,
			steps,
			model,
			errors,
			validating,
			showErrors,
			handleCancel,
			getMaterials,
			getVisits,
			role,
			loadOperations,
			removeAccident,
			handleClose,
			addAccident,
			handleNext,
			generate,
			getMaterials,
			loading,
			validate

		};
	},
};
</script>