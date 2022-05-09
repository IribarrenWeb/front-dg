<template>
    <form-validate @submit="onSubmit" v-slot="{ meta }">
        <div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
            <div class="spinner-border" role="status">
            </div>
        </div>
        <div v-else class="row justify-content-center px-md-2">
            <div class="col-md-12">
                <h4 class="text-uppercase">CONSEJEROS DE SEGURIDAD EN MERCANCÍAS PELIGROSAS</h4>
                <div class="row">
                    <p>
                        Este documento ha sido confeccionado por su Asesor/a en Mercancías Peligrosas. Dispondrá de una copia del mismo en su área de cliente en DGSoftware – Www.dgsoftware.com
                    </p>
                    <div class="col-md-12 mt-md-5">
                        <base-field label="Firma Responsable Consejero ADR que ha realizado la visita ">
                            <textarea class="form-control" cols="30" rows="10"></textarea>
                        </base-field>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="mt-4 float-md-right">
                    <base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1"
                    >Anterior</base-button
                    >
                    <base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep !== 13"
                    >Siguiente</base-button
                    >
                    <base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep === 13"
                    >Enviar</base-button
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
            audit_id: this.$route.params.id,
        }
    },
    async mounted() {
    },
    methods: {
        async onSubmit(){
            try {
                await this.$swal({
                            title: '¿Esta seguro de completar la auditoria?',
                            text: 'Una vez completada no se pueden actualizar los campos.',
                            type: 'warning',
                            showCancelButton: true,
                            icon: "warning",
                            cancelButtonText: 'Cancelar',
                        }).then((res) => {
                            if (res.isConfirmed) {
                                service.update('audit', this.audit_id, { 
                                    current_step: 13, 
                                    valid_step: this.audit.valid_step >= this.currentStep ? this.audit.valid_step : this.currentStep,
                                    status: 'COMPLETADO'
                                })
                                this.$emit('next', 13)
                            }
                        })
            } catch (err) {
                let message = err.response.message ? err.response.message : 'Ocurrio un error al guardar los cambios'
                this.$toast.error(message);
                console.log(err);
            }
        },
    }
}
</script>