<template>
	<div>
		<form-validate @submit="submit" v-slot="{ meta, resetForm }">
			<base-steps
				:currentStep="currentStep"
				listClasses="mb-md-4 pb-md-2"
				:steps="steps"
				:meta="meta"
				@step="currentStep = $event"
			></base-steps>
			<template v-if="currentStep === 1">
				<div>
					<div class="row border border-light rounded p-2">
						<div class="col-12">
							<h4>Datos generales</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="property_name" label="Nombre representante">
								<field-validate
									type="text"
									class="form-control"
									name="property_name"
									rules="required"
									label="nombre"
									v-model="model.property_name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field
								name="property_last_name"
								label="Apellido representante"
							>
								<field-validate
									type="text"
									class="form-control"
									name="property_last_name"
									rules="required"
									label="apellido"
									v-model="model.property_last_name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_dni" label="DNI">
								<field-validate
									type="text"
									class="form-control text-uppercase"
									name="property_dni"
									rules="required|min:9|max:9"
									label="dni"
									v-model.trim="model.property_dni"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_phone" label="Móvil">
								<field-validate
									type="number"
									class="form-control"
									name="property_phone"
									rules="required|min:5|max:15"
									label="móvil"
									v-model.number="model.property_phone"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_email" label="Email">
								<field-validate
									type="email"
									class="form-control"
									name="property_email"
									rules="required|email"
									label="email de la empresa"
									v-model="model.property_email"
								/>
							</base-field>
						</div>
					</div>
					<div class="row border border-light rounded p-2 mt-2">
						<div class="col-12">
							<h4>Datos de empresa</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="name" label="Nombre">
								<field-validate
									type="text"
									class="form-control"
									name="name"
									rules="required"
									label="nombre empresa"
									v-model="model.name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="email" label="Email">
								<field-validate
									type="text"
									class="form-control"
									name="email"
									rules="required|email"
									label="email"
									v-model.trim="model.email"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_nif" label="CIF/NIF">
								<field-validate
									type="text"
									class="form-control text-uppercase"
									name="business_nif"
									rules="required|alpha_num"
									label="nombre"
									v-model.trim="model.business_nif"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_phone" label="Fijo">
								<field-validate
									type="number"
									class="form-control"
									name="business_phone"
									rules="required|min:5|max:15"
									label="fijó"
									v-model.number="model.business_phone"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="address" label="Dirección">
								<field-validate
									type="text"
									class="form-control"
									name="address"
									rules="required"
									label="dirección"
									v-model.number="model.address"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="province_id" label="Provincia">
								<field-validate
									class="form-control"
									as="select"
									name="province_id"
									rules="required"
									label="Provincia"
									v-model="model.province_id"
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
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="postal_code" label="Código postal">
								<field-validate
									type="number"
									class="form-control"
									name="postal_code"
									rules="required|numeric|min:5|max:5"
									label="postal_code"
									v-model="model.postal_code"
								/>
							</base-field>
						</div>
						<div class="col-lg-4" v-if="ROLE == 'admin'">
							<base-field name="delegate_id" label="Delegado">
								<div v-if="delegate != null">
									<span class="mr-md-4 text-uppercase"
										>{{ delegate.full_name }}</span
									>
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
										v-slot="{ field }"
									>
										<Multiselect
											:searchable="true"
											v-bind="field"
											:min-chars="2"
											:delay="500"
											:required="true"
											:options="getDelegates"
											@select="delegate = $event"
										>
										</Multiselect>
									</field-validate>
								</div>
							</base-field>
						</div>
					</div>
				</div>
			</template>
			<template v-if="currentStep === 2">
				<div class="row border border-light rounded p-2">
					<div class="col-12">
						<h4>Datos bancarios</h4>
					</div>
					<div class="col-lg-4">
						<base-field name="holder_name" label="Nombre del titular">
							<field-validate
								type="text"
								class="form-control"
								name="holder_name"
								rules="required|alpha_spaces"
								label="nombre"
								v-model="model.holder_name"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="bank_code" label="BIC/SWIFT">
							<field-validate
								type="text"
								class="form-control text-uppercase"
								name="bank_code"
								rules="required|min:5|max:20|alpha_num"
								label="BIC/SWIFT"
								v-model="model.bank_code"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="iban_number" label="IBAN">
							<field-validate
								type="number"
								class="form-control"
								name="iban_number"
								rules="required|min:3|max:50"
								label="numero iban"
								v-model="model.iban_number"
							/>
						</base-field>
					</div>
				</div>
				<div class="row border border-light mt-3 rounded p-2">
					<div class="col-12">
						<h4>Documentación de la empresa</h4>
					</div>
					<div class="col-lg-6">
						<base-field name="file_date.date" label="Fecha de documentación">
							<field-validate
								type="date"
								class="form-control"
								name="file_date.date"
								rules="required"
								label="fecha documentación"
								v-model="model.file_date"
							/>
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="file_document.base64" label="Documentación">
							<div v-if="model.file_document.file != null">
								<span class="mr-md-4">{{
									model.file_document.file[0].name
								}}</span>
								<base-button
									@click="model.file_document.file = []"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<field-validate
								v-show="model.file_document.file == null"
								type="file"
								class="form-control"
								name="file_document.base64"
								rules="required|ext:pdf"
								label="documento"
								v-model="model.file_document.file"
							/>
						</base-field>
					</div>
				</div>
			</template>
			<template v-if="currentStep === 3">
				<fieldset
					class="border border-light rounded p-2 row mt-3"
					v-for="(installation, id) in installations"
					:key="installation.key"
				>
					<div class="col-lg-4">
						<base-field
							:name="`installations[${id}].name`"
							label="Nombre de instalación"
						>
							<field-validate
								type="text"
								class="form-control"
								:name="`installations[${id}].name`"
								rules="required"
								label="Nombre"
								v-model="installations[id].name"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field
							:name="`installations[${id}].address`"
							label="Dirección"
						>
							<field-validate
								type="text"
								class="form-control"
								:name="`installations[${id}].address`"
								rules="required"
								label="direccion"
								v-model="installations[id].address"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field :name="`auditable[${id}]`" label="Auditor">
							<div v-if="installations[id].auditable != null">
								<span class="mr-md-4 text-uppercase"
									>{{ installations[id].auditable.full_name }}</span
								>
								<base-button
									@click="installations[id].auditable = null"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<div v-else>
								<field-validate
									:name="`auditable[${id}]`"
									label="Auditor"
									v-slot="{ field }"
								>
									<Multiselect
										:searchable="true"
										v-bind="field"
										:min-chars="2"
										:delay="500"
										:required="true"
										:options="getUsers"
										ref="multiselect"
										@select="installations[id].auditable = $event"
									>
									</Multiselect>
								</field-validate>
							</div>
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field
							:name="`installations[${id}].province_id`"
							label="Provincia"
						>
							<field-validate
								class="form-control"
								as="select"
								:name="`installations[${id}].province_id`"
								rules="required"
								label="Provincia"
								v-model="installations[id].province_id"
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
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field
							:name="`installations[${id}].file_document.base64`"
							label="Documentación"
						>
							<div v-if="installations[id].file_document.file.length >= 1">
								<span class="mr-md-4">{{
									installations[id].file_document.file[0].name
								}}</span>
								<base-button
									@click="installations[id].file_document.file = []"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<field-validate
								v-show="!installations[id].file_document.file.length >= 1"
								class="form-control"
								type="file"
								:name="`installations[${id}].file_document.base64`"
								rules="required|ext:pdf"
								:validateOnInput="true"
								label="documentación"
								v-model="installations[id].file_document.file"
							/>
						</base-field>
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
				</fieldset>

				<div class="mt-3">
					<base-button
						@click="handlePush()"
						:disabled="installations.length >= 3"
					>
						Agregrar instalación +
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
					<div class="row border rounded border-light px-4 py-2 mx-0">
						<div class="col-12 border-bottom border-light mb-md-3">
							<h4>Datos principales</h4>
						</div>
						<div class="col-lg-6 col-lg-4">
							<base-field
								:apiName="`installations.${id}.responsible.name`"
								name="name"
								label="Nombre"
							>
								<field-validate
									type="text"
									class="form-control"
									name="name"
									rules="required"
									label="Nombre"
									v-model="installations[id].responsible.name"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								:apiName="`installations.${id}.responsible.last_name`"
								name="last_name"
								label="Apellido"
							>
								<field-validate
									type="text"
									class="form-control"
									name="last_name"
									rules="required"
									label="apellido"
									v-model="installations[id].responsible.last_name"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								:apiName="`installations.${id}.responsible.dni`"
								name="dni"
								label="DNI"
							>
								<field-validate
									type="number"
									class="form-control"
									name="dni"
									rules="required|min:9|max:9|alpha_num"
									label="dni"
									v-model="installations[id].responsible.dni"
								/>
							</base-field>
						</div>
						<div class="col-lg-6 col-lg-4">
							<base-field
								:apiName="`installation.${id}.responsible.email`"
								name="email"
								label="Email"
							>
								<field-validate
									type="text"
									class="form-control"
									name="email"
									rules="required|email"
									label="email"
									v-model="installations[id].responsible.email"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								:apiName="`installation[${id}].responsible.position`"
								name="position"
								label="Cargo"
							>
								<field-validate
									type="text"
									class="form-control"
									name="position"
									rules="required|alpha_spaces"
									label="cargo"
									v-model="installations[id].responsible.position"
								/>
							</base-field>
						</div>

						<div class="col-lg-6 col-lg-4">
							<base-field
								:apiName="`installations.${id}.responsible.phone_number`"
								label="Movil"
								name="phone_number"
							>
								<field-validate
									type="number"
									class="form-control"
									name="phone_number"
									rules="required"
									label="movil"
									v-model="installations[id].responsible.phone_number"
								/>
							</base-field>
						</div>
					</div>
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
									rules="required"
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
									rules="required"
									label="documento"
									v-model="installations[id].responsible.file_firm.file"
								/>
							</base-field>
						</div>
						<div class="col-lg-12">
							<div class="row">
								<div class="col-lg-2">
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
								<div
									v-if="installations[id].responsible.dangerous_goods"
									class="col-lg-5"
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
											rules="required"
											label="fecha"
											v-model="installations[id].responsible.date_certification"
										/>
									</base-field>
								</div>
								<div
									v-if="installations[id].responsible.dangerous_goods"
									class="col-lg-5"
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
											rules="required"
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
										label="Fecha"
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
					>Enviar</base-button
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
	import Multiselect from "@vueform/multiselect";
	import service from "../../../store/services/model-service";
	import _ from "lodash";
