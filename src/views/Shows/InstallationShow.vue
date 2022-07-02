<template>
	<div>
		<base-steps :currentStep="currentStep" listClasses="mb-md-4 pb-md-2" :steps="steps" :edit="true"
			@step="currentStep = $event" @navigate="currentStep = $event"></base-steps>
		<template v-if="currentStep == number('Instalacion') && show">
			<div class="row border rounded border-light bg-white px-4 py-2">
				<div class="col-12">
					<h4>Datos principales</h4>
				</div>
				<div :class="ROLE != 'auditor' && ROLE != 'business' ? 'col-lg-4' : 'col-lg-6'">
					<base-field name="name" label="Nombre de instalacion">
						<field-validate type="text" class="form-control" name="name" rules="required" label="Nombre"
							v-model="model.name" />
					</base-field>
				</div>
				<div class="col-lg-4" v-if="ROLE != 'auditor' && ROLE != 'business'">
					<base-field name="auditable" label="Auditor">
						<div v-if="!new_auditable.new && model.auditable != null">
							<span class="mr-md-4 text-uppercase">{{ model.auditable.user.full_name }}</span>
							<base-button v-if="!this.$store.state.is_auditor" @click="new_auditable.new = true"
								size="sm" type="default" :outline="true"><i class="fa-solid fa-pencil"></i>
							</base-button>
						</div>
						<div v-else-if="new_auditable.new || model.auditable == null">
							<field-validate name="auditable" label="Auditor" rules="required">
								<async-select @selected="new_auditable.value = $event" :roles="[2, 3]" :list="true"
									:params="queryParams">
								</async-select>
							</field-validate>
							<div class="mt-md-2" @click="handleForm" v-if="new_auditable.new">
								<base-button @click="handleCancel('auditable')" size="sm" type="danger" :outline="true">
									<i class="fa-solid fa-rotate-left"></i>
								</base-button>
							</div>
						</div>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="periodicy" label="Periodicidad de visitas">
						<field-validate class="form-control" as="select" name="periodicy" rules="required"
							label="periodicidad" v-model="model.periodicity">
							<option value="" selected>Selecciona una periodicidad</option>
							<option value="ANUAL">ANUAL</option>
							<option value="BIANUAL">BIANUAL</option>
						</field-validate>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="file_document" label="Documentacion">
						<div v-if="(model.documents.length >= 1) & !new_document.new">
							<a class="mr-md-4" @click.prevent="getDocument(model.documents[0].id)">
								{{ model.documents[0].name_document ?? model.documents[0].type.name }}
							</a>
							<base-button @click="new_document.new = true" size="sm" type="default" :outline="true"><i
									class="fa-solid fa-pencil"></i></base-button>
						</div>
						<field-validate v-show="new_document.new || model.documents.length < 1" class="form-control"
							type="file" name="file_document" rules="ext:pdf" :validateOnInput="true"
							label="documentacion" v-model="model.file_document" />
						<div class="mt-md-2">
							<base-button v-if="new_document.new" @click="handleCancel('document')" size="sm"
								type="danger" :outline="true"><i class="fa-solid fa-rotate-left"></i></base-button>
						</div>
					</base-field>
				</div>

			</div>

			<address-select
				v-model:address="model.address.address" 
				v-model:city="model.address.city" 
				v-model:code="model.address.code" 
				v-model:country="model.address.country" 
			/>
			<!-- </form-validate> -->

			<div class="row border rounded border-light bg-white px-1 py-1 mt-md-4 mt-2">
				<div class="col-md-12 py-2">
					<div class="d-flex justify-content-between">
						<h4>Responsable de la instalación</h4>
						<div class="">
							<base-button v-if="responsible?.id" size="sm" @click="modal = true">Editar</base-button>
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
							<tr v-if="responsible?.id">
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
							<tr v-else>
								<td colspan="5">Sin responsable</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<modal v-if="modal" v-model:show="modal" action="editar" modalClasses="modal-xl" model="empleado">
				<form-employee @close="modal = false" @reload="index()" :employee_id="responsible?.id"></form-employee>
			</modal>
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
		<div class="mt-4 float-md-right">
			<base-button type="default" @click="currentStep--" v-if="currentStep !== 1">Anterior</base-button>
			<base-button type="default" @click="handleNext" v-if="currentStep < steps.length">Siguiente</base-button>
			<base-button type="default" :outline="true" class="ml-auto" @click="handleClose">Cerrar
			</base-button>
		</div>
	</div>
