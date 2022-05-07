<template>
    <div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
        <div class="spinner-border" role="status">
        </div>
    </div>
    <div v-else class="row justify-content-center px-md-2">
        <div class="col-md-10">
            <h4 class="text-uppercase">Mercancias</h4>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <base-field label="TIPO DE OPERACIONES DE MERCANCÍAS PELIGROSAS">
                        <div v-for="operation in operations" :key="operation.id">
                            <base-checkbox :checked="operation.checked" :disabled="true">
                                <b>{{operation.name}}</b> 
                            </base-checkbox>
                        </div>
                    </base-field>
                </div>
                <div class="col-md-6">
                    <base-field label="TIPO DE EQUIPOS DE TRANSPORTE">
                        <div v-for="equipment in equipments" :key="equipment.id">
                            <base-checkbox :checked="equipment.checked" :disabled="true">
                                <b>{{equipment.name}}</b> 
                            </base-checkbox>
                        </div>
                    </base-field>
                </div>
                <div class="col-md-12 mt-md-3">
                    <h5 class="text-uppercase text-primary">Mercancia adr carga y descarga</h5>
                    <h6 class="text-uppercase text-muted">TIPO PELIGROS Y GRUPOS DE EMBALA MERCANCÍAS ADR REVISADAS</h6>
                    <form-validate @submit="submitMaterial">
                        <div class="row">
                            <div class="col-md-3">
                                <base-field name="adr_class_id" label="Clase ADR">
                                    <field-validate as="select" class="form-control" name="adr_class_id" label="clase" v-model="model.adr_class_id" rules="required">
                                        <option selected>CLASE ADR</option>
                                        <option
                                            :value="adr"
                                            v-for="(adr, key) in adr_classes"
                                            :key="key.id"
                                            >
                                            {{ adr.code }}
                                        </option>
                                    </field-validate>
                                </base-field>
                            </div>
                            <div class="col-md-3">
                                <base-field name="packing_group_id" label="GE">
                                    <field-validate as="select" class="form-control" name="packing_group_id" label="ge" v-model="model.packing_group_id" rules="required">
                                        <option selected>G.E.</option>
                                        <option
                                            :value="pack"
                                            v-for="(pack, key) in packing_types"
                                            :key="key.id"
                                            >
                                            {{ pack.code }}
                                        </option>
                                    </field-validate>
                                </base-field>
                            </div>
                            <div class="col-md-4">
                                <base-field name="comment" label="Comentario">
                                    <field-validate type="text" class="form-control" name="comment" rules="required" label="comentario" v-model="model.comment"/>
                                </base-field>
                            </div>
                            <div class="col-md-2 d-flex">
                                <div class="align-self-center">
                                    <base-button size="sm" nativeType="submit" :outline="true">
                                        <i class="fa fa-plus" aria-hidden="true"></i>
                                    </base-button>
                                </div>
                            </div>
                        </div>
                    </form-validate>
                    <div class="row" v-for="(material,idx) in materials" :key="idx">
                        <div class="col-md-3">
                            <base-input :view="true" :modelValue="material.class.code" disabled/>
                        </div>
                        <div class="col-md-3">
                            <base-input :view="true" :modelValue="material.packing.code" disabled/>
                        </div>
                        <div class="col-md-4">
                            <base-input :view="true" :modelValue="material.comment" disabled/>
                        </div>
                        <div class="col-md-2 d-flex">
                            <div class="align-self-center">
                                <base-button size="sm" @click="unlink(material.id)" type="danger" :outline="true">
                                    <i class="fa fa-minus" aria-hidden="true"></i>
                                </base-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12 mt-md-3">
                    <h5 class="text-uppercase text-primary">DEPOSITOS MERCANCÍAS PELIGROSAS INSTALACIÓN</h5>
                    <h6 class="text-uppercase text-muted">TIPO PELIGROS Y GRUPOS DE EMBALA MERCANCÍAS ADR REVISADAS</h6>
                    <form-validate @submit="submitDeposit">
                        <div class="row">
                            <div class="col-md-3">
                                <base-field name="adr_class_id" label="UN">
                                    <field-validate as="select" class="form-control" name="adr_class_id" label="un" rules="required">
                                        <option selected>UN</option>
                                        <!-- <option
                                            :value="permit.id"
                                            v-for="(permit, key) in permits"
                                            :key="key.id"
                                            >
                                            {{ permit.name }}
                                        </option> -->
                                    </field-validate>
                                </base-field>
                            </div>
                            <div class="col-md-2">
                                <base-input :view="true" modelValue="" label="Clase" disabled/>
                            </div>
                            <div class="col-md-2">
                                <base-input :view="true" modelValue="" label="GE" disabled/>
                            </div>
                            <div class="col-md-3">
                                <base-input :view="true" modelValue="" label="Cantidad" disabled/>
                            </div>
                            <div class="col-md-2 d-flex">
                                <div class="align-self-center">
                                    <base-button size="sm" nativeType="submit" :outline="true">
                                        <i class="fa fa-plus" aria-hidden="true"></i>
                                    </base-button>
                                </div>
                            </div>
                        </div>
                    </form-validate>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="mt-4 float-md-right">
                <base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1"
                >Anterior</base-button
                >
                <base-button type="default" @click.prevent="onSubmit" v-if="currentStep !== 9"
                >Siguiente</base-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import service from "@/store/services/model-service";
