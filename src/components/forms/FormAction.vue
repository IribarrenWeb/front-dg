<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm, meta}">
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
                        <field-validate :disabled="show" type="text" class="form-control text-uppercase" name="comment" rules="required" label="acciones" v-model="model.comment"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="file" :label="!show ? 'Adjuntar' : 'Archivo'">
                        <div v-if="show" class="d-flex align-content-center">
                            <a :href="nonconformity.action.url" target="_blank"><i class="fa-regular fa-file-pdf"></i> Archivo</a>
                        </div>
                        <field-validate v-else :disabled="show" type="file" class="form-control" name="file" rules="required|ext:pdf" label="archivo" v-model="model.file"/>
                    </base-field>
                </div>
                <div class=" col-lg-3">
                    <base-input
                        v-if="show"
                        :view="true"
                        :modelValue="action.date_end"
                        label="Fecha de cierre"
                        disabled
                    />
                    <base-field v-else name="date_end" label="Fecha de cierre">
                        <field-validate :disabled="show" type="date" class="form-control text-uppercase" name="date_end" rules="required" label="fecha de cierre" v-model="model.date_end"/>
                    </base-field>
                </div>
                <div class=" col-lg-3">
                    <base-input
                        v-if="show"
                        :view="true"
                        :modelValue="employee_selected.name + ' ' + employee_selected.last_name"
                        label="Responsable"
                        disabled
                    />
                    <base-field v-else name="employee_id" label="Responsable">
                        <field-validate :disabled="show" as="select" class="form-control" name="employee_id" rules="required" label="responsable" v-model="model.employee_id">
                            <option selected>Selecciona un responsable</option>
                            <option :value="employee.id" @input="handle" v-for="employee in employees" :key="employee.id">{{employee.name}} {{employee.last_name}}</option>
                        </field-validate>
                    </base-field>
                </div>
                <div class="col-lg-3">
                    <base-input
                        :view="true"
                        :modelValue="employee_selected != null ? employee_selected.phone_number : ''"
                        label="Fíjo"
                        disabled
                    />
                </div>
                <div class="col-lg-3">
                    <base-input
                        :view="true"
                        :modelValue="employee_selected != null ? employee_selected.email : ''"
                        label="Email"
                        disabled
                    />
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <base-button v-if="role == 'business'" type="default" nativeType="submit" :disabled="!meta.valid"
                >Enviar</base-button
                >
                <base-button v-else type="default" @click="accept"
                ><i class="fa-solid fa-check"></i> Aceptar</base-button
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
import {filter, forEach, keys, isNull, isObject} from "lodash";
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
        },
        show: {
            required: true,
            type:Boolean
        },
        role: {
            required: true,
            type: String
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
            employee_selected: null,
            action: null
        }
    },
    created() {
        if (this.show) {
            this.action = this.nonconformity.action
            this.model.date_end = this.action.date_end
            this.model.comment = this.action.comment
            this.employee_selected = this.action.responsible
        }else{
            this.employess()
        }
    },
    methods: {
        async onSubmit(values, { resetForm }){

            let formData = new FormData();
				
            let keys_arr = keys(this.model);
            
            const $this = this

            forEach(keys_arr, function(key) {
                if (!isNull($this.model[key]) && !isObject($this.model[key])) {
                    formData.append(key,$this.model[key])
                }else{
                    formData.append(key,$this.model[key][0])
                }    
            })
            formData.employee_id = this.employee_selected.id

            this.$store.commit('resetApiErrors')

            try {
                await service.store('non_actions',formData,true);
    
                resetForm()
                
                this.$emit('close')
                this.$emit('reload')
            } catch (error) {
                console.log(error);
            }
        },
        async employess(){
            try {
                const res = await service.getIndex('employee', null, 'installation_id='+this.nonconformity.installation.id)
                this.employees = res.data.data
            } catch (err) {
                console.log(err);
            }
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        },
        async accept(){
            try {
                await service.update('non', this.nonconformity.id, {status: 'COMPLETADO'});
                this.$emit('close')
                this.$emit('reload')
            } catch (err) {
                console.log(err);
            }
        }
    },
    computed: {
        // employee_selected(){
        //     const $this = this;
        //     return filter(this.employees, function(o) { return o.id == $this.model.employee_id; })[0]
        // },
    },
    watch: {
        'model.employee_id': function (newVal) {
            this.employee_selected = filter(this.employees, function(o) { return o.id == newVal; })[0]
        }
    }
}
</script>