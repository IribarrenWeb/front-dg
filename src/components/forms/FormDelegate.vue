<template>
	<div>
		<form-validate
			@submit="onSubmit"
			ref="form"
			v-slot="{ meta }"
			:initial-values="current_values"
		>
			<div class="row border rounded border-light px-md-3 py-md-2 mt-2 my-md-3 my-2">
				<div class="col-12">
					<h4>
						Datos de delegacion <span class="text-muted">(Si aplica)</span>
					</h4>
					<hr />
				</div>
				<div class="col-lg-6">
					<base-field name="delegation_name" label="Nombre de delegación">
						<field-validate
							class="form-control"
							name="delegation_name"
							type="text"
							label="nombre de delegación"
							rules="alpha_spaces|max:30"
							v-model="model.delegation_name"
						/>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="cif_nif" label="CIF/NIF">
						<field-validate
							class="form-control"
							name="cif_nif"
							type="text"
							label="CIF/NIF"
							rules="alpha_num|min:5|max:15"
							v-model="model.cif_nif"
						/>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="delegation_phone" label="Fíjo">
						<field-validate
							class="form-control"
							name="delegation_phone"
							type="number"
							label="fíjo"
							rules="max:15"
							v-model="model.delegation_phone"
						/>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="address" label="Dirección">
						<field-validate
							class="form-control"
							name="address"
							type="text"
							label="Dirección"
							rules="max:50"
							v-model="model.address"
						/>
					</base-field>
				</div>
			</div>
			<div class="row border rounded border-light px-md-3 py-md-2">
				<div class="col-12">
					<h4>Datos generales</h4>
					<hr />
				</div>
				<div class="col-lg-4">
					<base-field label="Nombre">
						<field-validate
							class="form-control"
							name="name"
							label="nombre"
							rules="required|max:20"
							v-model="model.name"
						/>
					</base-field>
				</div>

				<div class="col-lg-4">
					<base-field name="last_name" label="Apellido">
						<field-validate
							class="form-control"
							name="last_name"
							label="apellido"
							rules="required|max:20|alpha_spaces"
							v-model="model.last_name"
						/>
					</base-field>
				</div>

				<div class="col-lg-4">
					<base-field name="phone_number" label="Móvil">
						<field-validate
							class="form-control"
							name="phone_number"
							label="móvil"
							rules="required|min:7|max:15"
							v-model="model.phone_number"
						/>
					</base-field>
				</div>

				<div class="col-lg-4">
					<base-field name="dni" label="DNI">
						<field-validate
							class="form-control"
							name="dni"
							label="dni"
							rules="required|min:9|max:9|alpha_num"
							v-model="model.dni"
						/>
					</base-field>
				</div>

				<div class="col-lg-4">
					<base-field name="email" label="Email">
						<field-validate
							class="form-control"
							name="email"
							label="email"
							rules="required|email"
							v-model="model.email"
						/>
					</base-field>
				</div>

				<div class="col-lg-4">
					<base-field name="province_id" label="Provincia">
						<div v-if="update && (!prov_update && typeof model.province != null)" class="d-flex">
							<input
								type="text"
								class="form-control mr-md-3"
								disabled
								:value="model.province.name"
							/>
							<base-button
								@click="prov_update = true"
								size="sm"
								type="default"
								:outline="true"
								><i class="fa-solid fa-pencil"></i
							></base-button>
						</div>
						<div v-show="!update || prov_update">
							<field-validate
								class="form-control"
								as="select"
								name="province_id"
								:rules="{ required: !update || prov_update }"
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
							<base-button
								v-if="update"
								@click="reset('province')"
								size="sm"
								type="default"
								:outline="true"
								><i class="fa-solid fa-rotate-left"></i
							></base-button>
						</div>
					</base-field>
				</div>
			</div>

			<div
				class="row border rounded border-light px-md-3 py-md-2 mt-2 mt-md-3"
			>
				<div class="col-12">
					<h4>Documentacion</h4>
					<hr />
				</div>
				<div class="col-lg-6">
					<base-field
						name="file_certification"
						label="Documento de ceritificado"
					>
						<div v-if="cert_document && !cer_update">
							<a
								href="#"
								@click.prevent="getDocument(cert_document.id)"
								class="mr-md-4"
								>{{ cert_document.type.name }}</a
							>
							<base-button
								@click="cer_update = true"
								size="sm"
								type="default"
								:outline="true"
								><i class="fa-solid fa-pencil"></i
							></base-button>
						</div>
						<div v-show="!cert_document || cer_update">
							<field-validate
								class="form-control"
								type="file"
								name="file_certification"
								:rules="{
									required: !cert_document || cer_update,
									ext: ['pdf'],
								}"
								label="documento certificado"
								v-model="model.file_certification"
							/>
							<base-button
								v-if="update && cer_update"
								@click="reset('file_cer')"
								size="sm"
								type="default"
								:outline="true"
								><i class="fa-solid fa-rotate-left"></i
							></base-button>
						</div>
					</base-field>
				</div>

				<div class="col-lg-6">
					<base-field name="certification_date" label="Fecha certificado">
						<field-validate
							class="form-control"
							name="certification_date"
							type="date"
							label="Fecha certificado"
							rules="required"
							v-model="model.certification_date"
						/>
					</base-field>
				</div>

				<div class="col-lg-6">
					<base-field name="file_firm" label="Documento de alta">
						<div v-if="firm_document && !firm_update">
							<a
								href="#"
								@click.prevent="getDocument(firm_document.id)"
								class="mr-md-4"
								>{{ firm_document.type.name }}</a
							>
							<base-button
								@click="firm_update = true"
								size="sm"
								type="default"
								:outline="true"
								><i class="fa-solid fa-pencil"></i
							></base-button>
						</div>
						<div v-show="firm_update || !firm_document">
							<field-validate
								class="form-control"
								type="file"
								name="file_firm"
								:rules="{
									required: firm_update || !firm_document,
									ext: ['pdf'],
								}"
								label="documento alta"
								v-model="model.file_firm"
							/>
							<base-button
								v-if="update && firm_update"
								@click="firm_update = false"
								size="sm"
								type="default"
								:outline="true"
								><i class="fa-solid fa-rotate-left"></i
							></base-button>
						</div>
					</base-field>
				</div>

				<div class="col-lg-6">
					<base-field name="firm_date" label="Fecha Alta">
						<field-validate
							class="form-control"
							name="firm_date"
							type="date"
							label="Fecha certificado"
							rules="required"
							v-model="model.firm_date"
						/>
					</base-field>
				</div>
			</div>

			<div class="d-flex justify-content-lg-end my-3">
				<base-button
					type="default"
					nativeType="submit"
					size="sm"
					v-if="!update"
					:disabled="!meta.valid"
				>
					Enviar
				</base-button>
				<base-button
					type="default"
					nativeType="submit"
					size="sm"
					v-if="update"
					:disabled="!meta.valid || !meta.dirty"
				>
					Actualizar
				</base-button>
				<base-button
					type="default"
					:outline="true"
					size="md"
					class="btn-inline-block"
					@click="$emit('closeModal')"
				>
					Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>
