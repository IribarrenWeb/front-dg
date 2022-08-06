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
					<general-data
						class="mb-2"
						v-model:property_name="model.property_name"
						v-model:property_last_name="model.property_last_name"
						v-model:property_dni="model.property_dni"
						v-model:property_phone="model.property_phone"
						v-model:property_email="model.property_email"
					/>

					<business-data
						v-model:name="model.name"
						v-model:email="model.email"
						v-model:business_nif="model.business_nif"
						v-model:business_phone="model.business_phone"
					/>
					
					<AddressSelect 
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
			<template v-if="currentStep === 2 || profile">
				<responsible-data
					class="mb-3"
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
import GeneralData from './Modules/GeneralData.vue';
import BusinessData from './Modules/BusinessData.vue';
import ResponsibleData from './Modules/ResponsibleData.vue';
import BankData from './Modules/BankData.vue';

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
    components: { AddressSelect, GeneralData, BusinessData, ResponsibleData, BankData}
}
</script>,
        