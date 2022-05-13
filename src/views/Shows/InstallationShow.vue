<template>
	<div>
		<base-steps
			:currentStep="currentStep"
			listClasses="mb-md-4 pb-md-2"
			:steps="steps"
			@step="currentStep = $event"
		></base-steps>
		<template v-if="currentStep == 1">
			<form-validate
				@submit="onSubmit"
				ref="form"
				v-slot="{ meta }"
				v-if="model != null"
				:initial-values="{
					auditable: null,
					province_id: null,
					file_document: null,
				}"
			>
				<div class="row border rounded border-light px-4 py-2">
					<div class="col-lg-4">
						<base-field name="name" label="Nombre de instalacion">
							<field-validate
								type="text"
								class="form-control"
								name="name"
								rules="required"
								label="Nombre"
								v-model="model.name"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="address" label="Direccion">
							<field-validate
								type="text"
								class="form-control"
								name="address"
								rules="required"
								label="direccion"
								v-model="model.address"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="auditable" label="Auditor">
							<div v-if="!new_auditable.new">
								<span class="mr-md-4 text-uppercase"
									>{{ model.auditable.user.name }}
									{{ model.auditable.user.last_name }}</span
								>
								<base-button
									@click="new_auditable.new = true"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<div v-show="new_auditable.new">
								<field-validate
									name="auditable"
									label="Auditor"
									v-slot="{ field }"
									v-model="new_auditable.value"
								>
									<Multiselect
										:searchable="true"
										v-bind="field"
										:min-chars="2"
										:delay="500"
										:required="true"
										:options="fetchItems"
										:resolve-on-load="false"
										ref="multiselect"
										@select="new_auditable.value = $event"
									>
									</Multiselect>
								</field-validate>
								<div class="mt-md-2" @click="handleForm">
									<base-button
										@click="handleCancel(new_auditable)"
										size="sm"
										type="danger"
										:outline="true"
										><i class="fa-solid fa-rotate-left"></i
									></base-button>
								</div>
							</div>
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="province_id" label="Provincia">
							<div v-if="!new_province.new">
								<base-input :view="true" lable="Provincia">
									{{ model.province.name }}

									<base-button
										@click="new_province.new = true"
										size="sm"
										type="default"
										:outline="true"
										><i class="fa-solid fa-pencil"></i
									></base-button>
								</base-input>
							</div>
							<field-validate
								v-show="new_province.new"
								:standalone="vare"
								class="form-control"
								as="select"
								name="province_id"
								label="Provincia"
								v-model="new_province.value"
							>
								<option value="" selected>Selecciona una provincia</option>
								<option
									v-for="province in provinces"
									:key="province.id"
									:value="province.id"
								>
									{{ province.name }}
								</option>
							</field-validate>
							<div class="mt-md-2">
								<base-button
									v-if="new_province.new"
									@click="handleCancel(new_province)"
									size="sm"
									type="danger"
									:outline="true"
									><i class="fa-solid fa-rotate-left"></i
								></base-button>
							</div>
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="file_document" label="Documentacion">
							<div v-if="(model.documents.length >= 1) & !new_document.new">
								<a
									class="mr-md-4"
									@click.prevent="getDocument(model.documents[0].id)"
								>
									{{ model.documents[0].type.name }}
								</a>
								<base-button
									@click="new_document.new = true"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<field-validate
								v-show="new_document.new"
								class="form-control"
								type="file"
								name="file_document"
								rules="ext:pdf"
								:validateOnInput="true"
								label="documentacion"
								v-model="new_document.value"
							/>
							<div class="mt-md-2">
								<base-button
									v-if="new_document.new"
									@click="handleCancel(new_document)"
									size="sm"
									type="danger"
									:outline="true"
									><i class="fa-solid fa-rotate-left"></i
								></base-button>
							</div>
						</base-field>
					</div>
					<base-button
						type="default"
						nativeType="submit"
						@click="this.touched = meta.dirty"
						v-if="meta.dirty"
					>
						Actualizar
					</base-button>
				</div>
			</form-validate>
			<div class="row border rounded border-light px-1 py-1 mt-md-4 mt-2">
				<div class="col-md-12">
					<h4>Responsable de la instalación</h4>
				</div>
				<div class="col-md-12 overflow-auto p-0">
					<table class="table table-sm"> 
						<thead>
							<tr>
								<th>RESPONSABLE</th>
								<th>DNI</th>
								<th>MÓVIL</th>
								<th>EMAIL</th>
								<th>FORMACIÓN</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{{ responsible.name }} {{ responsible.last_name }}</td>
								<td>{{ responsible.dni }}</td>
								<td>{{ responsible.phone_number }}</td>
								<td>{{ responsible.email }}</td>
								<td>
									<div v-if="responsible.formation_document != null">
										<span class="d-block">{{
											this.formatDate(
												row.item.formation_document.document_date,
												"GB"
											)
										}}</span>
										<a
											href="#"
											class="text-uppercase d-block"
											@click.prevent="
												getDocument(row.item.formation_document.id)
											"
										>
											<i class="fa fa-file-pdf" aria-hidden="true"></i>
											{{ row.item.formation_document.type.name }}
										</a>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 2">
			<div>
				<form-validate
					@submit="onSubmit"
					ref="form"
					v-slot="{ meta }"
					v-if="model != null"
				>
					<div class="d-flex justify-content-end mb-md-2">
						<base-button
							@click="update = !update"
							type="default"
							size="sm"
							:outline="true"
							>{{ update ? "Cancelar" : "Editar" }}</base-button
						>
					</div>
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
											<div class="form-check">
												<input
													class="form-check-input"
													type="checkbox"
													:value="operation.value"
													v-model="oper"
													:disabled="!update"
													:checked="operation.checked"
												/>
												<label class="form-check-label" for="flexCheckDefault">
													{{ operation.label }}
												</label>
											</div>
										</div>
									</base-field>
									<field-validate
										v-show="false"
										v-model="oper"
										name="operation_ids"
										rules="required"
									/>
								</div>
								<div class="col-lg-6">
									<base-field name="deposits" label="Tipos de depósitos">
										<div
											v-for="deposit in deposits"
											:key="deposit.key"
											class="form-check"
										>
											<div class="form-check">
												<input
													class="form-check-input"
													type="checkbox"
													:value="deposit.value"
													v-model="deps"
													:disabled="!update"
													:checked="deposit.checked"
												/>
												<label class="form-check-label" for="flexCheckDefault">
													{{ deposit.label }}
												</label>
											</div>
										</div>
									</base-field>
									<field-validate
										v-show="false"
										v-model="oper"
										name="operation_ids"
										rules="required"
									/>
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
									<div class="form-check ml-3">
										<input
											class="form-check-input"
											type="checkbox"
											:value="equipment.value"
											v-model="equips"
											:disabled="!update"
											:checked="equipment.checked"
										/>
										<label class="form-check-label" for="flexCheckDefault">
											{{ equipment.label }}
										</label>
									</div>
								</div>
								<field-validate
									v-show="false"
									v-model="equips"
									name="equips_ids"
									rules="required"
								/>
							</base-field>
						</div>
					</div>
					<div class="mt-md-2">
						<base-button
							type="default"
							nativeType="submit"
							size="sm"
							v-if="update"
							:disabled="!meta.valid"
						>
							Actualizar
						</base-button>
					</div>
				</form-validate>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 3">
			<dashboard-employee :id="installation_id"></dashboard-employee>
			<employees-table
				:installation_id="installation_id"
				:adr="true"
			></employees-table>
		</template>
		<!-- ------------------------------------------------------- -->
		<template v-if="currentStep == 4">
			<div>
				<material-table :installation_id="installation_id"></material-table>
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
		<template v-if="currentStep == 5">
			<div>
				<vehicles-table :installation_id="installation_id"></vehicles-table>
			</div>
		</template>
		<!-- ------------------------------------------------------ -->
		<template v-if="currentStep == 6">
			<div>
				<subcontractor-table
					:installation_id="installation_id"
				></subcontractor-table>
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
				@click="currentStep++"
				v-if="currentStep < steps.length"
				>Siguiente</base-button
			>
			<base-button
				type="default"
				:outline="true"
				class="ml-auto"
				@click="handleClose"
				>Cerrar
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
	import Multiselect from "@vueform/multiselect";
	import EmployeesTable from "../Tables/EmployeesTable.vue";
	import utils from "@/mixins/utils-mixin";

	import DashboardEmployee from "../../components/Dashs/DashboardEmployee.vue";
	import _ from "lodash";
	import { mapGetters } from "vuex";

	export default {
		components: {
			Multiselect,
			MaterialTable,
			VehiclesTable,
			SubcontractorTable,
			EmployeesTable,
			DashboardEmployee,
		},
		name: "installation-show",
		mixins: [utils],
		props: {
			installation_id: {
				required: true,
			},
		},
		data() {
			return {
				vare: false,
				model: null,
				new_document: {
					value: null,
					new: false,
					base64: "",
				},
				update: false,
				equips: [],
				oper: [],
				deps: [],
				steps: [
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
						title: "Empleados",
						valid: false,
					},
					{
						number: 4,
						title: "Materiales",
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
				],
				new_auditable: {
					new: false,
					value: null,
				},
				new_province: {
					new: false,
					value: null,
				},
				currentStep: 1,
				provinces: [],
				operations: [],
				deposits: [],
				equipments: [],
				responsible: null,
			};
		},
		async created() {
			await this.getInst();
			await this.loadProvinces();
			this.loadOperations();
			this.loadEquipments();
			this.loadDeposits();
		},
		methods: {
			async onSubmit() {
				let data = [];

				if (this.currentStep == 1) {
					data = {
						name: this.model.name,
						address: this.model.address,
					};
					if (this.new_document.new) {
						data.file_document = {
							base64: await this.toBase64(this.new_document.value[0]),
						};
					}
					if (this.new_auditable.new) {
						data.auditable_id = this.new_auditable.value.id;
					}
					if (this.new_province.new) {
						data.province_id = this.new_province.value;
					}
				}

				if (this.currentStep == 2) {
					data = {
						operation_types_ids: this.oper,
						equipments_ids: this.equips,
						deposit_types_ids: this.deps,
					};
				}

				try {
					await service.update("installation", this.installation_id, data);
					this.$toast.success("Datos actualizados");
					await this.getInst();
					this.resetNews();
				} catch (err) {
					this.$toast.error("No se pudieron guardar los cambios.");
				}
			},
			async getInst() {
				try {
					const res = await service.show(
						"installation",
						this.installation_id,
						"includes[]=operations&includes[]=equipments&includes[]=auditable.user&includes[]=documents.type&includes[]=province&includes[]=depositTypes" +
							"&responsible=true"
					);
                    this.model = this.COPY(res.data.data);
					this.responsible = this.COPY(res.data.data.responsible);
                    let f_doc = null;
                    _.forEach(this.responsible.documents, (doc) => {
							if (doc.type.name == "CERTIFICADO") {
								f_doc = doc;
							}
						});
                    this.responsible.formation_document = f_doc;

					this.model.responsible = null;
				} catch (err) {
					console.log(err);
				}
			},
			handleClose() {
				this.$emit("close");
			},
			async loadProvinces() {
				const res = await dataService.getProvinces();
				this.provinces = res.data.data;
			},
			async fetchItems(search) {
				const res = await service.getIndex(
					"auditor",
					1,
					`name=${search}&includes[]=user`
				);
				const data = res.data.data;
				let options = [];
				for (let i = 0; i < data.length; i++) {
					const auditor = data[i];
					if (auditor.id != this.model.auditable.id) {
						options.push({
							value: auditor,
							label: `${auditor.user.name} ${auditor.user.last_name} - ${auditor.dni}`,
						});
					}
				}
				return options;
			},
			async loadOperations() {
				const res = await dataService.getOperations();
				const data = res.data.data;
				let ids = [];
				let operations = _.map(data, (operation) => {
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
				let deposits = _.map(data, (deposit) => {
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
				let equipments = _.map(data, (equipment) => {
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
			handleCancel(modell) {
				modell.new = false;
				modell.value = null;
			},
			resetNews() {
				this.new_auditable = {
					new: false,
					value: null,
				};
				this.new_province = {
					new: false,
					value: null,
				};
				this.new_document = {
					value: null,
					new: false,
					base64: "",
				};
				this.update = false;
			},
		},
		computed: {
			...mapGetters(["COPY"]),
		},
	};
</script>