<script>
	import service from "@/store/services/model-service";
	import dataService from "@/store/services/data-service";
	import _ from "lodash";

	import utils from "@/mixins/utils-mixin";
	import { mapGetters } from "vuex";
	export default {
		mixins: [utils],
		name: "form-delegate",
		props: {
			id: {
				default: null,
				required: false,
			},
		},
		data() {
			return {
				errors: {},
				api: "delegate",
				model: this.$store.getters.DELEGATE_SCHEMA,
				delegate: null,
				provinces: null,
				cer_update: false,
				firm_update: false,
				current_values: null,
				prov_update: null,
			};
		},
		mounted() {
			this.loadProvinces();
		},
		methods: {
			async onSubmit(values, { resetForm }) {
				let formData = new FormData();
				
                let keys = _.keys(this.model);
                
                const $this = this

                _.forEach(keys, function(key) {
                    if (!_.isNull($this.model[key]) && !_.includes(['user','province','documents','created_at', 'id'],key)) {
                        if (key == 'file_certification' || key == 'file_firm') {
                            formData.append(key, $this.model[key][0]);
                        }else{
                            formData.append(key,$this.model[key])
                        }
                    }    
                })

				let response = null;
				try {
					if (!this.update) {
						response = await service.store(this.api, formData, true);
					} else {
						response = await service.update(
							this.api,
							this.delegate.id,
							formData,
							true
						);
					}
					if (response.status == 201) {
						if (!this.update) {
							resetForm();
							this.$emit("closeModal");
						} else {
							this.show(this.delegate.id);
						}
						this.$emit("resetTable");
					}
				} catch (err) {
					console.log(err);
				}
			},
			async loadProvinces() {
				const res = await dataService.getProvinces();
				this.provinces = res.data.data;
			},
			async fetchItems(search) {
				if (_.isEmpty(search)) {
					return {};
				}
				const res = await service.getIndex(
					"delegate",
					`name=${search}&includes[]=user`
				);
				const data = res.data.data;
				let options = _.map(data, (delegate) => {
					return {
						value: delegate,
						label: `${delegate.user.name} ${delegate.user.last_name} - ${delegate.dni}`,
					};
				});
				return options;
			},
			async show(id) {
				console.log(this.$refs);
				try {
					const response = await service.show(
						"delegate",
						id,
						"includes[]=province&includes[]=documents.type"
					);
					const data = response.data.data;
					this.setCurrent(data);
					this.delegate = this.COPY(data);
					this.model = this.COPY(data);
					this.model.name = this.model.user.name;
					this.model.last_name = this.model.user.last_name;
					this.model.email = this.model.user.email;
				} catch (err) {
					this.$emit("closeModal");
					console.log(err);
				}
			},
			setCurrent(data) {
				let current = null;
				if (this.update) {
					current = {
						name: data.user.name,
						last_name: data.user.last_name,
						// delegate_id: "",
						dni: data.dni,
						phone_number: data.phone_number,
						delegation_phone: data.delegation_phone != null ? data.delegation_phone : '',
						delegation_name: data.delegation_name != null ? data.delegation_name : '',
						address: data.address != null ? data.address : '',
						cif_nif: data.cif_nif != null ? data.cif_nif : '',
						province_id: data.province_id,
						email: data.user.email,
					};

					if (data.documents.length >= 1) {
						current.file_certification = undefined;
						current.certification_date = data.documents[0].document_date;
						current.file_firm = undefined;
						current.firm_date = data.documents[1].document_date;
					}
					this.cer_update = false;
					this.firm_update = false;
					this.current_values = null;
					this.prov_update = null;
				}
				this.current_values = current;
			},
			reset(op) {
				switch (op) {
					case "delegate":
						this.model.delegate = this.COPY(this.delegate.delegate);
						break;
					case "file_cer":
						this.model.file_certification = undefined;
						this.cer_update = false;
						break;
					case "file_firm":
						this.model.file_firm = undefined;
						this.firm_update = false;
						break;
					case "province":
						this.prov_update = false;
						this.model.province_id = this.delegate.province_id;
						break;
					default:
						break;
				}
			},
		},
		computed: {
			firm_document() {
				let doc = false;
				if (this.model.documents != null && _.isObject(this.model.documents)) {
					_.forEach(this.model.documents, (document) => {
						if (document.type.name == "ALTA") {
							doc = document;
							this.model.firm_date = doc.document_date;
						}
					});
				}
				return doc;
			},
			cert_document() {
				let doc = false;
				if (
					this.model.documents != null &&
					typeof this.model.documents == "object"
				) {
					_.forEach(this.model.documents, (document) => {
						if (document.type.name == "CERTIFICADO") {
							doc = document;
							this.model.certification_date = doc.document_date;
						}
					});
				}
				return doc;
			},
			update() {
				return this.id != null;
			},
			...mapGetters(["COPY"]),
		},
		watch: {
			id: {
				// the callback will be called immediately after the start of the observation
				handler(val) {
					if (val >= 1 && val != null) {
						this.show(val);
					}
				},
				immediate: true,
			},
		},
	};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
