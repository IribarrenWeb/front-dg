<template>
    <div>
        <div class="text-center text-uppercase mb-md-3">
            <h3>Agregar una instalacion</h3>
        </div>
        <form-validate @submit="onSubmit" v-slot="{ resetForm, meta }">
            <ul class="nav nav-pills mb-md-4 justify-content-center">
                <li class="nav-item" v-for="step in steps" :key="step.key">
                    <a class="nav-link p-2" :class="[{'active':step.valid||currentStep == step.number},{'disabled':!step.valid && currentStep != step.number}]" href="#" @click.prevent="meta.valid ? currentStep = step.number : ''">
                        <i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i> 
                        {{step.title}}
                    </a>
                </li>
            </ul>
            <template v-if="currentStep == 1">
                <div class="row border rounded border-light px-4 py-2">
                    <div class="col-md-4">
                        <base-field :apiErrors="apiValidationErrors" name="name" label="Nombre de instalacion">
                            <field-validate type="text" class="form-control" name="name" rules="required" label="Nombre" v-model="model.name"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field :apiErrors="apiValidationErrors" name="address" label="Direccion">
                            <field-validate type="text" class="form-control" name="address" rules="required" label="direccion" v-model="model.address"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field :apiErrors="apiValidationErrors" name="auditable" label="Auditor">
                            <div v-if="model.auditable != null">
                                <span class="mr-md-4 text-uppercase">{{model.auditable.user.name}} {{model.auditable.user.last_name}}</span>
                                <base-button @click="model.auditable = null" size="sm" type="default" :outline="true">Cambiar</base-button>
                            </div>
                            <div v-else>
                                <field-validate name="auditable" label="Auditor" rules="required" v-slot="{ field }" v-model="model.auditable">
                                    <Multiselect
                                        :searchable="true"
                                        v-bind="field"
                                        :min-chars="2"
                                        :delay="500"
                                        :required="true"
                                        :options="fetchItems"
                                        ref="multiselect"
                                        @select="auditable = $event"
                                    >
                                    </Multiselect>
                                </field-validate>
                            </div>
                        </base-field>
                    </div>
                    <div class="col-md-6">
                        <base-field :apiErrors="apiValidationErrors" name="province_id" label="Provincia">
                            <field-validate class="form-control" as="select" name="province_id" rules="required" label="Provincia" v-model="model.province_id">
                                <option value="" selected>Selecciona una provincia</option>
                                <option v-for="province in provinces" :key="province.id" :value="province.id">{{province.name}}</option>
                            </field-validate>
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
            </template>
            <!-- ------------------------------------------------------ -->
            <template v-if="currentStep == 2">
                <div>
                    <div class="row border rounded border-light px-4 py-2">
                        <div class="col-md-12">
                            <base-field :apiErrors="apiValidationErrors" name="operations" label="Tipos de operaciones">
                                <div v-for="operation in operations" :key="operation.key">
                                    <field-validate 
                                        type="checkbox" 
                                        name="operations" 
                                        :value="operation.value"
                                        rules="required" label="operaciones">
                                    </field-validate>
                                    <label for="" class="ml-4">{{operation.label}}</label>
                                </div>
                            </base-field>
                        </div>
                    </div>
                    <div class="row border rounded border-light px-4 py-2 mt-3">
                        <div class="col-md-12">
                            <base-field :apiErrors="apiValidationErrors" name="equipments" label="Tipos de equipamientos" labelClasses="d-block">
                                <div v-for="equipment in equipments" :key="equipment.key" class="d-inline-block">
                                    <field-validate 
                                        type="checkbox" 
                                        name="equipments"
                                        :value="equipment.value"
                                        rules="required" label="equipamientos">
                                    </field-validate>
                                    <label for=""  class="mx-4">{{equipment.label}}</label>
                                </div>
                            </base-field>
                        </div>
                    </div>
                </div>
            </template>
            <!-- ------------------------------------------------------ -->
            <template v-if="currentStep == 3">
                <div class="row border rounded border-light px-4 py-2">
                    <div class="col-12 border-bottom border-light mb-md-3">
                        <h4>Datos principales</h4>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.name" name="name" label="Nombre">
                            <field-validate type="text" class="form-control" name="name" rules="required" label="Nombre" v-model="model.responsible.name"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.last_name" name="last_name" label="Apellido">
                            <field-validate type="text" class="form-control" name="last_name" rules="required" label="apellido" v-model="model.responsible.last_name"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.dni" name="dni" label="Dni">
                            <field-validate type="number" class="form-control" name="dni" rules="required" label="dni" v-model="model.responsible.dni"/>
                        </base-field>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.email" name="email" label="Email">
                            <field-validate type="text" class="form-control" name="email" rules="required" label="email" v-model="model.responsible.email"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.position" name="position" label="Posicion">
                            <field-validate type="text" class="form-control" name="position" rules="required" label="posicion" v-model="model.responsible.position"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.phone_number" label="Movil" name="phone_number">
                            <field-validate type="number" class="form-control" name="phone_number" rules="required" label="movil" v-model="model.responsible.phone_number"/>
                        </base-field>
                    </div>
                </div>
                <div class="row border rounded border-light px-4 py-2 mt-3">
                    <div class="col-12 border-bottom border-light mb-md-3">
                        <h4>Documentacion</h4>
                    </div>
                    <div class="col-md-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.date_firm" name="date_firm" label="Fecha de firma">
                            <field-validate type="date" class="form-control" name="date_firm" rules="required" label="fecha" v-model="model.responsible.date_firm.toForm"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.date_certification" name="date_cer" label="Fecha de formacion">
                            <field-validate type="date" class="form-control" name="date_cer" rules="required" label="fecha" v-model="model.responsible.date_certification.toForm"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field :apiErrors="apiValidationErrors" apiName="responsible.file_certification" name="file_cer" label="Documento de formacion">
                            <div v-if="model.responsible.file_certification.file.length >= 1">
                                <span class="mr-md-4">{{model.responsible.file_certification.file[0].name}}</span>
                                <base-button @click="model.responsible.file_certification.file = []" size="sm" type="default" :outline="true">Cambiar</base-button>
                            </div>
                            <field-validate v-else type="file" class="form-control" name="file_cer" rules="required" label="documento" v-model="model.responsible.file_certification.file"/>
                        </base-field>
                    </div>

                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-2">
                                <base-switch
                                    v-model="model.responsible.driver" label="Conductor"
                                ></base-switch>
                            </div>
                            <div class="col-md-3" v-if="model.responsible.driver">
                                <base-field :apiErrors="apiValidationErrors" apiName="responsible.phone_number" name="adr_permit_id" label="Permiso ADR">
                                    <field-validate as="select" class="form-control" name="adr_permit_id" v-model="model.responsible.adr_permit_id" rules="required">
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
                            <div class="col-md-3" v-if="model.responsible.driver">
                                <base-field :apiErrors="apiValidationErrors" apiName="responsible.driver_document_date" name="driver_date" label="Fecha documentacion">
                                    <field-validate type="date" class="form-control" name="driver_date" v-model="model.responsible.driver_document_date.toForm" rules="required">
                                    </field-validate>
                                </base-field>
                            </div>
                            <div class="col-md-4" v-if="model.responsible.driver">
                                <base-field :apiErrors="apiValidationErrors" apiName="responsible.file_driver" name="file_driver" label="Documentacion ADR">
                                    <div v-if="model.responsible.driver_document.file.length >= 1">
                                        <span class="mr-md-4">{{model.responsible.driver_document.file[0].name}}</span>
                                        <base-button @click="model.responsible.driver_document.file = []" size="sm" type="default" :outline="true">Cambiar</base-button>
                                    </div>
                                    <field-validate v-else type="file" class="form-control" name="file_driver" rules="required" label="documento" v-model="model.responsible.driver_document.file"/>
                                </base-field>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <base-switch v-model="model.responsible.dangerous_goods" label="Mercancias peligrosas"
                        ></base-switch>
                    </div>
                </div>
            </template>
            <!-- ------------------------------------------------------- -->
            <div class="mt-4 float-md-right">
                <base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
                >Anterior</base-button
                >
                <base-button type="default" nativeType="submit" v-if="currentStep !== 3"
                >Siguiente</base-button
                >
                <base-button type="default" nativeType="submit" v-if="currentStep === 3"
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
            <loader v-if="loader"/>
        </form-validate>
    </div>
