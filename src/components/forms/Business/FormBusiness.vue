<template>
	<div>
		<form-validate
			@submit="submit"
			@keypress.enter.prevent=""
			v-slot="{ meta, resetForm }"
		>
			<base-steps
				:currentStep="currentStep"
				listClasses="mb-md-4 pb-md-2"
				:steps="steps"
				:meta="meta"
				@step="currentStep = $event"
			></base-steps>
			<template v-if="currentStep === 1">
				<div>
					<general-data
						v-model:property_name="model.property_name"
						v-model:property_last_name="model.property_last_name"
						v-model:property_dni="model.property_dni"
						v-model:property_phone="model.property_phone"
						v-model:property_email="model.property_email"
					/>
					<business-data
						class="mt-2"
						v-model:name="model.name"
						v-model:email="model.email"
						v-model:business_nif="model.business_nif"
						v-model:business_phone="model.business_phone"
					>
						<div class="col-lg-8" v-if="ROLE == 'admin'">
							<base-field name="delegate_id" label="Delegado" :required="true">
								<div v-if="delegate != null">
									<span class="mr-md-4 text-uppercase">{{
										delegate.full_name
									}}</span>
									<base-button
										@click="delegate = null"
										size="sm"
										type="default"
										:outline="true"
										><i class="fa-solid fa-pencil"></i
									></base-button>
								</div>
								<div v-else>
									<field-validate
										name="delegate_id"
										label="Delegado"
										rules="required"
									>
										<async-select
											@selected="delegate = $event"
											params="&includes[]=delegate"
										>
										</async-select>
									</field-validate>
								</div>
							</base-field>
						</div>
					</business-data>
					
					<address-select
						v-model:address="model.address.address"
						v-model:city="model.address.city"
						v-model:code="model.address.code"
						v-model:country="model.address.country"
						v-model:province="model.address.province"
						v-model:comunity="model.address.comunity"
						v-model:street_number="model.address.street_number"
					/>
				</div>
			</template>
			<template v-if="currentStep === 2">
				<responsible-data
					class="mb-2"
					v-model:responsible_name="model.responsible_name"
					v-model:responsible_last_name="model.responsible_last_name"
					v-model:responsible_dni="model.responsible_dni"
					v-model:responsible_phone_number="model.responsible_phone_number"
					v-model:responsible_email="model.responsible_email"
				/>
				<bank-data
					v-model:holder_name="model.holder_name"
					v-model:bank_code="model.bank_code"
					v-model:iban_number="model.iban_number"
				/>
				<document-data
					v-model:file_date="model.file_date"
					v-model:file_document="model.file_document.file"
				/>
			</template>
			<template v-if="currentStep === 3">
				<fieldset
					v-for="(installation, id) in installations"
					:key="installation.key"
				>
					<div class="border border-light rounded p-2 row mt-3">
						<installation-general-data
							v-model:file_document="installations[id].file_document"
							v-model:file_auditor="installations[id].file_auditor"
							v-model:auditable="installations[id].auditable_id"
							v-model:name="installations[id].name"
							v-model:periodicity="installations[id].periodicity"
							:onlyForm="true"
							:form_id="id"
							:delegate_id="delegateId"
						/>
						<div class="col-12">
							<address-select
								v-model:address="installations[id].address.address"
								v-model:city="installations[id].address.city"
								v-model:code="installations[id].address.code"
								v-model:country="installations[id].address.country"
								v-model:province="installations[id].address.province"
								v-model:comunity="installations[id].address.comunity"
								v-model:street_number="installations[id].address.street_number"
							/>
						</div>
						<div class="col-12 mt-2">
							<base-button
								type="primary"
								:outline="true"
								@click="remove(id)"
								:disabled="installations.length == 1"
								><i class="fa-regular fa-trash-can"></i
							></base-button>
						</div>
					</div>
				</fieldset>
				<div class="mt-3">
					<base-button
						@click="handlePush()"
						:disabled="installations.length >= 3"
					>
						Agregrar instalación
					</base-button>
				</div>
			</template>

			<template v-if="currentStep === 4">
				<fieldset
					class="border border-light rounded p-2 row mt-3"
					v-for="(installation, id) in installations"
					:key="installation.key"
				>
					<div class="col-12 border-bottom border-light mb-2">
						<h3 class="badge rounded-pill bg-default text-white h3">
							Responsable de instalación #{{ id + 1 }}
						</h3>
					</div>

					<employee-general-data
						:form_id="id"
						custom_key="responsible"
						v-model:name="installations[id].responsible.name"
						v-model:last_name="installations[id].responsible.last_name"
						v-model:phone_number="installations[id].responsible.phone_number"
						v-model:position="installations[id].responsible.position"
						v-model:dni="installations[id].responsible.dni"
						v-model:email="installations[id].responsible.email"
					/>
					<div class="row border rounded border-light px-4 py-2 mt-3 mx-0">
						<div class="col-12 border-bottom border-light mb-md-3">
							<h4>Documentación</h4>
						</div>
						<div class="col-lg-6">
							<base-field
								:name="`installations.${id}.responsible.date_firm.date`"
								label="Fecha de alta"
							>
								<field-validate
									type="date"
									class="form-control"
									:name="`installations.${id}.responsible.date_firm.date`"
									rules=""
									label="fecha de firma"
									v-model="installations[id].responsible.date_firm"
								/>
							</base-field>
						</div>
						<div class="col-lg-6">
							<base-field
								:name="`installations.${id}.responsible.file_firm.base64`"
								label="Documento de Alta"
							>
								<div
									v-if="
										installations[id].responsible.file_firm.file.length >= 1
									"
								>
									<span class="mr-md-4">{{
										installations[id].responsible.file_firm.file[0].name
									}}</span>
									<base-button
										@click="installations[id].responsible.file_firm.file = []"
										size="sm"
										type="default"
										:outline="true"
										><i class="fa-solid fa-pencil"></i
									></base-button>
								</div>
								<field-validate
									v-else
									type="file"
									class="form-control"
									:name="`installations.${id}.responsible.file_firm.base64`"
									rules=""
									label="documento"
									v-model="installations[id].responsible.file_firm.file"
								/>
							</base-field>
						</div>
						<div class="col-lg-12">
							<div>
								<base-switch
									v-model="installations[id].responsible.dangerous_goods"
									:value="
										installations[id].responsible.dangerous_goods != 0
											? true
											: false
									"
									label="Mercancias peligrosas"
								></base-switch>
							</div>
							<div class="row">
								<div
									class="col-lg-6"
								>
									<base-field
										apiName="responsible.date_certification"
										name="date_cer"
										label="Fecha de formación"
									>
										<field-validate
											type="date"
											class="form-control"
											name="date_cer"
											:rules="{'required':!$empty(installations[id].responsible.file_certification.file)}"
											label="fecha"
											v-model="installations[id].responsible.date_certification"
										/>
									</base-field>
								</div>
								<div
									class="col-lg-6"
								>
									<base-field
										apiName="responsible.file_certification"
										name="file_cer"
										label="Documento de formación"
									>
										<div
											v-if="
												installations[id].responsible.file_certification.file
													.length >= 1
											"
										>
											<span class="mr-md-4">{{
												installations[id].responsible.file_certification.file[0]
													.name
											}}</span>
											<base-button
												@click="
													installations[
														id
													].responsible.file_certification.file = []
												"
												size="sm"
												type="default"
												:outline="true"
												><i class="fa-solid fa-pencil"></i
											></base-button>
										</div>
										<field-validate
											v-else
											type="file"
											class="form-control"
											name="file_cer"
											:rules="{'required':!$empty(installations[id].responsible.date_certification)}"
											label="documento"
											v-model="
												installations[id].responsible.file_certification.file
											"
										/>
									</base-field>
								</div>
							</div>
						</div>

						<div class="col-lg-12">
							<div class="row">
								<div class="col-lg-2">
									<base-switch
										v-model="installations[id].responsible.driver"
										:value="
											installations[id].responsible.driver != 0 ? true : false
										"
										label="Conductor"
									></base-switch>
								</div>
								<div
									class="col-lg-3"
									v-if="installations[id].responsible.driver"
								>
									<base-field
										:name="`installations.${id}.responsible.adr_permit_id`"
										label="Permiso ADR"
									>
										<field-validate
											as="select"
											class="form-control"
											:name="`installations.${id}.responsible.adr_permit_id`"
											v-model="installations[id].responsible.adr_permit_id"
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
								<div
									class="col-lg-3"
									v-if="installations[id].responsible.driver"
								>
									<base-field
										:name="`installations.${id}.responsible.driver_document_date.date`"
										label="Caducidad Carnet ADR"
									>
										<field-validate
											type="date"
											class="form-control"
											:name="`installations.${id}.responsible.driver_document_date.date`"
											v-model="
												installations[id].responsible.driver_document_date
											"
											rules="required"
										>
										</field-validate>
									</base-field>
								</div>
								<div
									class="col-lg-4"
									v-if="installations[id].responsible.driver"
								>
									<base-field
										:name="`installations.${id}.responsible.driver_document.base64`"
										label="Documentación ADR"
									>
										<div
											v-if="
												installations[id].responsible.driver_document.file
													.length >= 1
											"
										>
											<span class="mr-md-4">{{
												installations[id].responsible.driver_document.file[0]
													.name
											}}</span>
											<base-button
												@click="
													installations[id].responsible.driver_document.file =
														[]
												"
												size="sm"
												type="default"
												:outline="true"
												><i class="fa-solid fa-pencil"></i
											></base-button>
										</div>
										<field-validate
											v-else
											type="file"
											class="form-control"
											:name="`installations.${id}.responsible.driver_document.base64`"
											rules="required"
											label="documento"
											v-model="
												installations[id].responsible.driver_document.file
											"
										/>
									</base-field>
								</div>
							</div>
						</div>
					</div>
				</fieldset>
			</template>

			<div class="mt-4 float-md-right">
				<base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
					>Anterior</base-button
				>
				<base-button type="default" nativeType="submit" v-if="currentStep !== 4"
					>Siguiente</base-button
				>
				<base-button type="default" nativeType="submit" v-if="currentStep === 4"
					>Aceptar</base-button
				>
				<base-button
					type="default"
					:outline="true"
					class="ml-auto"
					@click="handleClose(resetForm)"
					>Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>
