<template>
    <form-validate @submit="onSubmit" v-slot="{ meta }">
        <div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
            <div class="spinner-border" role="status">
            </div>
        </div>
        <div v-else class="row justify-content-center px-md-2">
            <div class="col-md-10">
                <h4 class="text-uppercase">ACTIVIDAD</h4>
                <div class="row justify-content-center">
                    <div class="col-md-12 mt-md-4">
                        <base-checkbox :checked="true"  @input="check2 = $event">
                            <b >
                                ACTIVIDAD. Las cantidades exentas, según 1.1.3.4, 1.1.3.5 y 1.1.3.6, no son objeto de este informe, por lo que habrá que referirse a Las Normas para conocer su tratamiento.En cualquier caso y a modo de resumen:-        La exención 1.1.3.4 se refiere a cantidades limitadas por bulto en la que solo se requiere básicamente un etiquetado Específico en cada bulto, aplicando a envases no superiores a 5 litros en embalaje combinado.-        La exención 1.1.3.5 se refiere a cantidades exceptuadas, solo válida para muestras y que incorpora los mismos criterios que para el transporte aéreo de este tamaño.-        La exención 1.1.3.6 se refiere a cantidades limitadas por vehículo, en las que no se requiere básicamente cumplir con Los requisitos de transporte, pero sí con los de envasado, etiquetado y documentación; por tanto aunque no se consideran Transporte ADR, debe respetarse el envasado original y realizar carta de porte en la que se demuestre dicha condición de exento (cantidad total de riesgo en el vehículo no superior a 1000, siendo la mercancía transportada G.E. III).Todas las situaciones anteriores quedan fuera del ámbito de actuación del Consejero de Seguridad, aunque quedan incorporadas tanto en la Formación como en las Normas, debiendo ser consultadas en caso de duda.
                                METODOLOGÍA.- Previamente a la realización de cualquier visita, el personal de las áreas afectadas, especialmente los responsables de las mismas, habrán de ser informados de los aspectos que se evalúen, de tal manera que un incumplimiento de un procedimiento o norma no puede ser achacable a la falta de información.Al mismo tiempo se avisará con antelación suficiente para que los responsables de las unidades implicadas puedan preparar la documentación que deba ser consultada en la dicha visita.En cada instalación se conservará una copia de este informe al menos durante un año.
                                CALCULO NIVEL DE CUMPLIMIENTOEl objetivo de la visita técnica es la comprobación del proceso de manipulación de mercancías peligrosas. Se evaluará el nivel de cumplimiento que quedará reflejado en el punto 14 de la Auditoria.
                            </b>
                        </base-checkbox>
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
            checked: false,
            audit_id: this.$route.params.id
        }
    },
    async mounted() {
         if (typeof this.audit.id == 'undefined') {
            const res = await service.show('audit',this.audit_id)
            this.checked = res.data.data.valid_step >= 2
            this.check1 = this.checked
            this.check2 = this.checked
        }else{
            this.checked = this.audit.valid_step >= 2
            this.check1 = this.checked
            this.check2 = this.checked
        }
    },
    methods: {
        async onSubmit(){
            if (!this.check1 && !this.check2) {
                this.$toast.warning('Tiene que marcar los checkbox')
            }
            try {
                await service.update('audit', this.audit_id, { current_step: 5, valid_step: this.audit.valid_step >= this.currentStep ? this.audit.valid_step : this.currentStep })
                this.$emit('next', 4)
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