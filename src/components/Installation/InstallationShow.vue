<template>
	<div>
		<base-steps :currentStep="currentStep" listClasses="mb-md-4 pb-md-2" :steps="steps" :edit="true"
			@step="currentStep = $event" @navigate="currentStep = $event"></base-steps>
		
		<div v-if="!show">
			<form-section-loader :repeat="2" />
		</div>
		<template v-if="currentStep == number('Instalacion') && show">
			<general-data v-model:file_document="model.file_document" v-model:file_auditor="model.file_auditor"
				v-model:auditable="model.auditable_id" v-model:name="model.name" v-model:periodicity="model.periodicity"
				:delegate_id="queryParams" :auditable_value="model.auditable?.user?.id"
				:firm_document="model.firm_document" :auditor_document="model.auditor_document" />

			<address-select v-model:address="model.address.address" v-model:city="model.address.city"
				v-model:code="model.address.code" v-model:country="model.address.country"
				v-model:province="model.address.province" v-model:comunity="model.address.comunity"
				v-model:street_number="model.address.street_number" />
			<!-- </form-validate> -->

			<div class="row border rounded border-light bg-white px-1 py-1 mt-md-4 mt-2">
				<div class="col-md-12 py-2">
					<div class="d-flex justify-content-between">
						<h4>Responsables de la instalación</h4>
						<div class="">
							<base-button size="sm" @click="modal = true, addResponsible = true">Agregar</base-button>
						</div>
					</div>
				</div>
				<div class="col-md-12 overflow-auto p-0">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>RESPONSABLE</th>
								<th>DNI</th>
								<th>MÓVIL</th>
								<th>EMAIL</th>
								<th>ALTA</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(responsible, index) in responsibles" :key="index">
								<td>{{ responsible?.name }} {{ responsible?.last_name }}</td>
								<td>{{ responsible?.dni }}</td>
								<td>{{ responsible?.phone_number }}</td>
								<td>{{ responsible?.email }}</td>
								<td>
									<div v-if="responsible?.firm_document != null">
										<span class="d-block">{{
										this.formatDate(
										responsible.firm_document.document_date,
										"GB"
										)
										}}</span>
										<a href="#" class="text-uppercase d-block" @click.prevent="
											getDocument(responsible?.firm_document?.id)
										">
											<i class="fa fa-file-pdf" aria-hidden="true"></i>
											{{ responsible?.firm_document?.name_document ?? 'ALTA' }}
										</a>
									</div>
								</td>
								<td>
									<q-btn color="primary" dense flat icon="fa-regular fa-eye"
										@click="showResponsible(responsible.id)" />
								</td>
							</tr>
							<tr v-if="!responsibles">
								<td colspan="5">Sin responsables</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<q-dialog v-model="editModal" v-if="responsible_id">
				<q-card style="min-width: 80vw;" class="q-pb-lg">
					<q-card-section class="items-center q-pa-xl">
						<form-employee @reload="getResponsibles" @close="editModal = false, responsible_id = null"
							:installation_id="installation_id" :responsible="true" :employee_id="responsible_id" />
					</q-card-section>
				</q-card>
			</q-dialog>
			<!-- <modal v-model:show="editModal" v-if="responsible_id" action="Editar" modalClasses="modal-xxl"
				model="Responsable">
				<form-employee @reload="getResponsibles" @close="editModal = false, responsible_id = null"
					:installation_id="installation_id" :responsible="true" :employee_id="responsible_id" />
			</modal> -->
			<responsible-modal ref="responsiblesModal" v-model:show="modal" :installation_id="installation_id" />
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == number('Operaciones')">
			<div>
				<div class="row border rounded border-light bg-white px-4 py-2">
					<div class="col-lg-12">
						<div class="row">
							<div class="col-lg-6">
								<base-field name="operations" label="Tipos de operaciones">
									<div v-for="operation in operations" :key="operation.key" class="form-check">
										<div class="form-check">
											<input class="form-check-input" type="checkbox" :value="operation.value"
												v-model="oper" :checked="operation.checked" />
											<label class="form-check-label" for="flexCheckDefault">
												{{ operation.label }}
											</label>
										</div>
									</div>
								</base-field>
							</div>
							<div class="col-lg-6">
								<base-field name="deposits" label="Tipos de depósitos">
									<div v-for="deposit in deposits" :key="deposit.key" class="form-check">
										<div class="form-check">
											<input class="form-check-input" type="checkbox" :value="deposit.value"
												v-model="deps" :checked="deposit.checked" />
											<label class="form-check-label" for="flexCheckDefault">
												{{ deposit.label }}
											</label>
										</div>
									</div>
								</base-field>
							</div>
						</div>
					</div>
				</div>
				<div class="row border rounded border-light bg-white px-4 py-2 mt-3">
					<div class="col-lg-12">
						<base-field name="equipments" label="Tipos de equipamientos" labelClasses="d-block">
							<div v-for="equipment in equipments" :key="equipment.key" class="d-inline-block">
								<div class="form-check ml-3">
									<input class="form-check-input" type="checkbox" :value="equipment.value"
										v-model="equips" :checked="equipment.checked" />
									<label class="form-check-label" for="flexCheckDefault">
										{{ equipment.label }}
									</label>
								</div>
							</div>
						</base-field>
					</div>
				</div>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == number('Empleados')">
			<dashboard-employee v-if="ROLE != 'business'" :reload="reload_dash_employee"
				@reloaded="reload_dash_employee = false" :id="installation_id"></dashboard-employee>
			<employees-table :installation_id="installation_id" :adr="false" @reload_dash="reload_dash_employee = true">
			</employees-table>
		</template>
		<!-- ------------------------------------------------------- -->
		<template v-if="currentStep == number('Mercancías')">
			<div>
				<material-table :installation_id="installation_id"></material-table>
			</div>
			<div class="mt-5">
				<material-table :installation_id="installation_id" residue="true" title="Residuos"></material-table>
			</div>
		</template>
		<!-- ------------------------------------------------------- -->
		<template v-if="currentStep == number('Vehiculos')">
			<div>
				<vehicles-table :transported="isTransported" :installation_id="installation_id"></vehicles-table>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == number('Subcontratistas')">
			<div>
				<subcontractor-table :installation_id="installation_id"></subcontractor-table>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<div class="mt-4 row mx-0 justify-content-end">
			<base-button type="default" @click="currentStep--" v-if="currentStep !== 1">Anterior</base-button>
			<base-button type="default" @click="handleNext" v-if="currentStep < steps.length">Siguiente</base-button>
			<base-button type="default" :outline="true" @click="handleClose">Cerrar
			</base-button>
		</div>
	</div>