<script>
	import utils from "@/mixins/utils-mixin";
	import service from "../../../store/services/model-service";
	import _, { isEmpty } from "lodash";
	import { mapGetters } from "vuex";
	import AsyncSelect from "../../AsyncSelect.vue";
	import AddressSelect from "../../AddressSelect.vue";
	import GeneralData from "./Modules/GeneralData.vue";
	import BankData from "./Modules/BankData.vue";
	import DocumentData from "./Modules/DocumentData.vue";
	import InstallationGeneralData from "../Installation/Modules/GeneralData.vue";
	import EmployeeGeneralData from "../Employee/Modules/GeneralData.vue";
import BusinessData from './Modules/BusinessData.vue';
import ResponsibleData from './Modules/ResponsibleData.vue';

	export default {
		components: {
			AsyncSelect,
			AddressSelect,
			GeneralData,
			BankData,
			DocumentData,
			InstallationGeneralData,
			EmployeeGeneralData,
			BusinessData,
			ResponsibleData,
		},
		mixins: [utils],
		data() {
			return {
				steps: [],
				model: this.$functions.schemas("business"),
				currentStep: 1,
				installations: [],
				delegate: null,
			};
		},
		mounted() {
			this.steps = [
				{
					number: 1,
					title: "General",
					valid: false,
				},
				{
					number: 2,
					title: "Detalles",
					valid: false,
				},
				{
					number: 3,
					title: "Instalaciones",
					valid: false,
				},
				{
					number: 4,
					title: "Responsables",
					valid: false,
				},
			];

			this.handlePush();
			this.permits = this.getPermits();
		},
		methods: {
			async submit(values, { resetForm }) {
				for (let index = 0; index < this.steps.length; index++) {
					const step = this.steps[index];
					if (step.number == this.currentStep) {
						step.valid = true;
					}
				}
				if (this.currentStep === 1) {
					if (this.ROLE == "admin") {
						this.model.delegate_id = this.delegate.delegate.id;
					}
				}
				if (this.currentStep === 2) {
					if (!isEmpty(this.model.file_document.file)) {
						this.model.file_document.base64 = await this.toBase64(
							this.model.file_document.file[0]
						);
						this.model.file_document.file_name =
							this.model.file_document.file[0].name;
					}
				}

				if (this.currentStep == 3) {
					// 
				}
				
				if (this.currentStep == 4) {
					for (let i = 0; i < this.installations.length; i++) {
						// Format firm
						if (this.installations[i].responsible.file_firm.file[0]) {
							this.installations[i].responsible.file_firm.base64 =
								await this.toBase64(
									this.installations[i].responsible.file_firm.file[0]
								);
							this.installations[i].responsible.file_firm.file_name =
								this.installations[i].responsible.file_firm.file[0].name;
						}
						// Format driver documents
						if (this.installations[i].responsible.driver) {
							this.installations[i].responsible.driver_document.base64 =
								await this.toBase64(
									this.installations[i].responsible.driver_document.file[0]
								);
							this.installations[i].responsible.driver_document.file_name =
								this.installations[i].responsible.driver_document.file[0].name;
						}
						if (!this.$functions.empty(this.installations[i].responsible.file_certification.file)) {
							this.installations[i].responsible.file_certification.base64 =
								await this.toBase64(
									this.installations[i].responsible.file_certification.file[0]
								);
							this.installations[i].responsible.file_certification.file_name =
								this.installations[i].responsible.file_certification.file[0].name;
						}
						this.installations[i].responsible.representative = true;
					}

					this.model.installations = this.installations;
					try {
						const data = this.$functions.cleanData(this.model);
						// eslint-disable-next-line no-unreachable
						await service.store("business", data);
						resetForm();
						this.$emit("close");
						this.$emit("reload");
					} catch (err) {
						console.log(err);
					}
				}
				if (this.currentStep != 4) {
					this.currentStep++;
				}
			},
			prevStep() {
				if (this.currentStep <= 0) {
					return;
				}

				this.currentStep--;
			},
			remove(id) {
				let position = 0;
				let position_item = 0;

				_.mapKeys(
					this.installations,
					(inst, key) => {
						if (key == id) {
							position_item = position;
						}
						position++;
					},
					position_item,
					id
				);

				this.installations.splice(position_item, 1);
			},
			handlePush() {
				this.installations.push(this.$functions.schemas("installation"));
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
		},
		computed: {
			...mapGetters(["ROLE"]),
			queryParams() {
				let delegate = null;
				if (this.ROLE == "admin" || this.ROLE == "delegate") {
					delegate =
						this.ROLE == "admin"
							? this.delegate.delegate.id
							: this.$store.state("profile.me").delegate.id;
				}
				return delegate != null ? "&delegate_id=" + delegate : null;
			},
			delegateId() {
				let delegate = null;
				if (this.ROLE == "admin" || this.ROLE == "delegate") {
					delegate =
						this.ROLE == "admin"
							? this.delegate.delegate.id
							: this.$store.state("profile.me").delegate.id;
				}
				return delegate;
			},
		},
	};
</script>
