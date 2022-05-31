<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <div class="row border rounded border-light px-3 py-2">
                <div class=" col-lg-3">
                    <base-field   name="fleet" label="Flota">
                        <field-validate as="select" class="form-control" name="fleet" rules="required" label="flota" v-model="model.fleet">
                            <option value="ajena" selected>Ajena</option>
                            <option value="propia">Propia</option>
                        </field-validate>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="registration" label="Matricula">
                        <field-validate type="text" class="form-control text-uppercase" name="registration" rules="required" label="matricula" v-model="model.registration_number"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="mma" label="MMA">
                        <field-validate type="number" class="form-control" name="mma" rules="required" label="mma" v-model.number="model.mma"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="tara" label="TARA">
                        <field-validate type="number" class="form-control" name="tara" rules="required" label="tara" v-model.number="model.tara"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="adr_kit" label="Kit ADR">
                        <field-validate type="date" class="form-control" name="adr_kit" rules="required" label="kit adr" v-model="model.adr_kit"/>
                    </base-field>
                </div>
                <div class=" col-lg-4" v-if="(update && types != null) || !update">
                    <base-field name="vehicle_type_id" label="Tipo">
                        <field-validate as="select" class="form-control" name="vehicle_type_id" rules="required" label="tipo de vehiculo" v-model.number="model.vehicle_type_id">
                            <option v-for="type in types" :key="type.key" :value="type.id">
                                {{type.name}}
                            </option>
                        </field-validate>
                    </base-field>
                </div>
                <div class=" col-lg-4" v-if="(update && designations != null) || !update">
                    <base-field   name="adr_designation_id" label="Designacion Adr">
                        <field-validate as="select" class="form-control" name="adr_designation_id" rules="required" label="designacion adr" v-model.number="model.adr_designation_id">
                            <option v-for="designation in designations" :key="designation.key" :value="designation.id">
                                {{designation.code}}
                            </option>
                        </field-validate>
                    </base-field>
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <base-button type="default" nativeType="submit"
                :disabled="!canUpdate"
                >Actualizar</base-button
                >
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
import dataService from "../../store/services/data-service";
import service from "@/store/services/model-service";
 
import utils from "@/mixins/utils-mixin";
import {isEqual} from "lodash";
import { mapGetters } from 'vuex';

export default {
    mixins: [utils],
    props: {
        installation_id: {
            required: true,
            default: null
        },
        vehicle: {
            type: Object,
            required: false,
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
                adr_kit: "",
                adr_designation_id: null,
            },
            original_vehicle: null,
            types: null,
            designations: null,
            loader: false
        }
    },
    created() {
        if (this.vehicle != null) {
            this.original_vehicle = this.COPY(this.vehicle)
            this.model = this.COPY(this.vehicle);
        }
    },
    mounted() {
        this.loadTypes();
        this.loadDesignations();
    },
    computed: {
        ...mapGetters(['COPY', 'DIFFERENCE']),
        update(){
            return this.vehicle != null && typeof this.vehicle.id != undefined
        },
        canUpdate() {
            return !isEqual(this.model,this.original_vehicle)
        }
    },
    methods: {
        async onSubmit(values, { resetForm }){
            try {
                if (this.update) {
                    const data = this.DIFFERENCE(this.vehicle,this.model)

                    const res = await service.update('vehicle', this.vehicle.id, data)
                    this.$toast.success('Vehiculo registrado')
                    this.model = this.COPY(res.data.data) 
                    this.original_vehicle = this.COPY(this.model)
                }else{
                    await service.store('vehicle',this.model)
                    this.$toast.success('Vehiculo registrado')
                    resetForm()
                    this.$emit('close')
                }
                this.$emit('reload')
            } catch (error) {
                console.log(error);
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
        handleClose(reset){
            reset()
            this.$emit('close')
        }
    },
}
</script>