</template>
<script>
import auditorService from "../../../store/services/auditors-service";
import dataService from "../../../store/services/data-service";
import Multiselect from "@vueform/multiselect";
import utils from "../../../mixins/utils-mixin";
import _ from "lodash";
import service from "../../../store/services/installation-service";
import formMixin from "../../../mixins/form-mixin";

export default {
    components: {Multiselect},
    mixins: [utils, formMixin],
    props: {
        business_id: {
            type:Number,
            required:true
        }
    },
    data() {
        return {
            steps: [
                {
                    number: 1,
                    title: "Instalacion",
                    valid: false
                },
                {
                    number: 2,
                    title: "Operaciones",
                    valid: false
                },
                {
                    number: 3,
                    title: "Responsable",
                    valid: false
                }
            ],
            currentStep: 1,
            auditable: null,
            model: {
                name: "",
                address: "",
                business_id: this.business_id,
                auditable_id: null,
                province_id: null,
                file_document: {
                    base64: "",
                    file: []
                },
                operation_types_ids:{},
                equipments_ids:{},
                responsible: {
                    name: "",
                    last_name: "",
                    email: "",
                    dni: "",
                    phone_number: "",
                    position: "",
                    driver: false,
                    dangerous_goods: false,
                    driver_document: {
                        base64: "",
                        file: []
                    },
                    driver_document_date: {
                        date: "",
                        toForm: ""
                    },
                    adr_permit_id: null,
                    file_firm: {
                        base64: "",
                        file: []
                    },
                    date_firm: {
                        date: "",
                        toForm: ""
                    },
                    file_certification: {
                        base64: "",
                        file: []
                    },
                    date_certification: {
                        date: "",
                        toForm: ""
                    },
                },
            },
            provinces: [{
                value: "",
                label: ""
            }],
            operations: [],
            equipments: [],
            permits: {}
        }
    },
    mounted() {
        this.loadProvinces()
        this.loadEquipments()
        this.loadOperations()
        this.loadPermits();
        this.initVals()
    },
    methods:{
        async onSubmit(values, { resetForm }){
            for (let index = 0; index < this.steps.length; index++) {
                const step = this.steps[index];
                if (step.number == this.currentStep) {
                    step.valid = true
                }   
            }
            const inst = values 

            if (this.currentStep == 1) {
                this.model.file_document.base64 = await this.toBase64(inst.file_document[0])
                this.model.auditable_id = this.model.auditable.id;
            }

            if (this.currentStep == 2) {
                this.model.equipments_ids = inst.equipments
                this.model.operation_types_ids = inst.operations
            }

            if (this.currentStep == 3) {
                this.model.responsible.file_certification.base64 = await this.toBase64(inst.file_cer[0])
                this.model.responsible.date_certification.date = this.formatDate(inst.date_cer);
                this.model.responsible.date_firm.date = this.formatDate(inst.date_firm);
                if (this.model.responsible.driver) {
                    this.model.responsible.driver_document.base64 = await this.toBase64(inst.file_driver[0])
                    this.model.responsible.driver_document_date.date = this.formatDate(inst.driver_date)
                }
            }

            if (this.currentStep === 3) {
                this.loader = true;
                try {
                    const res = await service.store(this.model);
                    console.log(res);
                    this.$emit('close')
                    this.$emit('reload')
                    this.currentStep = 0
                    resetForm()
                    this.initVals()
                    this.loader = false
                    this.$swal('Instalacion registrada', 'La instalacion se ha registrado correctamente', 'success')
                } catch (err) {
                    this.loader = false
                    let message = !_.isEmpty(err.response) ? err.response.data.message : 'Ocurrio un error en el servidor';
                    if (!_.isEmpty(err.response)) {
                        this.setApiValidation(err.response.data.errors)
                        this.currentStep = 0
                    }
                    this.$swal('Error', message, 'error')
                }
            }
           
            if (this.currentStep !== 3) {
                this.currentStep++
            }
        },
        async fetchItems(search){
            const res = await auditorService.getIndex(`name=${search}&includes[]=user`);
            const data = res.data.data;
            let options = _.map(data, (auditor) => {
                return {value: auditor, label: `${auditor.user.name} ${auditor.user.last_name} - ${auditor.dni}`}
            })
            return options
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        },
        async loadProvinces(){
            const res = await dataService.getProvinces()
            this.provinces = res.data.data;
        },
        async loadPermits(){
            const res = await this.getPermits()
            this.permits = res;
        },
        async loadEquipments(){
            const res = await dataService.getEquipments()
            const data = res.data.data;
            let equipments = _.map(data, (equipment) => {
                return {value: equipment.id, label: equipment.name, checked: true}
            })
            this.equipments = equipments
            return 
        },
        async loadOperations(){
            const res = await dataService.getOperations()
            const data = res.data.data;
            let operations = _.map(data, (operation) => {
                return {value: operation.id, label: operation.name, checked: false}
            })
            this.operations = operations
            return 
        },
        prevStep(){
            if (this.currentStep == 0 || this.currentStep == 1) {
                return 
            }
            this.currentStep--
        },
        initVals(){
            this.steps = [
                {
                    number: 1,
                    title: "Instalacion",
                    valid: false
                },
                {
                    number: 2,
                    title: "Operaciones",
                    valid: false
                },
                {
                    number: 3,
                    title: "Responsable",
                    valid: false
                }
            ]; 
            this.model = {};

            this.model = {
                name: "",
                address: "",
                business_id: this.business_id,
                auditable_id: null,
                province_id: null,
                file_document: {
                    base64: "",
                    file: []
                },
                operation_types_ids:{},
                equipments_ids:{},
                responsible: {
                    name: "",
                    last_name: "",
                    email: "",
                    dni: "",
                    phone_number: "",
                    position: "",
                    driver: false,
                    dangerous_goods: false,
                    driver_document: {
                        base64: "",
                        file: []
                    },
                    driver_document_date: {
                        date: "",
                        toForm: ""
                    },
                    adr_permit_id: null,
                    file_firm: {
                        base64: "",
                        file: []
                    },
                    date_firm: {
                        date: "",
                        toForm: ""
                    },
                    file_certification: {
                        base64: "",
                        file: []
                    },
                    date_certification: {
                        date: "",
                        toForm: ""
                    },
                },
            }
        }
    }
}
</script>
<style scoped>
.nav-link.disabled {
    color: #8898aa !important;
    pointer-events: none;
    cursor: default;
}
</style>