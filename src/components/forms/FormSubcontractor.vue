<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <div class="row border rounded border-light px-4 py-2">
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="name" label="Nombre">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required|alpha" label="Nombre" v-model="model.name"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="last_name" label="Apellido">
                        <field-validate type="text" class="form-control" name="last_name" rules="required|alpha" label="Apellido" v-model="model.last_name"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="dni" label="DNI">
                        <field-validate type="number" class="form-control" name="dni" rules="required" label="dni" v-model="model.dni"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="phone_number" label="Móvil">
                        <field-validate type="number" class="form-control" name="phone_number" rules="required" label="Móvil" v-model="model.phone_number"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="email" label="Email">
                        <field-validate type="text" class="form-control" name="email" rules="required|email" label="email" v-model="model.email"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="service" label="Servicio">
                        <field-validate type="text" class="form-control text-uppercase" name="service" rules="required" label="servicio" v-model="model.service"/>
                    </base-field>
                </div>
                <div class="col-md-3">
                    <base-field :apiErrors="apiValidationErrors" name="file_document_date" label="Fecha documentacion">
                        <field-validate type="date" class="form-control" name="file_document_date" rules="required" label="fecha" v-model="model.file_document_date.toForm"/>
                    </base-field>
                </div>
                <div class="col-md-6">
                    <base-field :apiErrors="apiValidationErrors" name="file_document" label="Documentacion">
                        <div v-if="model.file_document.file.length >= 1">
                            <span class="mr-md-4">{{model.file_document.file[0].name}}</span>
                            <base-button @click="model.file_document.file = []" size="sm" type="default" :outline="true">Cambiar</base-button>
                        </div>
                        <field-validate v-show="!model.file_document.file.length >= 1" class="form-control" type="file" name="file_document" rules="required|ext:pdf" :validateOnInput="true" label="documentacion" v-model="model.file_document.file"/>
                    </base-field>
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <base-button type="default" nativeType="submit"
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
            <loader v-if="loader"></loader>
        </form-validate>
    </div>
</template>

<script>
import service from "../../store/services/subcontractor-service";
import formMixin from "@/mixins/form-mixin";
import utils from "@/mixins/utils-mixin";

export default {
    mixins: [formMixin, utils],
    props: {
        installation_id: {
            required: true,
            default: null
        }
    },
    data() {
        return {
            model: {
                installation_id: this.installation_id,
                service: "",
                name: "",
                last_name: "",
                dni: "",
                phone_number: "",
                email: "",
                file_document_date: {
                    date: "",
                    toForm: ""
                },
                file_document: {
                    base64: "",
                    file: []
                },
            },
            types: {},
            designations: {},
            loader: false
        }
    },
    mounted() {

    },
    methods: {
        async onSubmit(values, { resetForm }){
            console.log(values);
            this.loader = true;
            this.model.file_document_date.date = this.formatDate(values.file_document_date)
            this.model.file_document.base64 = await this.toBase64(values.file_document[0])
            this.resetApiValidation()
            try {
                const res = await service.store(this.model);
                console.log(res);
                this.$toast.success('Subcontratista registrado')
                this.loader = false;
                resetForm()
                this.$emit('close')
                this.$emit('reload')
            } catch (err) {
                console.log(err.response);
                if (typeof err.response.data.errors != 'undefined') {
                    this.setApiValidation(err.response.data.errors)
                }
                this.$toast.error('No se pudo registrar el subcontratista')
                this.loader = false;
            }
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        }
    },
}
</script>