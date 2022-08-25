<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{ resetForm }">
            <div class="row border rounded border-light px-4 py-2">
                <div class="col-12 border-bottom border-light mb-md-3">
                    <h4>Datos subcontratista</h4>
                </div>
                <div class=" col-lg-4">
                    <base-field name="business" label="Empresa">
                        <field-validate type="text" class="form-control text-uppercase" name="business" label="business"
                            v-model="model.business" />
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field name="dni" label="CIF/NIF">
                        <field-validate type="text" class="form-control text-uppercase" name="dni"
                            rules="required|alpha_num" label="CIF/NIF" v-model.trim="model.dni" />
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field name="phone_number" label="Teléfono">
                        <field-validate type="number" class="form-control" name="phone_number" rules="required"
                            label="Teléfono" v-model="model.phone_number" />
                    </base-field>
                </div>
                <div class=" col-lg-6">
                    <base-field name="email" label="Email">
                        <field-validate type="text" class="form-control" name="email" rules="required|email"
                            label="email" v-model="model.email" />
                    </base-field>
                </div>
                <div class=" col-lg-6">
                    <base-field name="service" label="Servicio / Producto Ofrecido">
                        <field-validate type="text" class="form-control text-uppercase" name="service" rules="required"
                            label="servicio" v-model="model.service" />
                    </base-field>
                </div>
                <div class=" col-lg-6">
                    <base-field name="file_document_date" label="Fecha documentacion">
                        <field-validate type="date" class="form-control" name="file_document_date"
                            :rules="{ 'required': !$empty(model.file_document.file) }" label="fecha"
                            v-model="model.file_document_date" />
                    </base-field>
                </div>
                <div class=" col-lg-6">
                    <base-field name="file_document" label="Documentacion">
                        <div v-if="model.file_document.file.length >= 1 || document">
                            <span class="mr-md-4">{{ document ? document.name_document :
                                    model.file_document.file[0].name
                            }}</span>
                            <base-button @click="handleChange" size="sm" type="default" :outline="true"><i
                                    class="fa-solid fa-pencil"></i></base-button>
                        </div>
                        <field-validate v-show="(new_doc && $empty(model.file_document.file)) || (!update && !model.file_document.file.length >= 1) || (!document && $empty(model.file_document.file))" class="form-control"
                            type="file" name="file_document"
                            :rules="!$empty(model.file_document_date) && !update ? 'required|ext:pdf' : 'ext:pdf'"
                            :validateOnInput="true" label="documentacion" v-model="model.file_document.file" />
                        <div class="mt-2">
                            <base-button v-if="update && document && new_doc" @click="handleCancel" size="sm" type="default" :outline="true">
                                Cancelar
                            </base-button>
                        </div>
                    </base-field>
                </div>
            </div>
            <div class="row border rounded border-light px-4 py-2 mt-2">
                <div class="col-12 border-bottom border-light mb-md-3">
                    <h4>Datos consejero ADR</h4>
                </div>
                <div class=" col-lg-4">
                    <base-field name="name" label="Nombre">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required"
                            label="Nombre" v-model="model.name" />
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field name="last_name" label="Apellido">
                        <field-validate type="text" class="form-control" name="last_name" rules="" label="Apellido"
                            v-model="model.last_name" />
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field name="adr_dni" label="DNI">
                        <field-validate type="text" class="form-control text-uppercase" name="adr_dni"
                            rules="required|alpha_num" label="adr dni" v-model.trim="model.adr_dni" />
                    </base-field>
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <base-button type="default" nativeType="submit">Aceptar</base-button>
                <base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
                </base-button>
            </div>
        </form-validate>
    </div>
</template>

<script>
import service from "@/store/services/model-service";

import utils from "@/mixins/utils-mixin";
import { forEach, keys } from 'lodash';

export default {
    mixins: [utils],
    props: {
        installation_id: {
            required: true,
            default: null
        },
        subcontractor: {
            type: Object,
            default: null
        },
    },
    data() {
        return {
            model: {
                installation_id: this.installation_id,
                service: "",
                name: "",
                last_name: "",
                dni: "",
                adr_dni: "",
                phone_number: "",
                email: "",
                file_document_date: "",
                file_document: {
                    base64: "",
                    file: [],
                    file_name: null
                },
                business: ""
            },
            types: {},
            designations: {},
            loader: false,

            new_doc: false
        }
    },
    mounted() {
        console.log(this.update);
        if (this.update) {
            this.setModel(this.subcontractor)
        }
    },
    methods: {
        async onSubmit(values, { resetForm }) {
            if (!this.$empty(values.file_document)) {
                this.model.file_document.base64 = await this.toBase64(values.file_document[0])
                this.model.file_document.file_name = values.file_document[0]?.name
            }

            try {
                const data = this.$functions.cleanData(this.model);
                if (this.update) {
                    await service.update('subcontractor',this.subcontractor.id,data);
                }else{
                    await service.store('subcontractor', data);
                    this.$toast.success('Subcontratista registrado')
                    resetForm()
                    this.$emit('close')
                }

                this.$emit('reload')
            } catch (error) {
                console.log(error);
            }
        },
        handleCancel() {
            this.new_doc = false
        },
        handleChange() {
            this.model.file_document.file = []
            if (this.update) {
                this.new_doc = true
            }
        },
        setModel(model) {
            const keys_model = keys(model);
            forEach(keys_model, (k) => {
                console.log(k);
                if (k == 'documents' && this.document) {
                    this.model['file_document_date'] = !this.$empty(model['documents']) ? model['documents'][0].document_date : null
                } else {
                    this.model[k] = model[k]
                }
            })
        },
        handleClose(reset) {
            reset()
            this.$emit('close')
        }
    },
    computed: {
        update() {
            return !this.$empty(this.subcontractor)
        },
        document() {
            return !this.$empty(this.subcontractor.documents) && !this.new_doc ? this.subcontractor.documents[0] : false
        }
    }
}
</script>