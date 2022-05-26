<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <div class="row border rounded border-light px-4 py-2 mb-2">
                <div class="col-12">
                    <h4>DATOS GENERALES</h4>
                </div>
                <div class=" col-lg-4">
                    <base-input
                        :view="true"
                        :modelValue="nonconformity.installation.name"
                        label="Nombre de la instalación"
                        disabled
                    />
                </div>
                <div class=" col-lg-4">
                    <base-input
                        :view="true"
                        :modelValue="formatDate(nonconformity.created_at, 'en-GB')"
                        label="Fecha inicio"
                        disabled
                    />
                </div>
                <div class=" col-lg-4">
                    <base-input
                        :view="true"
                        :modelValue="nonconformity.priority.name"
                        label="Tipo"
                        disabled
                    />
                </div>
                <div class=" col-lg-4">
                    <base-input
                        :view="true"
                        :modelValue="'<'+nonconformity.priority.term + 'MES'"
                        label="Plazo"
                        disabled
                    />
                </div>
                <div class=" col-lg-4">
                    <base-input
                        :view="true"
                        :modelValue="nonconformity.description"
                        label="Razón y medidas"
                        disabled
                    />
                </div>
            </div>
            <div class="row border rounded border-light px-4 py-2">
                <div class="col-12">
                    <h4>ACTUACIÓN Y CIERRE</h4>
                </div>
                <div class=" col-lg-8">
                    <base-field   name="comment" label="Acciones llevadas a cabo">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required" label="acciones" v-model="model.comment"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="file" label="Adjuntar">
                        <field-validate type="file" class="form-control" name="last_name" rules="required|ext:pdf" label="archivo" v-model="model.file"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="date_end" label="Fecha de cierre">
                        <field-validate type="date" class="form-control text-uppercase" name="fecha de cierre" rules="required" label="fecha de cierre" v-model="model.date_end"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="employee_id" label="Responsable">
                        <field-validate as="select" class="form-control" name="employee_id" rules="required" label="responsable" v-model="model.employee_id">
                            <option></option>
                            <option></option>
                            <option></option>
                            <option></option>
                            <option></option>
                        </field-validate>
                    </base-field>
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <!-- <base-button type="default" nativeType="submit"
                >Enviar</base-button
                > -->
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
    name: 'form-action',
    props: {
        installation_id: {
            required: true,
            default: null
        },
        nonconformity: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            model: {
                nonconformity_id: this.nonconformity.id,
                date_end: "",
                file: "",
                comment: "",
                employee_id: "",
            },
            employees: {},
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