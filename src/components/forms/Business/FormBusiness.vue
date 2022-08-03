<template>
	<div>
		<form-validate @submit="submit" @keypress.enter.prevent="" v-slot="{ meta, resetForm }">
			<base-steps :currentStep="currentStep" listClasses="mb-md-4 pb-md-2" :steps="steps" :meta="meta"
				@step="currentStep = $event"></base-steps>
			<template v-if="currentStep === 1">
				<div>
					<div class="row border border-light rounded p-2">
						<div class="col-12">
							<h4>Datos generales</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="property_name" label="Nombre representante">
								<field-validate type="text" class="form-control" name="property_name" rules=""
									label="nombre" v-model="model.property_name" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_last_name" label="Apellido representante">
								<field-validate type="text" class="form-control" name="property_last_name" rules=""
									label="apellido" v-model="model.property_last_name" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_dni" label="DNI">
								<field-validate type="text" class="form-control text-uppercase" name="property_dni"
									rules="min:9|max:9" label="dni" v-model.trim="model.property_dni" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_phone" label="Móvil">
								<field-validate type="number" class="form-control" name="property_phone"
									rules="min:5|max:15" label="móvil" v-model.number="model.property_phone" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_email" label="Email">
								<field-validate type="email" class="form-control" name="property_email" rules="email"
									label="email de la empresa" v-model="model.property_email" />
							</base-field>
						</div>
					</div>
					<div class="row border border-light rounded p-2 mt-2">
						<div class="col-12">
							<h4>Datos de empresa</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="name" label="Nombre" :required="true">
								<field-validate type="text" class="form-control" name="name" rules="required"
									label="nombre empresa" v-model="model.name" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="email" label="Email" :required="true">
								<field-validate type="text" class="form-control" name="email" rules="required|email"
									label="email" v-model.trim="model.email" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_nif" label="CIF/NIF">
								<field-validate type="text" class="form-control text-uppercase" name="business_nif"
									rules="alpha_num" label="nombre" v-model.trim="model.business_nif" />
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_phone" label="Fijo">
								<field-validate type="number" class="form-control" name="business_phone"
									rules="min:5|max:15" label="fijó" v-model.number="model.business_phone" />
							</base-field>
						</div>
						<div class="col-lg-8" v-if="ROLE == 'admin'">
							<base-field name="delegate_id" label="Delegado" :required="true">
								<div v-if="delegate != null">
									<span class="mr-md-4 text-uppercase">{{ delegate.full_name }}</span>
									<base-button @click="delegate = null" size="sm" type="default" :outline="true"><i
											class="fa-solid fa-pencil"></i></base-button>
								</div>
								<div v-else>
									<field-validate name="delegate_id" label="Delegado" rules="required">
										<async-select @selected="delegate = $event" params="&includes[]=delegate">
										</async-select>
									</field-validate>
								</div>
							</base-field>
						</div>
					</div>
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
				<div class="row border border-light rounded p-2">
					<div class="col-12">
						<h4>Datos bancarios</h4>
					</div>
					<div class="col-lg-4">
						<base-field name="holder_name" label="Nombre del titular">
							<field-validate type="text" class="form-control" name="holder_name" rules="alpha_spaces"
								label="nombre" v-model="model.holder_name" />
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="bank_code" label="BIC/SWIFT">
							<field-validate type="text" class="form-control text-uppercase" name="bank_code"
								rules="min:11|max:11" label="BIC/SWIFT" v-model="model.bank_code" />
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="iban_number" label="IBAN">
							<field-validate type="text" class="form-control" name="iban_number"
								rules="min:24|max:24|alpha_num" label="numero iban" v-model="model.iban_number" />
						</base-field>
					</div>
				</div>
				<div class="row border border-light mt-3 rounded p-2">
					<div class="col-12">
						<h4>Alta empresa</h4>
					</div>
					<div class="col-lg-6">
						<base-field name="file_date.date" label="Fecha de alta">
							<field-validate type="date" class="form-control" name="file_date.date"
								label="fecha alta" v-model="model.file_date" />
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="file_document.base64" label="Alta empresa">
							<div v-if="model.file_document.file != null">
								<span class="mr-md-4">{{
										model.file_document.file[0].name
								}}</span>
								<base-button @click="model.file_document.file = []" size="sm" type="default"
									:outline="true"><i class="fa-solid fa-pencil"></i></base-button>
							</div>
							<field-validate v-show="model.file_document.file == null" type="file" class="form-control"
								name="file_document.base64" rules="ext:pdf" label="documento"
								v-model="model.file_document.file" />
						</base-field>
					</div>
				</div>
			</template>
			<template v-if="currentStep === 3">
				<fieldset  v-for="(installation, id) in installations"
					:key="installation.key">

					<div class="border border-light rounded p-2 row mt-3">
						<div :class="ROLE === 'auditor' ? 'col-lg-6' : 'col-lg-4'">
							<base-field :name="`installations[${id}].name`" label="Nombre de instalación" :required="true">
								<field-validate type="text" class="form-control" :name="`installations[${id}].name`"
									rules="required" label="Nombre" v-model="installations[id].name" />
							</base-field>
						</div>
						<div class="col-lg-4" v-if="ROLE !== 'auditor'">
							<base-field :name="`auditable[${id}]`" label="Auditor">
								<div v-if="installations[id].auditable != null">
									<span class="mr-md-4 text-uppercase">{{ installations[id].auditable.full_name }}</span>
									<base-button @click="installations[id].auditable = null" size="sm" type="default"
										:outline="true"><i class="fa-solid fa-pencil"></i></base-button>
								</div>
								<div v-else>
									<field-validate :name="`auditable[${id}]`" label="Auditor" rules="">
										<async-select @selected="installations[id].auditable = $event" :roles="[2, 3]"
											:params="queryParams">
										</async-select>
									</field-validate>
								</div>
							</base-field>
						</div>
						<div :class="ROLE === 'auditor' ? 'col-lg-6' : 'col-lg-4'">
							<base-field :name="`installations[${id}].file_document.base64`" label="Alta consejero ADR">
								<div v-if="installations[id].file_document.file.length >= 1">
									<span class="mr-md-4">{{
											installations[id].file_document.file[0].name
									}}</span>
									<base-button @click="installations[id].file_document.file = []" size="sm" type="default"
										:outline="true"><i class="fa-solid fa-pencil"></i></base-button>
								</div>
								<field-validate v-show="!installations[id].file_document.file.length >= 1"
									class="form-control" type="file" :name="`installations[${id}].file_document.base64`"
									rules="ext:pdf" :validateOnInput="true" label="alta consejero ADR"
									v-model="installations[id].file_document.file" />
							</base-field>
						</div>
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
							<base-button type="primary" :outline="true" @click="remove(id)"
								:disabled="installations.length == 1"><i class="fa-regular fa-trash-can"></i></base-button>
						</div>
					</div>
					
				</fieldset>
				<div class="mt-3">
					<base-button @click="handlePush()" :disabled="installations.length >= 3">
						Agregrar instalación
					</base-button>
				</div>
			</template>


			<template v-if="currentStep === 4">
				<fieldset class="border border-light rounded p-2 row mt-3" v-for="(installation, id) in installations"
					:key="installation.key">
					<div class="col-12 border-bottom border-light mb-2">
						<h3 class="badge rounded-pill bg-default text-white h3">
							Responsable de instalación #{{ id + 1 }}
						</h3>
					</div>
					<div class="row border rounded border-light px-4 py-2 mx-0">
						<div class="col-12 border-bottom border-light mb-md-3">
							<h4>Datos principales</h4>
						</div>
						<div class="col-lg-6 col-lg-4">
							<base-field :apiName="`installations.${id}.responsible.name`" :required="true" name="name" label="Nombre">
								<field-validate type="text" class="form-control" :name="`responsible[${id}].name`" rules="required"
									label="Nombre" v-model="installations[id].responsible.name" />
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field :apiName="`installations.${id}.responsible.last_name`" :required="true" :name="`responsible[${id}].last_name`"
								label="Apellido">
								<field-validate type="text" class="form-control" :name="`responsible[${id}].last_name`" rules="required"
									label="apellido" v-model="installations[id].responsible.last_name" />
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field :apiName="`installations.${id}.responsible.dni`" :name="`responsible[${id}].dni`" label="DNI">
								<field-validate type="text" class="form-control" :name="`responsible[${id}].dni`"
									rules="min:9|max:9|alpha_num" label="dni"
									v-model="installations[id].responsible.dni" />
							</base-field>
						</div>
						<div class="col-lg-6 col-lg-4">
							<base-field :apiName="`installation.${id}.responsible.email`" :required="true" :name="`responsible[${id}].email`" label="Email">
								<field-validate type="text" class="form-control" :name="`responsible[${id}].email`" rules="required|email"
									label="email" v-model="installations[id].responsible.email" />
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field :apiName="`installation[${id}].responsible.position`" :name="`responsible[${id}].position`"
								label="Cargo">
								<field-validate type="text" class="form-control" :name="`responsible[${id}].position`" rules="alpha_spaces"
									label="cargo" v-model="installations[id].responsible.position" />
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field :apiName="`installations.${id}.responsible.phone_number`" label="Movil"
								:name="`responsible[${id}].phone_number`">
								<field-validate type="number" class="form-control" :name="`responsible[${id}].phone_number`" rules=""
									label="movil" v-model="installations[id].responsible.phone_number" />
							</base-field>
						</div>
					</div>
					<div class="row border rounded border-light px-4 py-2 mt-3 mx-0">
						<div class="col-12 border-bottom border-light mb-md-3">
							<h4>Documentación</h4>
						</div>
						<div class="col-lg-6">
							<base-field :name="`installations.${id}.responsible.date_firm.date`" label="Fecha de alta">
								<field-validate type="date" class="form-control"
									:name="`installations.${id}.responsible.date_firm.date`" rules=""
									label="fecha de firma" v-model="installations[id].responsible.date_firm" />
							</base-field>
						</div>
						<div class="col-lg-6">
							<base-field :name="`installations.${id}.responsible.file_firm.base64`"
								label="Documento de Alta">
								<div v-if="
									installations[id].responsible.file_firm.file.length >= 1
								">
									<span class="mr-md-4">{{
											installations[id].responsible.file_firm.file[0].name
									}}</span>
									<base-button @click="installations[id].responsible.file_firm.file = []" size="sm"
										type="default" :outline="true"><i class="fa-solid fa-pencil"></i></base-button>
								</div>
								<field-validate v-else type="file" class="form-control"
									:name="`installations.${id}.responsible.file_firm.base64`" rules=""
									label="documento" v-model="installations[id].responsible.file_firm.file" />
							</base-field>
						</div>
						<div class="col-lg-12">
							<div class="row">
								<div class="col-lg-2">
									<base-switch v-model="installations[id].responsible.dangerous_goods" :value="
										installations[id].responsible.dangerous_goods != 0
											? true
											: false
									" label="Mercancias peligrosas"></base-switch>
								</div>
								<div v-if="installations[id].responsible.dangerous_goods" class="col-lg-5">
									<base-field apiName="responsible.date_certification" name="date_cer"
										label="Fecha de formación">
										<field-validate type="date" class="form-control" name="date_cer"
											rules="required" label="fecha"
											v-model="installations[id].responsible.date_certification" />
									</base-field>
								</div>
								<div v-if="installations[id].responsible.dangerous_goods" class="col-lg-5">
									<base-field apiName="responsible.file_certification" name="file_cer"
										label="Documento de formación">
										<div v-if="
											installations[id].responsible.file_certification.file
												.length >= 1
										">
											<span class="mr-md-4">{{
													installations[id].responsible.file_certification.file[0]
														.name
											}}</span>
											<base-button @click="
												installations[
													id
												].responsible.file_certification.file = []
											" size="sm" type="default" :outline="true"><i class="fa-solid fa-pencil"></i></base-button>
										</div>
										<field-validate v-else type="file" class="form-control" name="file_cer"
											rules="required" label="documento" v-model="
												installations[id].responsible.file_certification.file
											" />
									</base-field>
								</div>
							</div>
						</div>

						<div class="col-lg-12">
							<div class="row">
								<div class="col-lg-2">
									<base-switch v-model="installations[id].responsible.driver" :value="
										installations[id].responsible.driver != 0 ? true : false
									" label="Conductor"></base-switch>
								</div>
								<div class="col-lg-3" v-if="installations[id].responsible.driver">
									<base-field :name="`installations.${id}.responsible.adr_permit_id`"
										label="Permiso ADR">
										<field-validate as="select" class="form-control"
											:name="`installations.${id}.responsible.adr_permit_id`"
											v-model="installations[id].responsible.adr_permit_id" rules="required">
											<option selected>Permiso adr</option>
											<option :value="permit.id" v-for="(permit, key) in permits" :key="key.id">
												{{ permit.name }}
											</option>
										</field-validate>
									</base-field>
								</div>
								<div class="col-lg-3" v-if="installations[id].responsible.driver">
									<base-field :name="`installations.${id}.responsible.driver_document_date.date`"
										label="Caducidad Carnet ADR">
										<field-validate type="date" class="form-control"
											:name="`installations.${id}.responsible.driver_document_date.date`" v-model="
												installations[id].responsible.driver_document_date
											" rules="required">
										</field-validate>
									</base-field>
								</div>
								<div class="col-lg-4" v-if="installations[id].responsible.driver">
									<base-field :name="`installations.${id}.responsible.driver_document.base64`"
										label="Documentación ADR">
										<div v-if="
											installations[id].responsible.driver_document.file
												.length >= 1
										">
											<span class="mr-md-4">{{
													installations[id].responsible.driver_document.file[0]
														.name
											}}</span>
											<base-button @click="
												installations[id].responsible.driver_document.file =
												[]
											" size="sm" type="default" :outline="true"><i class="fa-solid fa-pencil"></i></base-button>
										</div>
										<field-validate v-else type="file" class="form-control"
											:name="`installations.${id}.responsible.driver_document.base64`"
											rules="required" label="documento" v-model="
												installations[id].responsible.driver_document.file
											" />
									</base-field>
								</div>
							</div>
						</div>
					</div>
				</fieldset>
			</template>

			<div class="mt-4 float-md-right">
				<base-button type="default" @click="prevStep()" v-if="currentStep !== 1">Anterior</base-button>
				<base-button type="default" nativeType="submit" v-if="currentStep !== 4">Siguiente</base-button>
				<base-button type="default" nativeType="submit" v-if="currentStep === 4">Aceptar</base-button>
				<base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>
