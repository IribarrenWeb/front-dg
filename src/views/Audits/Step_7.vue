<template>
    <form-validate @submit="onSubmit" v-slot="{ meta }">
        <div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
            <div class="spinner-border" role="status">
            </div>
        </div>
        <div v-else class="row justify-content-center px-md-2">
            <div class="col-md-10">
                <h4 class="text-uppercase">COMPROBACIONES REGLAMENTARIAS</h4>
                <div class="row justify-content-center">
                    <div class="col-md-12 mt-md-3">
                        <h5 class="text-uppercase text-muted">FORMACIÓN DEL PERSONAL IMPLICADO CON MERCANCÍAS PELIGROSAS</h5>
                        <base-field name="comprobation" label="1.El personal implicado ha recibido curso manipulación ADR adaptada a sus necesidades y tareas encomendadas">
                            <div class="row">
                                <div class="col-md-6">
                                    <field-validate as="select" class="form-control" name="comprobation" label="un" rules="required">
                                        <option selected>COMPROBACIÓN</option>
                                        <option value="true">SI</option>
                                        <option value="true">SI - NO CONFORMIDAD</option>
                                        <option value="true">NO</option>
                                        <option value="true">NO PROCEDE</option>
                                    </field-validate>
                                </div>
                                <div class="col-md-6">
                                    <field-validate as="select" class="form-control" name="evaluation" label="" rules="required">
                                        <option selected>EVALUACIÓN</option>
                                        <option value="true">APTA</option>
                                        <option value="true">APTA - CON RECOMENDACIONES</option>
                                        <option value="true">NO APTA - URGE ACCION CORRECTIVA</option>
                                    </field-validate>
                                </div>
                            </div>
                        </base-field>
                        <base-field name="comprobation1" label="2.Realización de simulacros de emergencia en operaciones de carga o descarga">
                            <div class="row">
                                <div class="col-md-6">
                                    <field-validate as="select" class="form-control" name="comprobation1" label="un" rules="required">
                                        <option selected>COMPROBACIÓN</option>
                                        <option value="true">SI</option>
                                        <option value="true">SI - NO CONFORMIDAD</option>
                                        <option value="true">NO</option>
                                        <option value="true">NO PROCEDE</option>
                                    </field-validate>
                                </div>
                                <div class="col-md-6">
                                    <field-validate as="select" class="form-control" name="evaluation1" label="" rules="required">
                                        <option selected>EVALUACIÓN</option>
                                        <option value="true">APTA</option>
                                        <option value="true">APTA - CON RECOMENDACIONES</option>
                                        <option value="true">NO APTA - URGE ACCION CORRECTIVA</option>
                                    </field-validate>
                                </div>
                            </div>
                        </base-field>
                        <base-field name="comprobation2" label="3.Procedimientos escrito para las operaciones con Mercancías ADR">
                            <div class="row">
                                <div class="col-md-6">
                                    <field-validate as="select" class="form-control" name="comprobation2" label="un" rules="required">
                                        <option selected>COMPROBACIÓN</option>
                                        <option value="true">SI</option>
                                        <option value="true">SI - NO CONFORMIDAD</option>
                                        <option value="true">NO</option>
                                        <option value="true">NO PROCEDE</option>
                                    </field-validate>
                                </div>
                                <div class="col-md-6">
                                    <field-validate as="select" class="form-control" name="evaluation2" label="" rules="required">
                                        <option selected>EVALUACIÓN</option>
                                        <option value="true">APTA</option>
                                        <option value="true">APTA - CON RECOMENDACIONES</option>
                                        <option value="true">NO APTA - URGE ACCION CORRECTIVA</option>
                                    </field-validate>
                                </div>
                            </div>
                        </base-field>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="mt-4 float-md-right">
                    <base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1"
                    >Anterior</base-button
                    >
                    <base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep !== 9"
                    >Siguiente</base-button
                    >
                </div>
            </div>
        </div>
    </form-validate>
</template>
<script>
import service from "@/store/services/model-service";
export default {
    props: ['audit', 'currentStep'],
    data() {
        return {
            check1: false,
            check2: false,
            audit_id: this.$route.params.id
        }
    },
    async mounted() {
    },
    methods: {
        async onSubmit(){
            if (!this.check1 && !this.check2) {
                this.$toast.warning('Tiene que marcar los checkbox')
            }
            try {
                await service.update('audit', this.audit_id, { current_step: 7, valid_step: 6 })
                this.$emit('next', 6)
            } catch (err) {
                let message = err.response.message ? err.response.message : 'Ocurrio un error al guardar los cambios'
                this.$toast.error(message);
                console.log(err);
            }
        },
        handle(event){
            console.log(event,this.check2);
        }
    }
}
</script>