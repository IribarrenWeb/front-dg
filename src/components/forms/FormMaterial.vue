<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{meta, resetForm}">
            <ul class="nav nav-pills mb-md-4 justify-content-center">
                <li class="nav-item" v-for="step in steps" :key="step.key">
                    <a class="nav-link p-2" :class="[{'active': currentStep == step.number},{'disabled':!step.valid && currentStep != step.number}]" href="#" @click.prevent="meta.valid ? currentStep = step.number : ''">
                        <i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i> 
                        {{step.title}}
                    </a>
                </li>
            </ul>
            <template v-if="currentStep == 1">
                <div class="row border rounded border-light px-4 py-2">
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="is_residue" label="Tipo">
                            <field-validate as="select" class="form-control" name="is_residue" rules="required" label="residue" v-model="model.is_residue">
                                <option :value="true" selected>Residuo ADR</option>
                                <option value="false">Material</option>
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="name" label="Nombre">
                            <field-validate type="text" class="form-control" name="name" rules="required" label="Nombre" v-model="model.name"/>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="deposit_type_id" label="Depósito">
                            <field-validate as="select" class="form-control" name="deposit_type_id" rules="required" label="tipo de deposito" v-model="model.deposit_type_id">
                                <option v-for="deposit in deposits" :key="deposit.key" :value="deposit.id">
                                    {{deposit.name}}
                                </option>
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                       <base-field :apiErrors="apiValidationErrors" name="material" label="UN">
                            <div v-if="model.material != null">
                                <span class="mr-md-4 text-uppercase">{{material.un_code}} - {{material.denomination_name}}</span>
                                <base-button @click="model.material = null" size="sm" type="default" :outline="true">Cambiar</base-button>
                            </div>
                            <div v-else>
                                <field-validate name="material" label="Material adr" rules="required" v-slot="{ field }" v-model="model.material">
                                    <Multiselect
                                        :searchable="true"
                                        v-bind="field"
                                        :min-chars="2"
                                        :delay="1000"
                                        :required="true"
                                        :options="fetchItems"
                                        @select="material = $event"
                                    >
                                    </Multiselect>
                                </field-validate>
                            </div>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-switch v-model="model.is_dangerous" label="Material peligroso"
                        ></base-switch>
                    </div>
                </div>
            </template>
            <template v-if="currentStep == 2">
                <div class="row border rounded border-light px-4 py-2">
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="address" label="Unidad">
                            <field-validate as="select" class="form-control" name="deposit" rules="required" label="deposit" v-model="model.unit">
                                <option value="TONELADAS" selected>TONELADAS</option>
                                <option value="KILOS">KILOS</option>
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="buy" label="Compra">
                            <field-validate type="number" class="form-control" name="buy" rules="required" label="Cantidad de compra" v-model="model.buy"/>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="sell" label="Venta">
                            <field-validate type="number" class="form-control" name="sell" rules="required" label="Cantidad de venta" v-model="model.sell"/>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field :apiErrors="apiValidationErrors" name="transported" label="Transportada">
                            <field-validate type="number" class="form-control" name="transported" rules="required" label="Cantidad transportada" v-model="model.transported"/>
                        </base-field>
                    </div>
                </div>
            </template>

            <div class="mt-4 float-md-right">
                <base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
                >Anterior</base-button
                >
                <base-button type="default" nativeType="submit" v-if="currentStep !== 2"
                >Siguiente</base-button
                >
                <base-button type="default" nativeType="submit" v-if="currentStep === 2"
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
import service from "../../store/services/material-service";
import Multiselect from "@vueform/multiselect";
import formMixin from "@/mixins/form-mixin";
import _ from "lodash";

export default {
    mixins: [formMixin],
    props: {
        installation_id: {
            required: true,
            default: null
        }
    },
    components: {Multiselect},
    data() {
        return {
            steps: [
                {
                    number: 1,
                    title: "General",
                    valid: false
                },
                {
                    number: 2,
                    title: "Cantidades",
                    valid: false
                }
            ],
            currentStep: 1,
            model: {
                installation_id: this.installation_id,
                adr_material_id: null,
                name: "",
                deposit_type_id: "",
                buy: "",
                sell: "",
                transported: "",
                unit: "",
                is_residue: false,
                is_dangerous: false,
            },
            material: {},
            deposits: {},
            loader: false
        }
    },
    mounted() {
        this.loadDeposits();
    },
    methods: {
        prevStep(){
            if (this.currentStep == 0 || this.currentStep == 1) {
                return 
            }
            this.currentStep--
        },
        async onSubmit(values, { resetForm }){
            for (let index = 0; index < this.steps.length; index++) {
                const step = this.steps[index];
                if (step.number == this.currentStep) {
                    step.valid = true
                }   
            }

            if (this.currentStep === 1) {
                this.model.adr_material_id = this.material.id
                this.model.is_residue = values.is_residue == 'false' ? false : true;
            }
            if (this.currentStep === 2) {
                this.loader = true;
                try {
                    const res = await service.store(this.model);
                    console.log(res);
                    this.$toast.success('Material registrado')
                    this.loader = false;
                    resetForm()
                    this.$emit('close')
                    this.$emit('reload')
                } catch (err) {
                    console.log(err);
                    this.$toast.error('No se pudo registrar el material')
                    this.loader = false;
                }
            }

            if (this.currentStep != 2) {
                this.currentStep++
            }
        },
        async loadDeposits(){
            try {
                const resp = await dataService.getDeposits();
                this.deposits = resp.data.data;
            } catch (err) {
                console.log(err.response);
                this.$toast.error('No se pudieron cargar los depositos')
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