</template>

<script>
import service from "../../store/services/model-service";
import dataService from "@/store/services/data-service";
import MaterialTable from "../Materials/MaterialTable.vue";
import VehiclesTable from "../Vehicle/VehiclesTable.vue";
import SubcontractorTable from "../Subcontractor/SubcontractorTable.vue";
import EmployeesTable from "../Employee/EmployeesTable.vue";
import utils from "@/mixins/utils-mixin";

import DashboardEmployee from "../Dashs/DashboardEmployee.vue";
import { filter, forEach, isEmpty, isEqual, isUndefined, map } from "lodash";
import { useStore } from "vuex";
import FormEmployee from "../Employee/FormEmployee.vue";
import AddressSelect from "../core_components/AddressSelect.vue";
import GeneralData from "./Modules/GeneralData.vue";
import ResponsibleModal from "../Employee/ResponsibleModal.vue";
import { useRouter } from 'vue-router';
import { computed, ref, watch } from '@vue/runtime-core';
import { toast, swal } from "../../boot/plugins";
import functions from "../../utils/functions";
import Modal from '../core_components/Modal.vue';
import FormSectionLoader from '../../loaders/FormSectionLoader.vue';

export default {
	name: "installation-show",
	components: {
		MaterialTable,
		VehiclesTable,
		SubcontractorTable,
		EmployeesTable,
		DashboardEmployee,
		// eslint-disable-next-line vue/no-unused-components
		FormEmployee,
		AddressSelect,
		GeneralData,
		ResponsibleModal,
		Modal,
		FormSectionLoader
	},
	mixins: [utils],
	props: {
		installation_id: {
			required: true,
		},
	},
	setup(props, { emit }) {
		const model = ref(null)
		const new_document = ref({
			value: null,
			new: false,
			base64: "",
		})
		const modal = ref(false)
		const addResponsible = ref(false)
		const reload_dash_employee = ref(false)
		const update = ref({
			op: false,
			dep: false,
			eqp: false,
		})
		const equips = ref([])
		const oper = ref([])
		const deps = ref([])
		const steps = ref({})
		const original_model = ref(null)
		const currentStep = ref(1)
		const operations = ref([])
		const deposits = ref([])
		const equipments = ref([])
		const responsibles = ref(null)
		const responsible_id = ref(null)
		const editModal = ref(false)
		const show = ref(false)
		const responsiblesModal = ref(null)
		const store = useStore();
		const router = useRouter;
		const role = computed(() => store.getters.ROLE)
		const isTransported = computed(() => {
			let check = false;
			for (let i = 0; i < model.value.operations.length; i++) {
				const op = model.value.operations[i];
				if (op.id == 5) {
					check = true;
				}
			}
			return check;
		})
		const hasTransportedOper = computed(() => {
			let has = false
			forEach(model.value.operations, function (op) {
				if (op.id == 5) {
					has = true
				}
			});
			return has;
		})
		const queryParams = computed(() => {
			return role.value == 'admin' ? model.value?.company?.administrable_id : null
		})

		async function getInst() {
			try {
				const res = await service.show(
					"installation",
					props.installation_id,
					"includes[]=operations&includes[]=equipments" +
					"&includes[]=auditable.user" +
					"&includes[]=depositTypes" +
					"&includes[]=firm_document" +
					"&includes[]=auditor_document" +
					"&includes[]=company"
				);

				model.value = functions.assignSchema('installation', res.data.data, ['address']);
				// model.value.file_document = null;
				model.value.auditable_id = null;


				model.value.responsible = null;
				model.value.hasTransport = model.value.hasTransport ? model.value.hasTransport : null;

				original_model.value = functions.copy(model.value);

				show.value = true
				emit("installation", model.value);
			} catch (err) {
				console.log(err);
			}
		}

		function showResponsible(id) {
			editModal.value = true
			responsible_id.value = id
		}

		function formatResponsibles(employees) {
			return employees.map((res) => {
				let employee = functions.assignSchema('employee', res)
				let f_doc = null;
				forEach(employee?.documents, (doc) => {
					if (doc.type.name == "CERTIFICADO") {
						f_doc = doc;
					}
				});
				if (!isEmpty(employee)) {
					employee.formation_document = f_doc;
				}
				return employee;
			});
		}

		async function getResponsibles() {
			const custom_where = JSON.stringify({
				is_representative: 1,
				installation_id: props.installation_id
			})
			const res = await service.api({ url: 'employees?with[]=formations&with[]=firm_document&custom_wheres=' + custom_where })
			responsibles.value = formatResponsibles(res.data.data)
			console.log(res.data.data);
		}

		async function handleNext() {
			if (currentStep.value == 1) {
				let data = {
					name: model.value.name,
					address: model.value.address,
					periodicity: model.value.periodicity,
					province_id: model.value.province_id
				};
				if (!isEmpty(model.value.file_document.base64)) {
					data.file_document = model.value.file_document;
				}

				if (model.value.auditable_id || (model.value.auditable && !model.value.auditor_document)) {
					data.auditable_id = model.value.auditable_id ? model.value.auditable_id : model.value.auditable.user.id;
					if (!isEmpty(model.value.file_auditor.base64)) {
						data.file_auditor = model.value.file_auditor;
					}
				}

				if (!isEqual(model.value, original_model.value)) {
					try {
						data = functions.cleanData(data)
						await service.update("installation", props.installation_id, data);
						emit("reload");
						await getInst();
					} catch (err) {
						toast.error("No se pudieron guardar los cambios.");
						return;
					}
				}
			}

			if (currentStep.value == 2) {
				let data = {};

				if (update.value.op) {
					data.operation_types_ids = oper.value;


				}
				if (update.value.eqp) {
					data.equipments_ids = equips.value;
				}
				if (update.value.dep) {
					data.deposit_types_ids = deps.value;
				}

				if (update.value.op || update.value.eqp || update.value.dep) {
					let result = true
					if (hasTransportedOper.value && !oper.value.includes(5)) {
						result = await swal({
							title: "¿Esta seguro?",
							icon: 'question',
							text: "Si deselecciona la operación de transporte se eliminaran los vehiculos asociados a esta instalación, ¿esta seguro?",
							showCancelButton: true
						}).then(res => {
							if (!res.isConfirmed) {
								return false
							} else {
								return true
							}
						})
					}
					try {
						if (result) {
							await service.update("installation", props.installation_id, data);
							emit("reload");
							await getInst();
							update.value.op = false;
							update.value.eqp = false;
							update.value.dep = false;
						}
					} catch (err) {
						toast.error("No se pudieron guardar los cambios.");
						return;
					}
				}
			}

			currentStep.value++;
		}

		function handleClose() {
			if (store.state.is_business) {
				router.back()
			} else {
				emit("close");
			}
		}

		async function loadOperations() {
			const res = await dataService.getOperations();
			const data = res.data.data;
			let ids = [];
			let operations_data = map(data, (operation) => {
				let checked = false;
				return { value: operation.id, label: operation.name, checked: checked };
			});
			for (let i = 0; i < model.value.operations.length; i++) {
				const op = model.value.operations[i];
				ids.push(op.id);
			}
			oper.value = ids;
			operations.value = operations_data;
			return;
		}

		async function loadDeposits() {
			const res = await dataService.getDeposits();
			const data = res.data.data;
			let ids = [];
			let deposits_data = map(data, (deposit) => {
				let checked = false;
				return { value: deposit.id, label: deposit.name, checked: checked };
			});
			for (let i = 0; i < model.value.deposit_types.length; i++) {
				const op = model.value.deposit_types[i];
				ids.push(op.id);
			}
			deps.value = ids;
			deposits.value = deposits_data;
			return;
		}

		async function loadEquipments() {
			const res = await dataService.getEquipments();
			const data = res.data.data;
			let ids = [];
			let equipments_data = map(data, (equipment) => {
				return { value: equipment.id, label: equipment.name, checked: false };
			});
			for (let i = 0; i < model.value.equipments.length; i++) {
				const eq = model.value.equipments[i];
				ids.push(eq.id);
			}
			equips.value = ids;
			equipments.value = equipments_data;
			return;
		}

		function formatSteps() {
			let steps_data = [
				"Instalacion",
				"Operaciones",
				"Empleados",
				"Mercancías",
				"Vehiculos",
				"Subcontratistas",
			];
			let format_steps = [];
			let count = 1;
			forEach(steps_data, function (s) {
				if (
					role.value == "business"
					// &&
					// s != "Empleados" &&
					// s != "Materiales" &&
					// s != "Vehiculos"
				) {
					format_steps.push({
						number: count,
						title: s,
						valid: false,
					});
					count++;
				} else if (role.value != "business") {
					format_steps.push({
						number: count,
						title: s,
						valid: false,
					});
					count++;
				}
			});
			steps.value = format_steps;
		}

		function number(query) {
			const step = filter(steps.value, function (s) {
				return s.title == query;
			});
			return isUndefined(step[0]) ? 0 : step[0].number;
		}

		getInst();
		getResponsibles()
		formatSteps();


		watch(() => oper.value, (v) => {
			let oper_ids = functions.pluck(model.value.operations, "id");
			update.value.op = !isEqual(v, oper_ids);
		})

		watch(() => equips.value, (v) => {
			let equip_ids = functions.pluck(model.value.equipments, "id");
			update.value.eqp = !isEqual(v, equip_ids);
		})
		watch(() => deps.value, (v) => {
			let deps_ids = functions.pluck(model.value.deposit_types, "id");
			update.value.dep = !isEqual(v, deps_ids);
		})
		// watch(() => new_auditable.value, (v) => {
		// 	if (!isUndefined(v.id)) {
		// 		model.value.auditable_id = v.id;
		// 	}
		// })
		watch(() => currentStep.value, (v) => {
			console.log(v);
			if (v == 2) {
				loadOperations();
				loadEquipments();
				loadDeposits();
			}
		})
		watch(() => role.value, (v) => {
			if (v != false) {
				formatSteps();
			}
		})
		watch(() => modal.value, (v) => {
			if (!v) {
				getResponsibles()
			}
		})

		return {
			model,
			new_document,
			update,
			modal,
			addResponsible,
			reload_dash_employee,
			equips,
			oper,
			deps,
			steps,
			original_model,
			currentStep,
			operations,
			deposits,
			equipments,
			responsibles,
			show,
			responsiblesModal,
			isTransported,
			queryParams,
			role,
			editModal,
			responsible_id,

			handleClose,
			showResponsible,
			number,
			loadEquipments,
			loadDeposits,
			loadOperations,
			handleNext
		};
	}
};
</script>