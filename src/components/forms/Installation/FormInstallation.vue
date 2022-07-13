<template>
	<div>
		<form-validate ref="form" @submit="onSubmit" v-slot="{ resetForm, meta }">
			<base-steps
				:currentStep="currentStep"
				listClasses="mb-md-4 pb-md-2"
				:steps="steps"
				:meta="meta"
				@step="currentStep = $event"
			></base-steps>
			<template v-if="currentStep == 1">
				<div class="row border rounded border-light px-4 py-2">
					<div class="col-12">
						<h4>Datos principales</h4>
					</div>
					<div class="col-lg-4">
						<base-field name="name" label="Nombre de instalación">
							<field-validate
								:disabled="isSaved"
								type="text"
								class="form-control"
								name="name"
								rules="required"
								label="Nombre"
								v-model="model.name"
							/>
						</base-field>
					</div>
					<div class="col-lg-4" v-if="ROLE != 'auditor' && ROLE != 'business'">
						<base-field name="auditable" label="Auditor">
							<div v-if="model.auditable != null">
								<span class="mr-md-4 text-uppercase"
									>{{ model.auditable.name }}
									{{ model.auditable.last_name }}</span
								>
								<base-button
									@click="model.auditable = null"
									size="sm"
									type="default"
									:outline="true"
									:disabled="isSaved"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<div v-else>
								<field-validate
									name="auditable"
									label="Auditor"
									rules=""
									v-model="model.auditable"
								>
									<async-select
										@selected="model.auditable = $event"
										:roles="[2, 3]"
										:disabled="isSaved"
										:params="`&delegate_id=${delegate_id}`"
									>
									</async-select>
								</field-validate>
							</div>
						</base-field>
					</div>
					<div class="col-lg-4" v-if="ROLE != 'business'">
						<base-field name="periodicy" label="Periodicidad de visitas">
							<field-validate
								:disabled="isSaved"
								class="form-control"
								as="select"
								name="periodicy"
								rules=""
								label="periodicidad"
								v-model="model.periodicity"
							>
								<option value="" selected>Selecciona una periodicidad</option>
								<option value="ANUAL">ANUAL</option>
								<option value="BIANUAL">BIANUAL</option>
							</field-validate>
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="file_document" label="Alta Instalación">
							<div v-if="model.file_document.file.length >= 1">
								<span class="mr-md-4">{{
									model.file_document.file[0].name
								}}</span>
								<base-button
									@click="model.file_document.file = []"
									size="sm"
									type="default"
									:outline="true"
									:disabled="isSaved"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<field-validate
								:disabled="isSaved"
								v-show="!model.file_document.file.length >= 1"
								class="form-control"
								type="file"
								name="file_document"
								rules="ext:pdf"
								:validateOnInput="true"
								label="alta Instalación"
								v-model="model.file_document.file"
							/>
						</base-field>
					</div>
				</div>

				<address-select
					v-model:address="model.address.address"
					v-model:city="model.address.city"
					v-model:code="model.address.code"
					v-model:country="model.address.country"
				/>
			</template>
			<!-- ------------------------------------------------------ -->
			<template v-if="currentStep == 2">
				<div>
					<div class="row border rounded border-light px-4 py-2">
						<div class="col-lg-12">
							<div class="row">
								<div class="col-lg-6">
									<base-field name="operations" label="Tipos de operaciones">
										<div
											v-for="operation in operations"
											:key="operation.key"
											class="form-check"
										>
											<field-validate
												:disabled="isSaved"
												type="checkbox"
												name="operations"
												class="form-check-input"
												:value="operation.value"
												v-model="model.operation_types_ids"
												rules=""
												label="operaciones"
											>
											</field-validate>
											<label for="" class="form-check-label">{{
												operation.label
											}}</label>
										</div>
									</base-field>
								</div>
								<div class="col-lg-6">
									<base-field name="deposits" label="Tipos de depósitos">
										<div
											v-for="deposit in deposits"
											:key="deposit.key"
											class="form-check"
										>
											<field-validate
												:disabled="isSaved"
												type="checkbox"
												name="deposits"
												class="form-check-input"
												:value="deposit.value"
												v-model="model.deposit_types_ids"
												rules=""
												label="depósitos"
											>
											</field-validate>
											<label for="" class="form-check-label">{{
												deposit.label
											}}</label>
										</div>
									</base-field>
								</div>
							</div>
						</div>
					</div>
					<div class="row border rounded border-light px-4 py-2 mt-3">
						<div class="col-lg-12">
							<base-field
								name="equipments"
								label="Tipos de equipamientos"
								labelClasses="d-block"
							>
								<div
									v-for="equipment in equipments"
									:key="equipment.key"
									class="d-inline-block"
								>
									<field-validate
										:disabled="isSaved"
										type="checkbox"
										name="equipments"
										:value="equipment.value"
										v-model="model.equipments_ids"
										rules=""
										label="equipamientos"
									>
									</field-validate>
									<label for="" class="mx-4">{{ equipment.label }}</label>
								</div>
							</base-field>
						</div>
					</div>
				</div>
			</template>
			<!-- ------------------------------------------------------ -->
			<template v-if="currentStep == 3">
				<div v-if="!isSaved">
					<div class="row border rounded border-light px-4 py-2">
						<div class="col-12 border-bottom border-light mb-md-3">
							<h4>Datos principales</h4>
						</div>
						<div class="col-lg-6 col-lg-4">
							<base-field apiName="responsible.name" name="name" label="Nombre" :required="true">
								<field-validate
									:disabled="isSaved"
									type="text"
									class="form-control"
									name="name"
									rules="required|alpha_spaces"
									label="Nombre"
									v-model="model.responsible.name"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								apiName="responsible.last_name"
								name="last_name"
								label="Apellido"
                                :required="true"
							>
								<field-validate
									:disabled="isSaved"
									type="text"
									class="form-control"
									name="last_name"
									rules="required|alpha_spaces"
									label="apellido"
									v-model="model.responsible.last_name"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field apiName="responsible.dni" name="dni" label="DNI">
								<field-validate
									:disabled="isSaved"
									type="text"
									class="form-control text-uppercase"
									name="dni"
									rules="alpha_num|min:9|max:9"
									label="dni"
									v-model="model.responsible.dni"
								/>
							</base-field>
						</div>
						<div class="col-lg-6 col-lg-4">
							<base-field
								apiName="responsible.email"
								name="email"
								label="Email"
                                :required="true"
							>
								<field-validate
									:disabled="isSaved"
									type="text"
									class="form-control"
									name="email"
									rules="required|email"
									label="email"
									v-model="model.responsible.email"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								apiName="responsible.position"
								name="position"
								label="Cargo"
							>
								<field-validate
									:disabled="isSaved"
									type="text"
									class="form-control"
									name="position"
									rules="alpha_spaces"
									label="cargo"
									v-model="model.responsible.position"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								apiName="responsible.phone_number"
								label="Movil"
								name="phone_number"
							>
								<field-validate
									:disabled="isSaved"
									type="number"
									class="form-control"
									name="phone_number"
									rules="min:5|max:15"
									label="movil"
									v-model="model.responsible.phone_number"
								/>
							</base-field>
						</div>
					</div>
					<div class="row border rounded border-light px-4 py-2 mt-3">
						<div class="col-12 border-bottom border-light mb-md-3">
							<h4>Documentacion</h4>
						</div>
						<div class="col-lg-6">
							<base-field
								apiName="responsible.date_firm"
								name="date_firm"
								label="Fecha de Alta"
							>
								<field-validate
									:disabled="isSaved"
									type="date"
									class="form-control"
									name="date_firm"
									:rules="{
										required: !$functions.empty(
											model.responsible.file_firm.file
										),
									}"
									label="fecha"
									v-model="model.responsible.date_firm"
								/>
							</base-field>
						</div>
						<div class="col-lg-6">
							<base-field
								apiName="responsible.file_firm"
								name="file_firm"
								label="Documento de Alta"
							>
								<div v-if="model.responsible.file_firm.file.length >= 1">
									<span class="mr-md-4">{{
										model.responsible.file_firm.file[0].name
									}}</span>
									<base-button
										@click="model.responsible.file_firm.file = []"
										size="sm"
										type="default"
										:outline="true"
										:disabled="isSaved"
										><i class="fa-solid fa-pencil"></i>
									</base-button>
								</div>
								<field-validate
									:disabled="isSaved"
									v-else
									type="file"
									class="form-control"
									name="file_firm"
									:rules="{
										required: !$functions.empty(model.responsible.date_firm),
									}"
									label="documento"
									v-model="model.responsible.file_firm.file"
								/>
							</base-field>
						</div>
						<!-- --------------------------------------- -->
						<div class="col-lg-12">
							<div class="row">
								<div class="col-lg-2">
									<base-switch
										v-model="model.responsible.dangerous_goods"
										:value="
											model.responsible.dangerous_goods != 0 ? true : false
										"
										:disabled="isSaved"
										label="Mercancias peligrosas"
									></base-switch>
								</div>
								<div v-if="model.responsible.dangerous_goods" class="col-lg-5">
									<base-field
										apiName="responsible.date_certification"
										name="date_cer"
										label="Fecha de formación"
									>
										<field-validate
											:disabled="isSaved"
											type="date"
											class="form-control"
											name="date_cer"
											rules="required"
											label="fecha"
											v-model="model.responsible.date_certification"
										/>
									</base-field>
								</div>
								<div v-if="model.responsible.dangerous_goods" class="col-lg-5">
									<base-field
										apiName="responsible.file_certification"
										name="file_cer"
										label="Documento de formación"
									>
										<div
											v-if="
												model.responsible.file_certification.file.length >= 1
											"
										>
											<span class="mr-md-4">{{
												model.responsible.file_certification.file[0].name
											}}</span>
											<base-button
												@click="model.responsible.file_certification.file = []"
												size="sm"
												type="default"
												:outline="true"
												:disabled="isSaved"
												><i class="fa-solid fa-pencil"></i
											></base-button>
										</div>
										<field-validate
											:disabled="isSaved"
											v-else
											type="file"
											class="form-control"
											name="file_cer"
											rules="required"
											label="documento"
											v-model="model.responsible.file_certification.file"
										/>
									</base-field>
								</div>
							</div>
						</div>
						<div class="col-lg-12" v-if="isTransported">
							<div class="row">
								<div class="col-lg-2">
									<base-switch
										:disabled="isSaved"
										v-model="model.responsible.driver"
										label="Conductor"
										:value="model.responsible.driver != 0 ? true : false"
									>
									</base-switch>
								</div>
								<div class="col-lg-3" v-if="model.responsible.driver">
									<base-field
										apiName="responsible.phone_number"
										name="adr_permit_id"
										label="Permiso ADR"
									>
										<field-validate
											:disabled="isSaved"
											as="select"
											class="form-control"
											name="adr_permit_id"
											v-model="model.responsible.adr_permit_id"
											rules="required"
										>
											<option selected>Permiso adr</option>
											<option
												:value="permit.id"
												v-for="(permit, key) in permits"
												:key="key.id"
											>
												{{ permit.name }}
											</option>
										</field-validate>
									</base-field>
								</div>
								<div class="col-lg-3" v-if="model.responsible.driver">
									<base-field
										apiName="responsible.driver_document_date"
										name="driver_date"
										label="Fecha documentacion"
									>
										<field-validate
											:disabled="isSaved"
											type="date"
											class="form-control"
											name="driver_date"
											v-model="model.responsible.driver_document_date"
											rules="required"
										>
										</field-validate>
									</base-field>
								</div>
								<div class="col-lg-4" v-if="model.responsible.driver">
									<base-field
										apiName="responsible.file_driver"
										name="file_driver"
										label="Documentacion ADR"
									>
										<div
											v-if="model.responsible.driver_document.file.length >= 1"
										>
											<span class="mr-md-4">{{
												model.responsible.driver_document.file[0].name
											}}</span>
											<base-button
												@click="model.responsible.driver_document.file = []"
												size="sm"
												type="default"
												:outline="true"
												:disabled="isSaved"
												><i class="fa-solid fa-pencil"></i
											></base-button>
										</div>
										<field-validate
											:disabled="isSaved"
											v-else
											type="file"
											class="form-control"
											name="file_driver"
											rules="required"
											label="documento"
											v-model="model.responsible.driver_document.file"
										/>
									</base-field>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<employees-table :installation_id="installation_id"></employees-table>
				</div>
			</template>
			<!-- ------------------------------------------------------- -->
			<template v-if="currentStep == 4 && isSaved">
				<div>
					<material-table
						:installation_id="installation_id"
						residue="false"
					></material-table>
				</div>
				<div class="mt-5">
					<material-table
						:installation_id="installation_id"
						residue="true"
						title="Residuos"
					></material-table>
				</div>
			</template>
			<!-- ------------------------------------------------------- -->
			<template v-if="currentStep == 5 && isSaved">
				<div>
					<vehicles-table
						:transported="isTransported"
						:installation_id="installation_id"
					></vehicles-table>
				</div>
			</template>
			<!-- ------------------------------------------------------ -->
			<template v-if="currentStep == 6 && isSaved">
				<div>
					<subcontractor-table
						:installation_id="installation_id"
					></subcontractor-table>
				</div>
			</template>
			<!-- ------------------------------------------------------ -->
			<div class="mt-4 float-md-right">
				<base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
					>Anterior</base-button
				>
				<div class="d-inline-block mx-2">
					<base-button
						type="default"
						:disabled="!meta.valid"
						nativeType="submit"
						v-if="currentStep !== 3 && currentStep < 6"
						>Siguiente</base-button
					>
				</div>
				<base-button
					type="default"
					:disabled="!meta.valid"
					nativeType="submit"
					v-if="currentStep === 3"
				>
					{{ !isSaved ? "Aceptar" : "Siguiente" }}</base-button
				>
				<base-button
					type="default"
					:outline="true"
					class="ml-auto"
					@click="handleClose(resetForm)"
					>{{ isSaved ? "Cerrar" : "Cancelar" }}
				</base-button>
			</div>
		</form-validate>
	</div>
