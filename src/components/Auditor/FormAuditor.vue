<template>
	<div>
		<base-steps
			v-if="update"
			:currentStep="currentStep"
			listClasses="mb-md-4 pb-md-2"
			:steps="steps"
			:edit="true"
			@step="currentStep = $event"
			@navigate="currentStep = $event"
		></base-steps>
		<template v-if="currentStep == 1 || !update">
			<form-validate v-if="canShow" @submit="onSubmit" ref="form" v-slot="{ meta }" :initial-values="current_values">

				<div class="row border rounded border-light px-md-3 py-md-2">
					<div class="col-12">
						<h4>
							Datos generales
						</h4>
						<!-- <span v-if="id">Numero Psics: <b>{{psics_number}}</b></span> -->
						<hr>
					</div>
					<div class="col-lg-4">
						<base-field label="Nombre">
							<field-validate class="form-control text-capitalize" name="name" label="nombre"
								rules="required|max:20|alpha_spaces" v-model="model.name" />
						</base-field>
					</div>

					<div class="col-lg-4">
						<base-field name="last_name" label="Apellido">
							<field-validate class="form-control text-capitalize" name="last_name" label="apellido"
								rules="required|max:50|alpha_spaces" v-model="model.last_name" />
						</base-field>
					</div>

					<div class="col-lg-4" v-if="ROLE == 'admin' ">
						<base-field name="delegate" label="Delegado">
							<div v-if="modelDelegate">
								<span class="mr-md-4 text-uppercase">{{ modelDelegate.name }}</span>
								<base-button @click="new_delegate = true, delegate = null" size="sm" type="default"
									:outline="true"><i class="fa-solid fa-pencil"></i></base-button>
							</div>
							<div v-else>
								<field-validate name="delegate" label="Delegado" rules="required" v-model="delegate">
									<async-select @selected="delegate = $event" params="&includes[]=delegate">
									</async-select>
								</field-validate>
								<base-button v-if="update" @click="reset('delegate')" size="sm" type="default"
									:outline="true"><i class="fa-solid fa-rotate-left"></i></base-button>
							</div>
						</base-field>
					</div>

					<div class="col-lg-4">
						<base-field name="phone_number" label="Móvil">
							<field-validate class="form-control" name="phone_number" label="móvil" type="number"
								rules="required|min:7|max:15" v-model="model.phone_number" />
						</base-field>
					</div>

					<div class="col-lg-4">
						<base-field name="dni" label="DNI">
							<field-validate class="form-control text-uppercase" name="dni" label="dni"
								rules="required|min:9|max:9|alpha_num" v-model="model.dni" />
						</base-field>
					</div>

					<div class="col-lg-4">
						<base-field name="email" label="Email">
							<field-validate class="form-control" name="email" label="email" rules="required|email"
								v-model="model.email" />
						</base-field>
					</div>
					<div class="col-lg-4" v-if="id">
						<base-field label="Numero Psics">
							<q-input :model-value="psics_number" type="text" readonly outlined />
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

				<div class="row border rounded border-light px-md-3 py-md-2 mt-2 mt-md-3">
					<div class="col-12">
						<h4>
							Documentacion
						</h4>
						<hr>
					</div>
					<div class="col-lg-6">
						<base-field name="file_certification" label="Documento Certificado ADR">
							<div v-if="cert_document && !cer_update">
								<a href="#" @click.prevent="getDocument(cert_document.id)" class="mr-md-4">{{
										cert_document.name_document ?? cert_document.type.name
								}}</a>
								<base-button @click="cer_update = true" size="sm" type="default" :outline="true"><i
										class="fa-solid fa-pencil"></i></base-button>
							</div>
							<div v-show="!cert_document || cer_update">
								<field-validate class="form-control" type="file" name="file_certification"
									:rules="{ 'required': !cert_document || cer_update, ext: ['pdf'] }"
									label="documento certificado" v-model="model.file_certification" />
								<base-button v-if="update && !typeof auditor.documents[0] == 'undefined'"
									@click="reset('file_cer')" size="sm" type="default" :outline="true"><i
										class="fa-solid fa-rotate-left"></i></base-button>
							</div>
						</base-field>
					</div>

					<div class="col-lg-6">
						<base-field name="certification_date" label="Fecha Caducidad Certificado ADR">
							<field-validate class="form-control" name="certification_date" type="date"
								label="fecha caducidad certificado ADR" rules="required" v-model="model.certification_date">
							</field-validate>
						</base-field>
					</div>

					<div class="col-lg-6">
						<base-field name="file_firm" label="Documento de alta">
							<div v-if="firm_document && !firm_update">
								<a href="#" @click.prevent="getDocument(firm_document.id)" class="mr-md-4">{{
										firm_document.name_document ?? firm_document.type.name
								}}</a>
								<base-button @click="firm_update = true" size="sm" type="default" :outline="true"><i
										class="fa-solid fa-pencil"></i></base-button>
							</div>
							<div v-show="firm_update || !firm_document">
								<field-validate class="form-control" type="file" name="file_firm"
									:rules="{ 'required': firm_update || !firm_document, ext: ['pdf'] }"
									label="documento alta" v-model="model.file_firm" />
								<base-button v-if="update && !typeof auditor.documents[1] == 'undefined'"
									@click="firm_update = false" size="sm" type="default" :outline="true"><i
										class="fa-solid fa-rotate-left"></i></base-button>
							</div>
						</base-field>
					</div>

					<div class="col-lg-6">
						<base-field name="firm_date" label="Fecha Alta">
							<field-validate class="form-control" name="firm_date" type="date" label="Fecha certificado"
								rules="required" v-model="model.firm_date" />
						</base-field>
					</div>
				</div>

				<div class="d-flex justify-content-lg-end mt-2">
					<base-button type="default" nativeType="submit" size="sm" v-if="!update">
						Aceptar
					</base-button>
					<base-button type="default" nativeType="submit" size="sm" v-if="update"
						:disabled="!meta.valid">
						Actualizar
					</base-button>
					<base-button type="default" :outline="true" size="md" class="btn-inline-block"
						@click="$emit('closeModal')">
						Cancelar
					</base-button>
				</div>
			</form-validate>
		</template>
		<template v-if="currentStep == 2 && update">
			<div>
				<installation-table :byAuditableId="id" byAuditableType="auditor_id"/>
			</div>
		</template>
	</div>
