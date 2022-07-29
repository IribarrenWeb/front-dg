<template>
	<div>
		<form-validate v-if="canShow" v-slot="{meta}" @submit="onUpdate">
            <base-steps
				v-if="!profile"
				:currentStep="currentStep"
				listClasses="mb-md-4 pb-md-2"
				:steps="steps"
				:meta="meta"
				:edit="true"
				@step="currentStep = $event"
				@navigate="currentStep = $event"
			></base-steps>
			<template v-if="currentStep === 1 || profile">
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
									label="nombre"
									v-model="model.property_name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_last_name" label="Apellido representante">
								<field-validate
									type="text"
									class="form-control"
									name="property_last_name"
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
									rules="alpha_num|min:9|max:9"
									label="dni"
									v-model.trim="model.property_dni"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_phone" label="Móvil">
								<field-validate
									type="text"
									class="form-control"
									name="property_phone"
									rules="min:5|max:15|numeric"
									label="móvil"
									v-model.number="model.property_phone"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_email" label="Email">
								<field-validate
									type="text"
									class="form-control"
									name="property_email"
									rules="email"
									label="email"
									v-model.trim="model.property_email"
								/>
							</base-field>
						</div>
					</div>
					<div class="row border border-light rounded p-2 mt-2">
						<div class="col-12">
							<h4>Datos de empresa</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="name" :required="true" label="Nombre">
								<field-validate
									type="text"
									class="form-control"
									name="name"
									rules="required|"
									label="nombre empresa"
									v-model="model.name"
								/>
							</base-field>
						</div>
                        <div class="col-lg-4">
							<base-field name="email" :required="true" label="Email">
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
									class="form-control"
									name="business_nif"
									rules=""
									label="nombre"
									v-model.trim="model.business_nif"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_phone" label="Fijo">
								<field-validate
									type="text"
									class="form-control"
									name="business_phone"
									rules="min:5|max:15|numeric"
									label="fijó"
									v-model.number="model.business_phone"
								/>
							</base-field>
						</div>
					</div>

					
					<AddressSelect 
						v-model:address="model.address.address" 
						v-model:city="model.address.city" 
						v-model:code="model.address.code" 
						v-model:country="model.address.country"
					/>
				</div>
			</template>
			<template v-if="currentStep === 2 || profile">
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
								rules="alpha_spaces"
								label="nombre"
								v-model="model.holder_name"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="bank_code" label="BIC/SWIFT">
							<field-validate
								type="text"
								class="form-control"
								name="bank_code"
								rules="min:11|max:11"
								label="BIC/SWIFT"
								v-model="model.bank_code"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="iban_number" label="IBAN">
							<field-validate
								type="text"
								class="form-control"
								name="iban_number"
								rules="min:24|max:24|alpha_num"
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
                            <div v-if="file_doc && !new_file_doc">
                                <a href="#" @click="getDocument(file_doc.id)" class="mr-md-4">{{
                                    file_doc.name_document ?? file_doc.type.name
                                }}</a>
                                <base-button
                                    @click="new_file_doc = true"
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
								name="file_doc"
								rules="required|ext:pdf"
								label="documento"
								v-model="model.file_document.file"
							/>
						</base-field>
					</div>
				</div>
			</template>
            <div class="row mx-0 justify-content-end">
                <base-button v-if="canUpdate || profile" type="default" :disabled="!meta.valid || !canUpdate" nativeType="submit"
					>Actualizar</base-button
				>
                <base-button class="ml-2" type="default" @click="currentStep++" v-if="currentStep !== 2 && !canUpdate && !profile" 
					>Siguiente</base-button
				>
                <base-button class="ml-2" type="default" @click="currentStep--" v-if="currentStep !== 1 && !profile"
					>Anterior</base-button
				>
				<base-button
					v-if="!profile"
					type="default"
					:outline="true"
					class="ml-2"
					@click="this.$emit('close')"
					>Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>
<script>
import utils from "@/mixins/utils-mixin";
import service from '../../../store/services/model-service';
import {isEmpty, isEqual} from 'lodash';
import AddressSelect from "../../AddressSelect.vue";

export default {
    props: {
        business: {
            type: Object,
            required: true
        },
		profile: {
			type: Boolean,
			default: false
		},
		user: {
			type: Object,
			required: false
		}
    },
    mixins: [utils],
    data() {
        return {
            steps: [{
                    number: 1,
                    title: "General",
                    valid: false,
                }, {
                    number: 2,
                    title: "Bancario",
                    valid: false,
                },
            ],
            original_model: null,
            model: null,
            new_file_doc: false,
            currentStep: 1,
        };
    },
    async mounted() {
        this.show();
        // this.getProvinces();
    },
    methods: {
        async onUpdate(values) {
            if (this.canUpdate) {
                if (this.currentStep === 2) {
                    if (this.new_firm_doc || !isEmpty(values.file_doc)) {
                        this.model.file_document.base64 = await this.toBase64(values.file_doc[0]);
                        this.model.file_document.file_name = values.file_doc[0]?.name;
						console.log(values.file_doc[0]?.name);
                    }
                }
                try {
                    let data = this.$functions.difference(this.original_model, this.model, ['address']);
                    await service.update("business", this.business.id, data);
                    this.$emit("reload");
                }
                catch (err) {
                    console.log(err);
                }
            }
        },
        async show() {
            this.model = this.$functions.assignSchema('business', this.business,['address']);
            this.model.name = this.model?.user?.name ?? this.user?.name;
            this.model.email = this.model?.user?.email ?? this.user?.email;
            this.model.holder_name = this.model?.bank?.holder_name;
            this.model.iban_number = this.model?.bank?.iban_number;
            this.model.bank_code = this.model?.bank?.bank_code;
            this.model.file_document = { file: null };
            this.model.file_date = this.file_doc ? this.file_doc.document_date : null;
            this.original_model = this.$functions.copy(this.model);
        }
    },
    computed: {
        canUpdate() {
            return !isEqual(this.model, this.original_model);
        },
        file_doc() {
            return this.$functions.filterDoc(this.model.documents, "DOCUMENTACION");
        },
        canShow() {
            let show = false;
            if (this.business != null && this.model != null) {
                show = true;
            }
            return show;
        },
    },
    watch: {
        business() {
            this.show();
        }
    },
    components: { AddressSelect }
}
</script>