import data_service from "@/store/services/data-service";
import _, { random } from "lodash";

export default {
    props: ['audit', 'currentStep'],
    data() {
        return {
            adr_classes: {},
            packing_types: {},
            operations_data: {},
            equipments_data: {},
            audit_id: null,
            installation_id: null,
            installation: {},
            model: {
                packing_group_id: null,
                adr_class_id: null,
                comment: ""
            },
            materials: []
        }
    },
    async mounted() {
        this.audit_id = this.$route.params.id;
        if (typeof this.audit.id == 'undefined') {
            const res = await service.show('audit',this.audit_id)
            this.installation_id = res.data.data.installation_id
        }else{
            console.log(this.audit.installation.operations);
            this.installation_id = this.audit.installation_id
        }
        this.loadInstallation()
        this.loadOperations()
        this.loadEquipments()
        this.loadData()
    },
    methods: {
        async onSubmit(){
            try {
                await service.update('audit', this.audit_id, { current_step: 4, valid_step: 3 })
            } catch (err) {
                let message = err.response.message ? err.response.message : 'Ocurrio un error al guardar los cambios'
                this.$toast.error(message);
                console.log(err);
            }
            this.$emit('next', 3)
        },
        async submitMaterial(values, {resetForm}){
            this.materials.push({
                id: random(1,999999),
                class: values.adr_class_id,
                packing: values.packing_group_id,
                comment: values.comment
            })
            resetForm()
        },
        async loadOperations(){
            try {
                const res = await data_service.getOperations()
                this.operations_data = res.data.data 
            } catch (err) {
                this.$toast.error('No se pudieron cargar las operaciones');
            }
        },
        async loadEquipments(){
            try {
                const res = await data_service.getEquipments()
                this.equipments_data = res.data.data 
            } catch (err) {
                this.$toast.error('No se pudieron cargar los equipamientos');
            }
        },
        async loadInstallation(){
            try {
              const res = await service.show('installation',this.installation_id,"includes[]=materials");
              this.installation = res.data.data;
            } catch (err) {
                console.log(err);
            }
        },
        async loadData(){
            try {
                const res = await data_service.getPacking()
                const res2 = await data_service.getAdrClass()
                this.adr_classes = res2.data.data 
                this.packing_types = res.data.data 
            } catch (err) {
                this.$toast.error('No se pudieron cargar los datos');
            }
        },
        unlink(id){
            let position = 0;
            let position_item = 0;

            _.mapKeys(
                this.materials,
                (material) => {
                    if (material.id == id) {
                        position_item = position;
                    }
                    position++;
                },
                position_item,
                id
            );

            this.materials.splice(position_item, 1);
        }
    },
    computed: {
        operations(){
            const ope_inst = this.installation.operations;
            return _.map(this.operations_data, (op) => {
                let res = _.find(ope_inst, function(o) { return o.id == op.id; });

                if (typeof res != 'undefined') {
                    op.checked = true
                }else{
                    op.checked = false
                }
                return op
            })
        },
        equipments(){
            const ope_inst = this.installation.equipments;
            return _.map(this.equipments_data, (op) => {
                let res = _.find(ope_inst, function(o) { return o.id == op.id; });

                if (typeof res != 'undefined') {
                    op.checked = true
                }else{
                    op.checked = false
                }
                return op
            })
        }
    }
}
</script>