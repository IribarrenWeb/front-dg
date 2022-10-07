<template>
	<div>
		<base-steps :currentStep="currentStep" listClasses="mb-md-4 pb-md-2" :steps="steps" :edit="true"
			@step="currentStep = $event" @navigate="currentStep = $event"></base-steps>
		<template v-if="currentStep == number('Instalacion') && show">
			<general-data 
				v-model:file_document="model.file_document"
				v-model:file_auditor="model.file_auditor"
				v-model:auditable="model.auditable_id"
				v-model:name="model.name"
				v-model:periodicity="model.periodicity"
				:delegate_id="queryParams"
				:auditable_value="model.auditable?.user?.id"
				:firm_document="model.firm_document"
				:auditor_document="model.auditor_document"
			/>

			<address-select
				v-model:address="model.address.address" 
				v-model:city="model.address.city" 
				v-model:code="model.address.code" 
				v-model:country="model.address.country" 
				v-model:province="model.address.province" 
				v-model:comunity="model.address.comunity" 
				v-model:street_number="model.address.street_number"
			/>
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
											{{responsible?.firm_document?.name_document ?? 'ALTA'}}
										</a>
									</div>
								</td>
							</tr>
							<tr v-if="!responsibles">
								<td colspan="5">Sin responsables</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<responsible-modal v-model:show="modal" :installation_id="installation_id" />
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
			<dashboard-employee v-if="ROLE != 'business'" :reload="reload_dash_employee" @reloaded="reload_dash_employee = false"
				:id="installation_id"></dashboard-employee>
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
import { mapGetters } from "vuex";
import FormEmployee from "../Employee/FormEmployee.vue";
import AddressSelect from "../core_components/AddressSelect.vue";
import GeneralData from "./Modules/GeneralData.vue";
import ResponsibleModal from "../Employee/ResponsibleModal.vue";

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
    ResponsibleModal
},
	mixins: [utils],
	props: {
		installation_id: {
			required: true,
		},
	},
	data() {
		return {
			model: null,
			new_document: {
				value: null,
				new: false,
				base64: "",
			},
			modal: false,
			addResponsible: false,
			reload_dash_employee: false,
			update: {
				op: false,
				dep: false,
				eqp: false,
			},
			equips: [],
			oper: [],
			deps: [],
			steps: {},
			original_model: null,
			currentStep: 1,
			operations: [],
			deposits: [],
			equipments: [],
			responsibles: null,
			show: false
		};
	},
	async beforeCreate() { },
	created() {
		this.getInst();
		this.getResponsibles()
		this.formatSteps();
	},
	methods: {
		async getInst() {
			try {
				const res = await service.show(
					"installation",
					this.installation_id,
					"includes[]=operations&includes[]=equipments" +
					"&includes[]=auditable.user" +
					"&includes[]=depositTypes" +
					"&includes[]=firm_document"+
					"&includes[]=auditor_document"+
					"&includes[]=company"
				);

				this.model = this.$functions.assignSchema('installation', res.data.data, ['address']);
				// this.model.file_document = null;
				this.model.auditable_id = null;


				this.model.responsible = null;
				this.model.hasTransport = this.model.hasTransport ? this.model.hasTransport : null;

				this.original_model = this.$functions.copy(this.model);

				this.show = true
				this.$emit("installation", this.model);
			} catch (err) {
				console.log(err);
			}
		},
		formatResponsibles(employees) {
			return employees.map((res) => {
					let employee = this.$functions.assignSchema('employee', res)
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
		},
		async getResponsibles(){
			const custom_where = JSON.stringify({
				is_representative: 1,
				installation_id: this.installation_id
			})
			const res = await this.$store.dispatch('employee/get', '&with[]=formations&with[]=firm_document&custom_wheres='+custom_where)

			this.responsibles = this.formatResponsibles(res.data.data)
			console.log(res.data.data);
		},
		async handleNext() {
			if (this.currentStep == 1) {
				let data = {
					name: this.model.name,
					address: this.model.address,
					periodicity: this.model.periodicity,
					province_id: this.model.province_id
				};
				if (!isEmpty(this.model.file_document.base64)) {
					data.file_document = this.model.file_document;
				}
				
				if (this.model.auditable_id || (this.model.auditable && !this.model.auditor_document)) {
					data.auditable_id = this.model.auditable_id ? this.model.auditable_id : this.model.auditable.user.id;
					if (!isEmpty(this.model.file_auditor.base64)) {
						data.file_auditor = this.model.file_auditor;
					}
				}

				if (!isEqual(this.model, this.original_model)) {
					try {
						data = this.$functions.cleanData(data)
						await service.update("installation", this.installation_id, data);
						this.$emit("reload");
						await this.getInst();
					} catch (err) {
						this.$toast.error("No se pudieron guardar los cambios.");
						return;
					}
				}
			}

			if (this.currentStep == 2) {
				let data = {};

				if (this.update.op) {
					data.operation_types_ids = this.oper;


				}
				if (this.update.eqp) {
					data.equipments_ids = this.equips;
				}
				if (this.update.dep) {
					data.deposit_types_ids = this.deps;
				}

				if (this.update.op || this.update.eqp || this.update.dep) {
					let result = true
					if (this.hasTransportedOper && !this.oper.includes(5)) {
						result = await this.$swal({
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
							await service.update("installation", this.installation_id, data);
							this.$emit("reload");
							await this.getInst();
							this.update.op = false;
							this.update.eqp = false;
							this.update.dep = false;
						}
					} catch (err) {
						this.$toast.error("No se pudieron guardar los cambios.");
						return;
					}
				}
			}

			this.currentStep++;
		},
		handleClose() {
			if (this.$store.state.is_business) {
				this.$router.back()
			}else{
				this.$emit("close");
			}
		},
		async loadOperations() {
			const res = await dataService.getOperations();
			const data = res.data.data;
			let ids = [];
			let operations = map(data, (operation) => {
				let checked = false;
				return { value: operation.id, label: operation.name, checked: checked };
			});
			for (let i = 0; i < this.model.operations.length; i++) {
				const op = this.model.operations[i];
				ids.push(op.id);
			}
			this.oper = ids;
			this.operations = operations;
			return;
		},
		async loadDeposits() {
			const res = await dataService.getDeposits();
			const data = res.data.data;
			let ids = [];
			let deposits = map(data, (deposit) => {
				let checked = false;
				return { value: deposit.id, label: deposit.name, checked: checked };
			});
			for (let i = 0; i < this.model.deposit_types.length; i++) {
				const op = this.model.deposit_types[i];
				ids.push(op.id);
			}
			this.deps = ids;
			this.deposits = deposits;
			return;
		},
		async loadEquipments() {
			const res = await dataService.getEquipments();
			const data = res.data.data;
			let ids = [];
			let equipments = map(data, (equipment) => {
				return { value: equipment.id, label: equipment.name, checked: false };
			});
			for (let i = 0; i < this.model.equipments.length; i++) {
				const eq = this.model.equipments[i];
				ids.push(eq.id);
			}
			this.equips = ids;
			this.equipments = equipments;
			return;
		},
		formatSteps() {
			let steps = [
				"Instalacion",
				"Operaciones",
				"Empleados",
				"Mercancías",
				"Vehiculos",
				"Subcontratistas",
			];
			let format_steps = [];
			let count = 1;
			const $this = this;
			forEach(steps, function (s) {
				if (
					$this.ROLE == "business"
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
				} else if ($this.ROLE != "business") {
					format_steps.push({
						number: count,
						title: s,
						valid: false,
					});
					count++;
				}
			});
			this.steps = format_steps;
		},
		number(query) {
			const step = filter(this.steps, function (s) {
				return s.title == query;
			});
			return isUndefined(step[0]) ? 0 : step[0].number;
		},
	},
	computed: {
		...mapGetters(["ROLE", "CLEAN_DATA"]),
		isTransported() {
			let check = false;
			for (let i = 0; i < this.model.operations.length; i++) {
				const op = this.model.operations[i];
				if (op.id == 5) {
					check = true;
				}
			}
			return check;
		},
		hasTransportedOper() {
			let has = false
			forEach(this.model.operations, function (op) {
				if (op.id == 5) {
					has = true
				}
			});
			return has;
		},
		queryParams() {
			return this.ROLE == 'admin' ? this.model?.company?.administrable_id : null
		}
	},
	watch: {
		oper() {
			let oper_ids = this.$functions.pluck(this.model.operations, "id");
			this.update.op = !isEqual(this.oper, oper_ids);
		},
		equips() {
			let equip_ids = this.$functions.pluck(this.model.equipments, "id");
			this.update.eqp = !isEqual(this.equips, equip_ids);
		},
		deps() {
			let deps_ids = this.$functions.pluck(this.model.deposit_types, "id");
			this.update.dep = !isEqual(this.deps, deps_ids);
		},
		"new_auditable.value": {
			handler(newValue) {
				if (!isUndefined(newValue.id)) {
					this.model.auditable_id = newValue.id;
				}
			},
		},
		currentStep(newVal) {
			if (newVal == 2) {
				this.loadOperations();
				this.loadEquipments();
				this.loadDeposits();
			}
		},
		ROLE(newVal) {
			if (newVal != false) {
				this.formatSteps();
			}
		},
		modal(val) {
			if (!val) {
				this.getResponsibles()
			}
		}
	},
};
</script>