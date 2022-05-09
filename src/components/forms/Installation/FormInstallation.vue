<template>
    <div>
        <div class="text-center text-uppercase mb-md-3">
            <h3>Agregar una instalación</h3>
        </div>
        <form-validate ref="form" @submit="onSubmit" v-slot="{ resetForm, meta }">
            <base-steps :currentStep="currentStep" listClasses="mb-md-4 pb-md-2" :steps="steps" :meta="meta" @step="currentStep = $event"></base-steps>
            <template v-if="currentStep == 1">
                <div class="row border rounded border-light px-4 py-2">
                    <div class="col-md-4">
                        <base-field   name="name" label="Nombre de instalacion">
                            <field-validate :disabled="isSaved" type="text" class="form-control" name="name" rules="required" label="Nombre" v-model="model.name"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field   name="address" label="Direccion">
                            <field-validate :disabled="isSaved" type="text" class="form-control" name="address" rules="required" label="direccion" v-model="model.address"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field   name="auditable" label="Auditor">
                            <div v-if="model.auditable != null">
                                <span class="mr-md-4 text-uppercase">{{model.auditable.user.name}} {{model.auditable.user.last_name}}</span>
                                <base-button @click="model.auditable = null" size="sm" type="default" :outline="true" :disabled="isSaved">Cambiar</base-button>
                            </div>
                            <div v-else>
                                <field-validate :disabled="isSaved" name="auditable" label="Auditor" rules="required" v-slot="{ field }" v-model="model.auditable">
                                    <Multiselect
                                        :searchable="true"
                                        v-bind="field"
                                        :min-chars="2"
                                        :delay="500"
                                        :required="true"
                                        :options="fetchItems"
                                        ref="multiselect"
                                        @select="auditable = $event"
                                        :disabled="isSaved"
                                    >
                                    </Multiselect>
                                </field-validate>
                            </div>
                        </base-field>
                    </div>
                    <div class="col-md-6">
                        <base-field   name="province_id" label="Provincia">
                            <field-validate :disabled="isSaved" class="form-control" as="select" name="province_id" rules="required" label="Provincia" v-model="model.province_id">
                                <option value="" selected>Selecciona una provincia</option>
                                <option v-for="province in provinces" :key="province.id" :value="province.id">{{province.name}}</option>
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-6">
                        <base-field   name="file_document" label="Documentacion">
                            <div v-if="model.file_document.file.length >= 1">
                                <span class="mr-md-4">{{model.file_document.file[0].name}}</span>
                                <base-button @click="model.file_document.file = []" size="sm" type="default" :outline="true" :disabled="isSaved">Cambiar</base-button>
                            </div>
                            <field-validate :disabled="isSaved" v-show="!model.file_document.file.length >= 1" class="form-control" type="file" name="file_document" rules="required|ext:pdf" :validateOnInput="true" label="documentacion" v-model="model.file_document.file"/>
                        </base-field>
                    </div>
                </div>
            </template>
            <!-- ------------------------------------------------------ -->
            <template v-if="currentStep == 2">
                <div>
                    <div class="row border rounded border-light px-4 py-2">
                        <div class="col-md-12">
                            <base-field   name="operations" label="Tipos de operaciones">
                                <div v-for="operation in operations" :key="operation.key" class="form-check">
                                    <field-validate :disabled="isSaved"
                                        type="checkbox" 
                                        name="operations"
                                        class="form-check-input" 
                                        :value="operation.value"
                                        v-model="model.operation_types_ids"
                                        rules="required" label="operaciones">
                                    </field-validate>
                                    <label for="" class="form-check-label">{{operation.label}}</label>
                                </div>
                            </base-field>
                        </div>
                    </div>
                    <div class="row border rounded border-light px-4 py-2 mt-3">
                        <div class="col-md-12">
                            <base-field   name="equipments" label="Tipos de equipamientos" labelClasses="d-block">
                                <div v-for="equipment in equipments" :key="equipment.key" class="d-inline-block">
                                    <field-validate :disabled="isSaved"
                                        type="checkbox" 
                                        name="equipments"
                                        :value="equipment.value"
                                        v-model="model.equipments_ids"
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
                        <base-field   apiName="responsible.name" name="name" label="Nombre">
                            <field-validate :disabled="isSaved" type="text" class="form-control" name="name" rules="required" label="Nombre" v-model="model.responsible.name"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field   apiName="responsible.last_name" name="last_name" label="Apellido">
                            <field-validate :disabled="isSaved" type="text" class="form-control" name="last_name" rules="required" label="apellido" v-model="model.responsible.last_name"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field   apiName="responsible.dni" name="dni" label="Dni">
                            <field-validate :disabled="isSaved" type="number" class="form-control" name="dni" rules="required" label="dni" v-model="model.responsible.dni"/>
                        </base-field>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <base-field   apiName="responsible.email" name="email" label="Email">
                            <field-validate :disabled="isSaved" type="text" class="form-control" name="email" rules="required" label="email" v-model="model.responsible.email"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field   apiName="responsible.position" name="position" label="Posicion">
                            <field-validate :disabled="isSaved" type="text" class="form-control" name="position" rules="required" label="posicion" v-model="model.responsible.position"/>
                        </base-field>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <base-field   apiName="responsible.phone_number" label="Movil" name="phone_number">
                            <field-validate :disabled="isSaved" type="number" class="form-control" name="phone_number" rules="required" label="movil" v-model="model.responsible.phone_number"/>
                        </base-field>
                    </div>
                </div>
                <div class="row border rounded border-light px-4 py-2 mt-3">
                    <div class="col-12 border-bottom border-light mb-md-3">
                        <h4>Documentacion</h4>
                    </div>
                    <div class="col-md-4">
                        <base-field   apiName="responsible.date_firm" name="date_firm" label="Fecha de firma">
                            <field-validate :disabled="isSaved" type="date" class="form-control" name="date_firm" rules="required" label="fecha" v-model="model.responsible.date_firm.toForm"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field   apiName="responsible.date_certification" name="date_cer" label="Fecha de formacion">
                            <field-validate :disabled="isSaved" type="date" class="form-control" name="date_cer" rules="required" label="fecha" v-model="model.responsible.date_certification.toForm"/>
                        </base-field>
                    </div>
                    <div class="col-md-4">
                        <base-field   apiName="responsible.file_certification" name="file_cer" label="Documento de formacion">
                            <div v-if="model.responsible.file_certification.file.length >= 1">
                                <span class="mr-md-4">{{model.responsible.file_certification.file[0].name}}</span>
                                <base-button @click="model.responsible.file_certification.file = []" size="sm" type="default" :outline="true" :disabled="isSaved">Cambiar</base-button>
                            </div>
                            <field-validate :disabled="isSaved" v-else type="file" class="form-control" name="file_cer" rules="required" label="documento" v-model="model.responsible.file_certification.file"/>
                        </base-field>
                    </div>

                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-2">
                                <base-switch
                                    :disabled="isSaved"
                                    v-model="model.responsible.driver" label="Conductor"
                                ></base-switch>
                            </div>
                            <div class="col-md-3" v-if="model.responsible.driver">
                                <base-field   apiName="responsible.phone_number" name="adr_permit_id" label="Permiso ADR">
                                    <field-validate :disabled="isSaved" as="select" class="form-control" name="adr_permit_id" v-model="model.responsible.adr_permit_id" rules="required">
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
                                <base-field   apiName="responsible.driver_document_date" name="driver_date" label="Fecha documentacion">
                                    <field-validate :disabled="isSaved" type="date" class="form-control" name="driver_date" v-model="model.responsible.driver_document_date.toForm" rules="required">
                                    </field-validate>
                                </base-field>
                            </div>
                            <div class="col-md-4" v-if="model.responsible.driver">
                                <base-field   apiName="responsible.file_driver" name="file_driver" label="Documentacion ADR">
                                    <div v-if="model.responsible.driver_document.file.length >= 1">
                                        <span class="mr-md-4">{{model.responsible.driver_document.file[0].name}}</span>
                                        <base-button @click="model.responsible.driver_document.file = []" size="sm" type="default" :outline="true" :disabled="isSaved">Cambiar</base-button>
                                    </div>
                                    <field-validate :disabled="isSaved" v-else type="file" class="form-control" name="file_driver" rules="required" label="documento" v-model="model.responsible.driver_document.file"/>
                                </base-field>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <base-switch v-model="model.responsible.dangerous_goods" :disabled="isSaved" label="Mercancias peligrosas"
                        ></base-switch>
                    </div>
                </div>
            </template>
            <!-- ------------------------------------------------------- -->
            <template v-if="currentStep == 4 && isSaved">
                <div>
                    <material-table :installation_id="installation_id" :residue="0"></material-table>
                </div>
                <div class="mt-5">
                    <material-table :installation_id="installation_id" :residue="1" title="Residuos"></material-table>
                </div>
            </template>
            <!-- ------------------------------------------------------- -->
            <template v-if="currentStep == 5 && isSaved">
                <div>
                    <vehicles-table :installation_id="installation_id"></vehicles-table>
                </div>
            </template>
            <!-- ------------------------------------------------------ -->
            <template v-if="currentStep == 6 && isSaved">
                <div>
                    <subcontractor-table :installation_id="installation_id"></subcontractor-table>
                </div>
            </template>
            <!-- ------------------------------------------------------ -->
            <div class="mt-4 float-md-right">
                <base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
                >Anterior</base-button
                >
                <!-- <base-button type="default" nativeType="submit" @click="this.touched = meta.touched" v-if="isSaved && meta.touched" :disabled="!meta.valid"
                >Actualizar</base-button
                > -->
                <div class="d-inline-block mx-2">
                    <base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep !== 3 && currentStep < 6"
                    >Siguiente</base-button
                    >
                </div>
                <base-button type="default" nativeType="submit" v-if="currentStep === 3"
                >{{!isSaved ? 'Enviar' : 'Siguiente'}}</base-button
                >
                <base-button
                    type="default"
                    :outline="true"
                    class="ml-auto"
                    @click="handleClose(resetForm)"
                    >{{isSaved ? "Cerrar" : "Cancelar"}}
                </base-button>
            </div>
        </form-validate>
    </div>