<script>
import utils from "@/mixins/utils-mixin";
import service from "../../../store/services/model-service";
import _, { isEmpty } from "lodash";
import { mapGetters } from 'vuex';
import AsyncSelect from '../../AsyncSelect.vue';
import AddressSelect from "../../AddressSelect.vue";

export default {
	components: { AsyncSelect, AddressSelect },
	mixins: [utils],
	data() {
		return {
			steps: [],
			model: this.$functions.schemas('business'),
			currentStep: 1,
			installations: [],
			delegate: null
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
				title: "Bancario",
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
				if (this.ROLE == 'admin') {
					this.model.delegate_id = this.delegate.delegate.id;
				}
			}
			if (this.currentStep === 2) {
				if (!isEmpty(values.file_document.base64)) {
					this.model.file_document.base64 = await this.toBase64(
						values.file_document.base64[0]
					);
					this.model.file_document.file_name = values.file_document.base64[0].name
				}
			}

			if (this.currentStep == 3) {
				for (let i = 0; i < this.installations.length; i++) {
					const installation = this.installations[i];
					if (this.installations[i].file_document?.file[0]) {
						this.installations[i].file_document.base64 = await this.toBase64(
							values.installations[i].file_document.base64[0]
						);
						this.installations[i].file_document.file_name = this.installations[i].file_document.file[0].name
					}
					if (!_.isEmpty(installation.auditable)) {
						this.installations[i].auditable_id = this.installations[i].auditable.id;
					}
					console.log(this.installations[i], 'testk');
					// this.installations[i] = this.$functions.cleanData(installation);
				}
			}
			if (this.currentStep == 4) {
				for (let i = 0; i < this.installations.length; i++) {
					// Format firm
					if (this.installations[i].responsible.file_firm.file[0]) {
						this.installations[i].responsible.file_firm.base64 =
							await this.toBase64(
								this.installations[i].responsible.file_firm.file[0]
							);
						this.installations[i].responsible.file_firm.file_name = this.installations[i].responsible.file_firm.file[0].name
					}
					// Format driver documents
					if (this.installations[i].responsible.driver) {
						this.installations[i].responsible.driver_document.base64 =
							await this.toBase64(
								this.installations[i].responsible.driver_document.file[0]
							);
						this.installations[i].responsible.driver_document.file_name = this.installations[i].responsible.driver_document.file[0].name
					}
					if (this.installations[i].responsible.dangerous_goods) {
						this.installations[i].responsible.file_certification.base64 =
							await this.toBase64(
								this.installations[i].responsible.file_certification.file[0]
							);
						this.installations[i].responsible.file_certification.file_name = this.installations[i].responsible.file_certification.file[0].name
					}
				}

				this.model.installations = this.installations;
				try {
					const data = this.$functions.cleanData(this.model)
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
			this.installations.push(this.$functions.schemas('installation'));
		},
		handleClose(reset) {
			reset();
			this.$emit("close");
		},
	},
	computed: {
		...mapGetters(['ROLE']),
		queryParams() {
			let delegate = null;
			if (this.ROLE == 'admin' || this.ROLE == 'delegate') {
				delegate = this.ROLE == 'admin' ? this.delegate.delegate.id : (this.$store.state('profile.me')).delegate.id
			}
			return delegate != null ? '&delegate_id=' + delegate : null
		}
	},
};
</script>