import { mapGetters } from 'vuex';

	export default {
		components: { Multiselect },
		mixins: [utils],
		data() {
			return {
				steps: [],
				model: this.$store.getters.BUSINESS_SCHEMA,
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
			this.provinces = this.getProvinces();
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
					console.log(values);
					this.model.file_document.base64 = await this.toBase64(
						values.file_document.base64[0]
					);
				}

				if (this.currentStep == 3) {
					for (let i = 0; i < this.installations.length; i++) {
						const installation = this.installations[i];
						installation.file_document.base64 = await this.toBase64(
							installation.file_document.file[0]
						);
                        if (!_.isEmpty(installation.auditable_id)) {
                            installation.auditable_id = installation.auditable.id;
                        }
					}
				}
				if (this.currentStep == 4) {
					for (let i = 0; i < this.installations.length; i++) {
						// Format firm
						this.installations[i].responsible.file_firm.base64 =
							await this.toBase64(
								this.installations[i].responsible.file_firm.file[0]
							);

						// Format driver documents
						if (this.installations[i].responsible.driver) {
							this.installations[i].responsible.driver_document.base64 =
								await this.toBase64(
									this.installations[i].responsible.driver_document.file[0]
								);
						}
						if (this.installations[i].responsible.dangerous_goods) {
							this.installations[i].responsible.file_certification.base64 =
								await this.toBase64(
									this.installations[i].responsible.file_certification.file[0]
								);
						}
					}

					this.model.installations = this.installations;

					try {
						await service.store("business", this.model);
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
			getUsers(query) {
                let params = null;
                if (this.ROLE == 'admin') {
                    params = '&delegate_id=' + this.delegate.delegate.id;
                }
				return this.$store.dispatch("users", { query: query, roles: [2, 3], params: params });
			},
            getDelegates(query) {
				return this.$store.dispatch("users", { query: query, roles: [2], params: '&includes[]=delegate' });
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
				this.installations.push(this.$store.getters.INSTALLATION_SCHEMA);
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
		},
		computed: {
            ...mapGetters(['ROLE'])
        },
	};
</script>
