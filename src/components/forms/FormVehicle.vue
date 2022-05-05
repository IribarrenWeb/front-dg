<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <div class="row border rounded border-light px-4 py-2">
                <div class="col-md-3">
                    <base-field :apiErrors="apiValidationErrors" name="fleet" label="Flota">
                        <field-validate as="select" class="form-control" name="fleet" rules="required" label="flota" v-model="model.fleet">
                            <option value="ajena" selected>Ajena</option>
                            <option value="propia">Propia</option>
                        </field-validate>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="registration" label="Matricula">
                        <field-validate type="text" class="form-control text-uppercase" name="registration" rules="required" label="matricula" v-model="model.registration_number"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="mma" label="MMA">
                        <field-validate type="number" class="form-control" name="mma" rules="required" label="mma" v-model="model.mma"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="tara" label="TARA">
                        <field-validate type="number" class="form-control" name="tara" rules="required" label="tara" v-model="model.tara"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="adr_kit" label="Kit ADR">
                        <field-validate type="date" class="form-control" name="adr_kit" rules="required" label="kit adr" v-model="model.adr_kit.toForm"/>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="vehicle_type_id" label="Tipo">
                        <field-validate as="select" class="form-control" name="vehicle_type_id" rules="required" label="tipo de vehiculo" v-model="model.vehicle_type_id">
                            <option v-for="type in types" :key="type.key" :value="type.id">
                                {{type.name}}
                            </option>
                        </field-validate>
                    </base-field>
                </div>
                <div class="col-md-4">
                    <base-field :apiErrors="apiValidationErrors" name="adr_designation_id" label="Designacion Adr">
                        <field-validate as="select" class="form-control" name="adr_designation_id" rules="required" label="designacion adr" v-model="model.adr_designation_id">
                            <option v-for="designation in designations" :key="designation.key" :value="designation.id">
                                {{designation.code}}
                            </option>
                        </field-validate>
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
import dataService from "../../store/services/data-service";
import service from "../../store/services/vehicle-service";
import formMixin from "@/mixins/form-mixin";
import utils from "@/mixins/utils-mixin";
import _ from "lodash";

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
                vehicle_type_id: null,
                registration_number: "",
                fleet: "",
                mma: "",
                tara: "",
                adr_kit: {
                    date: "",
                    toForm: ""
                },
                adr_designation_id: null,
            },
            types: {},
            designations: {},
            loader: false
        }
    },
    mounted() {
        this.loadTypes();
        this.loadDesignations();
    },
    methods: {
        async onSubmit(values, { resetForm }){
            this.loader = true;
            this.model.adr_kit.date = this.formatDate(values.adr_kit)
            this.resetApiValidation()
            try {
                const res = await service.store(this.model);
                console.log(res);
                this.$toast.success('Vehiculo registrado')
                this.loader = false;
                resetForm()
                this.$emit('close')
                this.$emit('reload')
            } catch (err) {
                console.log(err.response);
                if (typeof err.response.data.errors != 'undefined') {
                    this.setApiValidation(err.response.data.errors)
                }
                this.$toast.error('No se pudo registrar el Vehiculo')
                this.loader = false;
            }
        },
        async loadTypes(){
            try {
                const resp = await dataService.getVehicleTypes();
                this.types = resp.data.data;
            } catch (err) {
                console.log(err.response);
                this.$toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        },
        async loadDesignations(){
            try {
                const resp = await dataService.getAdrDesignations();
                this.designations = resp.data.data;
            } catch (err) {
                console.log(err.response);
                this.$toast.error('No se pudieron cargar las designaciones adr')
            }
        },
        async fetchItems(search){
            const res = await dataService.getAdrMaterials(`un_code=${search}`);
            const data = res.data.data;
            let options = _.map(data, (material) => {
                return {value: material, label: `${material.un_code} - ${material.denomination_name}`}
            })
            return options
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        }
    },
}
</script>