</template>

<script>
import service from "../../store/services/model-service";
import dataService from "@/store/services/data-service";
import MaterialTable from "@/views/Tables/MaterialTable.vue";
import VehiclesTable from "@/views/Tables/VehiclesTable.vue";
import SubcontractorTable from "@/views/Tables/SubcontractorTable.vue";
import EmployeesTable from "../Tables/EmployeesTable.vue";
import utils from "@/mixins/utils-mixin";

import DashboardEmployee from "../../components/Dashs/DashboardEmployee.vue";
import { filter, forEach, isArray, isEmpty, isEqual, isUndefined, map } from "lodash";
import { mapGetters } from "vuex";
import FormEmployee from "../../components/forms/FormEmployee.vue";
import AsyncSelect from '../../components/AsyncSelect.vue';
import AddressSelect from "../../components/AddressSelect.vue";

export default {
	name: "installation-show",
	components: {
    MaterialTable,
    VehiclesTable,
    SubcontractorTable,
    EmployeesTable,
    DashboardEmployee,
    FormEmployee,
    AsyncSelect,
    AddressSelect
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
			modal: false,
			original_model: null,
			new_auditable: {
				new: false,
				value: null,
			},
			currentStep: 1,
			operations: [],
			deposits: [],
			equipments: [],
			responsible: null,
			show: false
		};
	},
	async beforeCreate() { },
	created() {
		this.getInst();
		this.formatSteps();
	},
	methods: {
		async getInst() {
			try {
				const res = await service.show(
					"installation",
					this.installation_id,
					"includes[]=operations&includes[]=equipments" +
					"&includes[]=auditable.user&includes[]=documents.type" +
					"&includes[]=province&includes[]=depositTypes" +
					"&includes[]=responsible.firm_document" +
					"&includes[]=company"
				);

				this.model = this.$functions.assignSchema('installation', res.data.data, ['address']);
				console.log('keinher', this.model);
				this.responsible = this.$functions.assignSchema('employee', res.data.data?.responsible);
				this.model.file_document = null;
				this.model.auditable_id = null;

				let f_doc = null;
				forEach(this.responsible?.documents, (doc) => {
					if (doc.type.name == "CERTIFICADO") {
						f_doc = doc;
					}
				});
				if (!isEmpty(this.responsible)) {
					this.responsible.formation_document = f_doc;
				}

				this.model.responsible = null;

				this.original_model = this.$functions.copy(this.model);

				this.show = true
				this.$emit("installation", this.model);
			} catch (err) {
				console.log(err);
			}
		},
		async handleNext() {
			if (this.currentStep == 1) {
				let data = {
					name: this.model.name,
					address: this.model.address,
					periodicity: this.model.periodicity,
					province_id: this.model.province_id
				};
				if (
					this.new_document.new ||
					(this.model.documents < 1 && isArray(this.model.file_document))
				) {
					data.file_document = {
						base64: await this.toBase64(this.model.file_document[0]),
						file_name: this.model.file_document[0].name
					};
				}
				if (this.new_auditable.new || this.model.auditable == null) {
					data.auditable_id = this.model.auditable_id;
				}

				if (!isEqual(this.model, this.original_model)) {
					try {
						data = this.$functions.cleanData(data)
						await service.update("installation", this.installation_id, data);
						this.$emit("reload");
						await this.getInst();
						this.resetNews();
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
		resetNews() {
			this.new_auditable = {
				new: false,
			};
			this.new_document = {
				new: false,
			};
			this.model.file_document = null;
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
		formation_doc() {
			return this.$functions.filterDoc(this.responsible.documents, "CERTIFICADO");
		},
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
			return this.ROLE == 'admin' ? '&delegate_id=' + this.model?.company?.administrable_id : null
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
	},
};
</script>