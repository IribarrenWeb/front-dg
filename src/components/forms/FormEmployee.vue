<template>
	<div>
        <form-validate ref="form" @submit="onSubmit" v-slot="{ resetForm, meta }">
            <div class="row border rounded border-light px-4 py-2">
                <div class="col-12 border-bottom border-light mb-md-3">
                    <h4>Datos principales</h4>
                </div>
                <div class="col-lg-6 col-lg-4">
                    <base-field apiName="name" name="name" label="Nombre">
                        <field-validate
                            type="text"
                            class="form-control"
                            name="name"
                            rules="required|alpha_spaces"
                            label="Nombre"
                            v-model="model.name"
                        />
                    </base-field>
                </div>

                <div class="col-lg-6 col-lg-4">
                    <base-field
                        apiName="last_name"
                        name="last_name"
                        label="Apellido"
                    >
                        <field-validate
                            type="text"
                            class="form-control"
                            name="last_name"
                            rules="required|alpha_spaces"
                            label="apellido"
                            v-model="model.last_name"
                        />
                    </base-field>
                </div>

                <div class="col-lg-6 col-lg-4">
                    <base-field apiName="dni" name="dni" label="Dni">
                        <field-validate
                            type="number"
                            class="form-control"
                            name="dni"
                            rules="required|alpha_num|min:5|max:15"
                            label="dni"
                            v-model="model.dni"
                        />
                    </base-field>
                </div>
                <div class="col-lg-6 col-lg-4">
                    <base-field apiName="email" name="email" label="Email">
                        <field-validate
                            type="text"
                            class="form-control"
                            name="email"
                            rules="required|email"
                            label="email"
                            v-model="model.email"
                        />
                    </base-field>
                </div>

                <div class="col-lg-6 col-lg-4">
                    <base-field
                        apiName="position"
                        name="position"
                        label="Cargo"
                    >
                        <field-validate
                            type="text"
                            class="form-control"
                            name="position"
                            rules="required|alpha_spaces"
                            label="cargo"
                            v-model="model.position"
                        />
                    </base-field>
                </div>

                <div class="col-lg-6 col-lg-4">
                    <base-field
                        apiName="phone_number"
                        label="Movil"
                        name="phone_number"
                    >
                        <field-validate
                            type="number"
                            class="form-control"
                            name="phone_number"
                            rules="required|min:5|max:15"
                            label="movil"
                            v-model="model.phone_number"
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
                        apiName="date_firm"
                        name="date_firm"
                        label="Fecha de Alta"
                    >
                        <field-validate
                            type="date"
                            class="form-control"
                            name="date_firm"
                            rules="required"
                            label="fecha"
                            v-model="model.date_firm"
                        />
                    </base-field>
                </div>
                <div class="col-lg-6">
                    <base-field
                        apiName="file_firm"
                        name="file_firm"
                        label="Documento de Alta"
                    >
                        <div v-if="model.file_firm.file.length >= 1">
                            <span class="mr-md-4">{{
                                model.file_firm.file[0].name
                            }}</span>
                            <base-button
                                @click="model.file_firm.file = []"
                                size="sm"
                                type="default"
                                :outline="true"
                                >Cambiar</base-button
                            >
                        </div>
                        <field-validate
                            v-else
                            type="file"
                            class="form-control"
                            name="file_firm"
                            rules="required"
                            label="documento"
                            v-model="model.file_firm.file"
                        />
                    </base-field>
                </div>
                <!-- --------------------------------------- -->
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-2">
                            <base-switch
                                v-model="model.driver"
                                label="Conductor"
                                :value="model.driver != 0 ? true : false"
                            ></base-switch>
                        </div>
                        <div class="col-lg-3" v-if="model.driver">
                            <base-field
                                apiName="phone_number"
                                name="adr_permit_id"
                                label="Permiso ADR"
                            >
                                <field-validate
                                    as="select"
                                    class="form-control"
                                    name="adr_permit_id"
                                    v-model="model.adr_permit_id"
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
                        <div class="col-lg-3" v-if="model.driver">
                            <base-field
                                apiName="driver_document_date"
                                name="driver_date"
                                label="Fecha documentacion"
                            >
                                <field-validate
                                    type="date"
                                    class="form-control"
                                    name="driver_date"
                                    v-model="model.driver_document_date"
                                    rules="required"
                                >
                                </field-validate>
                            </base-field>
                        </div>
                        <div class="col-lg-4" v-if="model.driver">
                            <base-field
                                apiName="file_driver"
                                name="file_driver"
                                label="Documentacion ADR"
                            >
                                <div v-if="model.driver_document.file.length >= 1">
                                    <span class="mr-md-4">{{
                                        model.driver_document.file[0].name
                                    }}</span>
                                    <base-button
                                        @click="model.driver_document.file = []"
                                        size="sm"
                                        type="default"
                                        :outline="true"
                                        >Cambiar</base-button
                                    >
                                </div>
                                <field-validate
                                    v-else
                                    type="file"
                                    class="form-control"
                                    name="file_driver"
                                    rules="required"
                                    label="documento"
                                    v-model="model.driver_document.file"
                                />
                            </base-field>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-2">
                            <base-switch
                                v-model="model.dangerous_goods"
                                :value="model.dangerous_goods != 0 ? true : false"
                                label="Mercancias peligrosas"
                            ></base-switch>
                        </div>
                        <div v-if="model.dangerous_goods" class="col-lg-5">
                            <base-field
                                apiName="date_certification"
                                name="date_cer"
                                label="Fecha de formación"
                            >
                                <field-validate
                                    type="date"
                                    class="form-control"
                                    name="date_cer"
                                    rules="required"
                                    label="fecha"
                                    v-model="model.date_certification"
                                />
                            </base-field>
                        </div>
                        <div v-if="model.dangerous_goods" class="col-lg-5">
                            <base-field
                                apiName="file_certification"
                                name="file_cer"
                                label="Documento de formación"
                            >
                                <div v-if="model.file_certification.file.length >= 1">
                                    <span class="mr-md-4">{{
                                        model.file_certification.file[0].name
                                    }}</span>
                                    <base-button
                                        @click="model.file_certification.file = []"
                                        size="sm"
                                        type="default"
                                        :outline="true"
                                        >Cambiar</base-button
                                    >
                                </div>
                                <field-validate
                                    v-else
                                    type="file"
                                    class="form-control"
                                    name="file_cer"
                                    rules="required"
                                    label="documento"
                                    v-model="model.file_certification.file"
                                />
                            </base-field>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <base-switch
                        v-model="model.representative"
                        @change="handleRep"
                        :value="model.representative != 0 ? true : false"
                        label="Representante de la instalación"
                    ></base-switch>
                </div>
                
            </div>
            <div class="mt-4 float-md-right">
                <base-button type="default" :disabled="!meta.valid" nativeType="submit"
                >Enviar</base-button>
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
    import service from "@/store/services/model-service";

	export default {
        name: "form-employee",
        mixins: [utils],
		props: {
			installation_id: {
				required: true,
			},
		},
        data() {
            return {
                model: this.$store.getters.EMPLOYEE_SCHEMA,
                permits: {}
            }
        },
        mounted() {
            this.loadPermits();
        },
        methods: {
            async onSubmit(values, {resetForm}){
                this.model.file_firm.base64 = await this.toBase64(values.file_firm[0])
                if (this.model.driver) {
                    this.model.driver_document.base64 = await this.toBase64(values.file_driver[0])
                }
                if (this.model.dangerous_goods) {
                    this.model.file_certification.base64 = await this.toBase64(values.file_cer[0])
                }
                this.model.installation_id = this.installation_id

                try {
                    await service.store('employee',this.model);
                    this.$emit('reload')
                    resetForm()
                    this.$emit('close')
                } catch (error) {
                    console.log(error);
                    return
                }
            },
            async loadPermits(){
                const res = await this.getPermits()
                this.permits = res;
            },
            handleRep(){
                if (this.model.representative) {
                    this.$swal('¿Estas seguro?', 'Esto cambiara el representante de la instalación', 'warning')
                }
            },
            handleClose(reset){
                reset()
                this.$emit('close')
            },
        },
	};
</script>