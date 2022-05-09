<template>
    <div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
        <div class="spinner-border" role="status">
        </div>
    </div>
    <div v-else class="row justify-content-center px-md-2">
        <div class="col-md-10">
            <h4 class="text-uppercase">Residuos</h4>
            <div class="row justify-content-center">
                <div class="col-md-12 mt-md-3">
                    <h5 class="text-uppercase text-primary">RESIDUOS ADR GENERADOS/ALMACENADOS INSTALACIÓN</h5>
                    <h6 class="text-uppercase text-muted">TIPO RESIDUOS ADR CARGADOS/DESCARGADOS/ALMACENADOS EN LA INSTALACIÓN</h6>
                    <form-validate>
                        <div class="row">
                            <div class="col-md-2">
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
                            <div class="col-md-2">
                                <base-input :view="true" modelValue="" label="Cantidad" disabled/>
                            </div>
                            <div class="col-md-2">
                                <base-input :view="true" modelValue="" label="Deposito" disabled/>
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
                <div class="col-md-12 mt-md-5">
                    <base-field label="Añadir Productos / Residuos considerados ADR de las instalaciones:">
                        <textarea name="" class="form-control" cols="30" rows="10"></textarea>
                    </base-field>
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
import _ from "lodash";

export default {
    props: ['audit', 'currentStep'],
    data() {
        return {
            operations_data: {},
            equipments_data: {},
            audit_id: null,
            installation_id: null,
            installation: {},
            model: {
                packing_group_id: null,
                adr_class_id: null,
                comment: ""
            }
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
    },
    methods: {
        async onSubmit(){
            try {
                await service.update('audit', this.audit_id, { current_step: 5, valid_step: 4 })
            } catch (err) {
                let message = err.response.message ? err.response.message : 'Ocurrio un error al guardar los cambios'
                this.$toast.error(message);
                console.log(err);
            }
            this.$emit('next', 4)
        },
        async submitMaterial(values){
            console.log(values);
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