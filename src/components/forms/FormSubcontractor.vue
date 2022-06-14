<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <div class="row border rounded border-light px-4 py-2">
                <div class=" col-lg-4">
                    <base-field   name="business" label="Empresa">
                        <field-validate type="text" class="form-control text-uppercase" name="business" label="business" v-model="model.business"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="name" label="Nombre">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required" label="Nombre" v-model="model.name"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="last_name" label="Apellido">
                        <field-validate type="text" class="form-control" name="last_name" rules="required" label="Apellido" v-model="model.last_name"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="dni" label="DNI/CIF/NIF">
                        <field-validate type="number" class="form-control text-uppercase" name="dni" rules="required|alpha_num" label="dni" v-model.trim="model.dni"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="phone_number" label="Teléfono">
                        <field-validate type="number" class="form-control" name="phone_number" rules="required" label="Teléfono" v-model="model.phone_number"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="email" label="Email">
                        <field-validate type="text" class="form-control" name="email" rules="required|email" label="email" v-model="model.email"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="service" label="Servicio / Producto Ofrecido">
                        <field-validate type="text" class="form-control text-uppercase" name="service" rules="required" label="servicio" v-model="model.service"/>
                    </base-field>
                </div>
                <div class=" col-lg-3">
                    <base-field   name="file_document_date" label="Fecha documentacion">
                        <field-validate type="date" class="form-control" name="file_document_date" rules="required" label="fecha" v-model="model.file_document_date.toForm"/>
                    </base-field>
                </div>
                <div class=" col-lg-6">
                    <base-field   name="file_document" label="Documentacion">
                        <div v-if="model.file_document.file.length >= 1">
                            <span class="mr-md-4">{{model.file_document.file[0].name}}</span>
                            <base-button @click="model.file_document.file = []" size="sm" type="default" :outline="true"><i class="fa-solid fa-pencil"></i></base-button>
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
        </form-validate>
    </div>
</template>

<script>
import service from "@/store/services/model-service";
 
import utils from "@/mixins/utils-mixin";

export default {
    mixins: [utils],
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
                business: ""
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
            this.model.file_document_date.date = this.formatDate(values.file_document_date)
            this.model.file_document.base64 = await this.toBase64(values.file_document[0])
            this.$store.commit('resetApiErrors')

            try {
                await service.store('subcontractor',this.model);
    
                this.$toast.success('Subcontratista registrado')
    
                resetForm()
                
                this.$emit('close')
                this.$emit('reload')
            } catch (error) {
                console.log(error);
            }
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        }
    },
}
</script>