</template>
<script>
	import dataService from "@/store/services/data-service";
	import utils from "@/mixins/utils-mixin";
	import _ from "lodash";
	import service from "@/store/services/model-service";
	import MaterialTable from "@/views/Tables/MaterialTable.vue";
	import VehiclesTable from "@/views/Tables/VehiclesTable.vue";
	import SubcontractorTable from "@/views/Tables/SubcontractorTable.vue";
	import EmployeesTable from "../../../views/Tables/EmployeesTable.vue";
	import { mapGetters } from "vuex";
	import AsyncSelect from "../../AsyncSelect.vue";
	import AddressSelect from "../../AddressSelect.vue";

	export default {
		mixins: [utils],
		components: {
			MaterialTable,
			VehiclesTable,
			SubcontractorTable,
			EmployeesTable,
			AsyncSelect,
			AddressSelect,
		},
		props: {
			business_id: {
				type: Number,
				required: true,
			},
			delegate_id: {
				type: Number,
				required: true,
			},
		},
		data() {
			return {
				isSaved: false,
				steps: [],
				installation_id: null,
				currentStep: 1,
				auditable: null,
				model: this.$functions.schemas("installation"),
				provinces: [
					{
						value: "",
						label: "",
					},
				],
				touched: false,
				operations: [],
				equipments: [],
				deposits: [],
				permits: {},
			};
		},
		mounted() {
			this.loadProvinces();
			this.initVals();
			console.log(this.delegate_id);
		},
		methods: {
			async onSubmit(values) {
				for (let index = 0; index < this.steps.length; index++) {
					const step = this.steps[index];
					if (step.number == this.currentStep) {
						step.valid = true;
					}
				}
				const inst = values;

				if (this.currentStep == 1 && !this.isSaved) {
					if (!this.$functions.empty(values.file_document)) {
						this.model.file_document.base64 = await this.toBase64(
							inst.file_document[0]
						);
						this.model.file_document.file_name = inst.file_document[0].name
					}
					this.model.auditable_id = this.model?.auditable?.id;
					if (this.isSaved) {
						return;
					}
					this.loadEquipments();
					this.loadOperations();
					this.loadDeposits();
				}

				if (this.currentStep == 2 && !this.isSaved) {
					if (this.isSaved & this.touched) {
						return;
					}
					this.loadPermits();
				}

				if (this.currentStep == 3 && !this.isSaved) {
					if (!this.$functions.empty(inst.file_firm)) {
						this.model.responsible.file_firm.base64 = await this.toBase64(
							inst.file_firm[0]
						);
						this.model.responsible.file_firm.file_name = inst.file_firm[0].name
					}
					if (this.model.responsible.driver) {
						this.model.responsible.driver_document.base64 = await this.toBase64(
							inst.file_driver[0]
						);
						this.model.responsible.driver_document.file_name = inst.file_driver[0].name

					}
					if (this.model.responsible.dangerous_goods) {
						this.model.responsible.file_certification.base64 = await this.toBase64(inst.file_cer[0]);
						this.model.responsible.file_certification.file_name = inst.file_cer[0].name
					}
				}

				if (this.currentStep === 3 && !this.isSaved) {
					this.model.business_id = this.business_id;
					try {
						const data = this.$functions.cleanData(this.model);
						const res = await service.store("installation", data);
						this.installation_id = res.data.data.id;
						this.isSaved = true;

						if (this.ROLE != "business") {
							this.toAgend(res.data.data.audit_id);
						}

						this.$emit("reload");
					} catch (error) {
						console.log(error);
						return;
					}
				}

				if (this.currentStep !== 6) {
					this.currentStep++;
				}
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
			async toAgend(id) {
				await this.$store.dispatch("toSchedule", {
					model: "audits",
					id: id,
					name: "auditoria",
				});
			},
			async loadProvinces() {
				const res = await dataService.getProvinces();
				this.provinces = res.data.data;
			},
			async loadDeposits() {
				const res = await dataService.getDeposits();
				const data = res.data.data;
				let deposits = _.map(data, (deposit) => {
					return { value: deposit.id, label: deposit.name, checked: true };
				});
				this.deposits = deposits;
			},
			async loadPermits() {
				const res = await this.getPermits();
				this.permits = res;
			},
			async loadEquipments() {
				const res = await dataService.getEquipments();
				const data = res.data.data;
				let equipments = _.map(data, (equipment) => {
					return { value: equipment.id, label: equipment.name, checked: true };
				});
				this.equipments = equipments;
				return;
			},
			async loadOperations() {
				const res = await dataService.getOperations();
				const data = res.data.data;
				let operations = _.map(data, (operation) => {
					return { value: operation.id, label: operation.name, checked: false };
				});
				this.operations = operations;
				return;
			},
			prevStep() {
				if (this.currentStep == 0 || this.currentStep == 1) {
					return;
				}
				this.currentStep--;
			},
			initVals() {
				this.steps = [
					{
						number: 1,
						title: "Instalacion",
						valid: false,
					},
					{
						number: 2,
						title: "Operaciones",
						valid: false,
					},
					{
						number: 3,
						title: !this.isSaved ? "Responsable" : "Empleados",
						valid: false,
					},
					{
						number: 4,
						title: "MERCANCÍAS ADR",
						valid: false,
					},
					{
						number: 5,
						title: "Vehiculos",
						valid: false,
					},
					{
						number: 6,
						title: "Subcontratistas",
						valid: false,
					},
				];
			},
		},
		computed: {
			...mapGetters(["CURRENT_DATE", "ROLE"]),
			isTransported() {
				let check = false;
				for (let i = 0; i < this.model.operation_types_ids.length; i++) {
					const op = this.model.operation_types_ids[i];
					console.log(op);
					if (op == 5) {
						check = true;
					}
				}
				return check;
			},
		},
	};
</script>
<style scoped>
	.nav-link.disabled {
		color: #8898aa !important;
		pointer-events: none;
		cursor: default;
	}
</style>