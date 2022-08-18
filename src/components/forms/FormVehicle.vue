<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <installation-select v-model="model.installation_id"></installation-select>
            <div class="row border rounded border-light px-3 py-2">
                <div class=" col-lg-3">
                    <base-field   name="fleet" label="Flota">
                        <field-validate as="select" class="form-control" name="fleet" label="flota" v-model="model.fleet">
                            <option value="ajena" selected>Ajena</option>
                            <option value="propia">Propia</option>
                        </field-validate>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="registration" label="Matricula">
                        <field-validate type="text" class="form-control text-uppercase" name="registration" label="matricula" v-model="model.registration_number"/>
                    </base-field>
                </div>
                <div class=" col-lg-5">
                    <base-field   name="mma" label="MMA">
                        <field-validate type="number" class="form-control" name="mma" label="mma" v-model.number="model.mma"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="tara" label="TARA">
                        <field-validate type="number" class="form-control" name="tara" label="tara" v-model.number="model.tara"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="adr_kit" label="Fecha Instalación KIT ADR">
                        <field-validate type="date" class="form-control" name="adr_kit" label="Fecha Instalación KIT ADR" v-model="model.adr_kit"/>
                    </base-field>
                </div>
                <div class=" col-lg-4" v-if="(update && types != null) || !update">
                    <base-field name="vehicle_type_id" label="Tipo">
                        <field-validate as="select" class="form-control" name="vehicle_type_id" label="tipo de vehiculo" v-model.number="model.vehicle_type_id">
                            <option v-for="type in types" :key="type.key" :value="type.id">
                                {{type.name}}
                            </option>
                        </field-validate>
                    </base-field>
                </div>
                <div class=" col-lg-4" v-if="(update && designations != null) || !update">
                    <base-field   name="adr_designation_id" label="Designacion Adr">
                        <field-validate as="select" class="form-control" name="adr_designation_id" label="designacion adr" v-model.number="model.adr_designation_id">
                            <option v-for="designation in designations" :key="designation.key" :value="designation.id">
                                {{designation.code}}
                            </option>
                        </field-validate>
                    </base-field>
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <base-button type="default" v-if="update" nativeType="submit"
                :disabled="!canUpdate"
                >Actualizar</base-button
                >
                <base-button type="default" :disabled="!canCreate" nativeType="submit"
                >Aceptar</base-button
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
import {isEqual, forEach, isEmpty, keys, isNumber} from "lodash";
import InstallationSelect from '../Utils/InstallationSelect.vue';

export default {
	components: { InstallationSelect },
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
                installation_id: this.installation_id ?? null,
                vehicle_type_id: null,
                registration_number: null,
                fleet: null,
                mma: null,
                tara: null,
                adr_kit: null,
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
            this.original_vehicle = this.$functions.copy(this.vehicle)
            this.model = this.$functions.copy(this.vehicle);
        }
    },
    mounted() {
        this.loadTypes();
        this.loadDesignations();
    },
    computed: {
        update(){
            return this.vehicle != null && typeof this.vehicle.id != undefined
        },
        canUpdate() {
            return !isEqual(this.model,this.original_vehicle)
        },
        canCreate() {
            const length = keys(this.model).length -1;
            let count = 0;
            forEach(this.model, (m) => {
                if (isEmpty(m) && !isNumber(m)) {
                    count++
                }
            },count)
            return length > count;
        }
    },
    methods: {
        async onSubmit(values, { resetForm }){
            try {
                if (this.update) {
                    const data = this.$functions.difference(this.vehicle,this.model)

                    const res = await service.update('vehicle', this.vehicle.id, data)
                    this.$toast.success('Vehiculo registrado')
                    this.model = this.$functions.copy(res.data.data) 
                    this.original_vehicle = this.$functions.copy(this.model)
                }else{
                    const data = this.$functions.cleanData(this.model)
                    await service.store('vehicle',data)
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