</template>
<script>

import service from "@/store/services/model-service";
import _ from "lodash";
import utils from "@/mixins/utils-mixin";
import { mapGetters } from 'vuex';
import AsyncSelect from '../core_components/AsyncSelect.vue';
import AddressSelect from "../core_components/AddressSelect.vue";
import InstallationTable from '../Installation/InstallationTable.vue';

export default {
	components: { AsyncSelect, AddressSelect, InstallationTable },
	mixins: [utils],
	name: "form-auditor",
	props: {
		id: {
			default: null,
			required: false
		},
	},
	data() {
		return {
			errors: {},
			api: "auditor",
			model: this.$functions.schemas('auditor'),
			auditor: null,
			provinces: null,
			cer_update: false,
			firm_update: false,
			current_values: null,
			prov_update: null,
			delegate: null,
			new_delegate: false,
			psics_number: null,
			currentStep: 1,
			steps: [
				{
					number: 1,
					title: 'General',
					valid: null,
				},
				{
					number: 2,
					title: 'Instalaciones',
					valid: null,
				},
			],
		};
	},
	methods: {
		async onSubmit(values, { resetForm }) {
			let formData = new FormData();
			formData.append("name", this.model.name);
			formData.append("last_name", this.model.last_name);
			formData.append("email", this.model.email);
			formData.append("phone_number", this.model.phone_number);
			formData.append("dni", this.model.dni);
			formData.append("address", JSON.stringify(this.model.address));
			if (this.ROLE != 'delegate') {
				formData.append("delegate_id", this.modelDelegate.id);
			}
			formData.append("certification_date", this.model.certification_date);
			formData.append("firm_date", this.model.firm_date);

			if (_.isArray(this.model.file_certification)) {
				formData.append("file_certification", this.model.file_certification[0]);
			}

			if (_.isArray(this.model.file_firm)) {
				formData.append("file_firm", this.model.file_firm[0]);
			}

			let response = null
			try {
				if (!this.update) {
					response = await service.store(this.api, formData, true);
				} else {
					response = await service.update(this.api, this.auditor.id, formData, true);
				}
				if (response.status == 201) {
					if (!this.update) {
						resetForm();
						this.$emit("closeModal");
					} else {
						this.show(this.auditor.id)
					}
					this.$emit("saved");
					this.$emit("resetTable");
				}
			} catch (err) {
				console.log(err);
			}
		},
		async show(id) {
			console.log(this.$refs)
			try {
				const response = await service.show(
					"auditor",
					id,
					"includes[]=province.city&includes[]=documents.type&includes[]=delegate.user"
				);
				const data = response.data.data
				this.setCurrent(data)
				this.auditor = this.$functions.copy(data)
				this.model = this.$functions.assignSchema('auditor', data,['address']);
				this.model.name = this.model.user.name;
				this.model.last_name = this.model.user.last_name;
				this.model.email = this.model.user.email;
				this.psics_number = data?.psics_number;
			} catch (err) {
				this.$emit('closeModal')
				console.log(err);
			}
		},
		setCurrent(data) {
			let current = null
			if (this.update) {
				current = {
					name: data.user.name,
					address: data.address,
					last_name: data.user.last_name,
					certification_date: !_.isEmpty(data.documents) ? data.documents[0].document_date : undefined,
					file_firm: undefined,
					file_certification: undefined,
					// delegate_id: "",
					dni: data.dni,
					firm_date: !_.isEmpty(data.documents) ? data.documents[1].document_date : undefined,
					phone_number: data.phone_number,
					province_id: data.province_id,
					email: data.user.email,
				}

				if (this.ROLE != 'delegate') {
					current.delegate = data.delegate
				}
				this.cer_update = false;
				this.firm_update = false;
				this.current_values = null;
				this.prov_update = null;
			}
			this.current_values = current
		},
		reset(op) {
			console.log(op, 'delelele');
			switch (op) {
				case 'delegate':
					console.log('aqui');
					this.delegate = null
					this.new_delegate = false
					break;
				case 'file_cer':
					this.model.file_certification = undefined
					this.cer_update = false
					break;
				case 'file_firm':
					this.model.file_firm = undefined
					this.firm_update = false
					break;
				case 'province':
					this.prov_update = false
					this.model.province_id = this.auditor.province_id
					break;
				default:
					break;
			}
		}
	},
	computed: {
		firm_document() {
			let doc = false;
			if (this.model.documents != null && _.isObject(this.model.documents)) {
				_.forEach(this.model.documents, (document) => {
					if (document.type.name == 'ALTA') {
						doc = document
						this.model.firm_date = doc.document_date
					}
				})
			}
			return doc;
		},
		modelDelegate() {
			let delegate = false
			if (this.update && typeof this.model.delegate.id != 'undefined' && !this.new_delegate) {
				delegate = {
					id: this.model.delegate.id,
					name: this.model.delegate.user.full_name
				}
			}
			else if (this.delegate != null) {
				delegate = {
					id: this.delegate.delegate.id,
					name: this.delegate.full_name
				}
			}
			return delegate;
		},
		cert_document() {
			let doc = false;
			if (this.model.documents != null && typeof this.model.documents == 'object') {
				_.forEach(this.model.documents, (document) => {
					if (document.type.name == 'CERTIFICADO') {
						doc = document
						this.model.certification_date = doc.document_date
					}
				})
			}
			return doc;
		},
		update() {
			return this.id != null
		},
		...mapGetters([
			'ROLE'
		]),
		canShow() {
			let show = false
			if ((this.update && typeof this.model.id != 'undefined') || !this.update) {
				show = true;
			}
			return show;
		}
	},
	watch: {
		id: {
			// the callback will be called immediately after the start of the observation
			handler(val) {
				if (val >= 1 && val != null) {
					this.show(val)
				}
			},
			immediate: true,
		},
		delegate: {
			handler(val) {
				console.log(val);
			}
		}
	}
};
</script>