</template>
<script>
import dataService from "@/store/services/data-service";
import Multiselect from "@vueform/multiselect";
import utils from "@/mixins/utils-mixin";
import _ from "lodash";
import service from "@/store/services/model-service";
import MaterialTable from '@/views/Tables/MaterialTable.vue';
import VehiclesTable from '@/views/Tables/VehiclesTable.vue';
import SubcontractorTable from '@/views/Tables/SubcontractorTable.vue';

export default {
    mixins: [utils],
    components: {Multiselect,MaterialTable, VehiclesTable, SubcontractorTable},
    props: {
        business_id: {
            type:Number,
            required:true
        }
    },
    data() {
        return {
            isSaved: false,
            steps: [],
            installation_id: null,
            currentStep: 1,
            auditable: null,
            model: this.$store.getters.INSTALLATION_SCHEMA,
            provinces: [{
                value: "",
                label: ""
            }],
            touched: false,
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
        async onSubmit(values){
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
                if (this.isSaved) {
                    return
                }
            }

            if (this.currentStep == 2) {
                if (this.isSaved & this.touched) {
                    return
                }
                // this.model.equipments_ids = inst.equipments
                // this.model.operation_types_ids = inst.operations
            }

            if (this.currentStep == 3) {
                if (!this.isSaved) {
                    this.model.responsible.file_certification.base64 = await this.toBase64(inst.file_cer[0])
                    this.model.responsible.date_certification.date = this.formatDate(inst.date_cer);
                    this.model.responsible.date_firm.date = this.formatDate(inst.date_firm);
                    if (this.model.responsible.driver) {
                        this.model.responsible.driver_document.base64 = await this.toBase64(inst.file_driver[0])
                        this.model.responsible.driver_document_date.date = this.formatDate(inst.driver_date)
                    }
                }
            }

            if (this.currentStep === 3 && !this.isSaved) {
                this.model.business_id = this.business_id
                try {
                    const res = await service.store('installation',this.model);
                    this.installation_id = res.data.data.id
                    this.isSaved = true
                    this.$emit('reload')
                } catch (error) {
                    console.log(error);
                    return
                }
            }
           
            if (this.currentStep !== 6) {
                this.currentStep++
            }
        },
        async fetchItems(search){
            const res = await service.getIndex('auditor',`name=${search}&includes[]=user`);
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
                },
                {
                   number: 4,
                    title: "Materiales",
                    valid: false 
                },
                {
                   number: 5,
                    title: "Vehiculos",
                    valid: false 
                },
                {
                   number: 6,
                    title: "Subcontratistas",
                    valid: false 
                }
            ]; 

            this.model = this.$store.getters.INSTALLATION_SCHEMA
        },
        // async update(data){
        //     try {
        //         await service.update('installation',this.installation_id, data)
        //         this.$toast.success('Cambios actualizados')
        //     } catch (err) {
        //         this.$toast.error('No se pudieron guardar los cambios')
        //     }
        // }
    },
    computed: {
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