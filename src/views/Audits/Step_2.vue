<template>
	<form-validate @submit="onSubmit" v-slot="{ meta }">
		<div
			class="d-flex justify-content-center"
			v-if="typeof audit.id == 'undefined'"
		>
			<div class="spinner-border" role="status"></div>
		</div>
		<div v-else class="row justify-content-center px-md-2">
			<div class="col-md-10">
				<h4 class="text-uppercase">Contenido de la visita</h4>
				<div class="row justify-content-center">
					<div class="col-md-12">
						<base-checkbox :checked="checked" @input="check1 = $event">
							<b>
								INFORME TÉCNICO DE EVALUACIÓN INICIAL. ACTIVIDADES CON
								MERCANCÍAS PELIGROSAS SUJETAS A CUMPLIMIENTO SEGÚN ADR (
								Transporte de Mercancías Peligrosas por carretera).
							</b>
						</base-checkbox>
					</div>
					<div class="col-md-12 mt-md-4">
						<base-checkbox :checked="checked" @input="check2 = $event">
							<b>
								CONTENIDOS DE LA VISITA: - Reunión informativa previa ; -
								Revisión/Análisis de la gestión de las actividades con
								mercancías peligrosas.; - Verificación de las áreas de
								carga/descarga y almacenamiento de mercancías peligrosas; -
								Verificación de operaciones de carga de residuos peligrosos; -
								Verificación de operaciones de carga/descarga de cisternas; -
								Verificación de operaciones de carga/descarga de bultos; -
								Verificación de los vehículos destinados al transporte; - Sesión
								de Formación; - Reunión final Este informe es de carácter
								interno y la información aquí mostrada no esla que se comunica
								oficialmente al Ministerio de Fomento cuando se presenta
								elinforme anual; no obstante, se revisan todas aquellas
								cuestiones que esobligación del Consejero de Seguridad
								verificar, con objeto de valorar el gradode cumplimiento de los
								requisitos aplicables. Informe correspondiente a la visita
								realizada por su Consejero de Seguridad designado por la
								empresa, de acuerdo con las recomendaciones del Ministerio de
								Fomento, comprobando y revisando aquellos aspectos que figuran
								como obligatorios en el informe de los Consejeros de Seguridad,
								según el RD 97/2017
							</b>
						</base-checkbox>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="mt-4 float-md-right">
					<base-button
						type="default"
						@click="this.$emit('prev')"
						v-if="currentStep !== 1"
						>Anterior</base-button
					>
					<base-button
						type="default"
						:disabled="!meta.valid"
						nativeType="submit"
						v-if="currentStep !== 9"
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
		props: ["audit", "currentStep"],
		data() {
			return {
				check1: false,
				check2: false,
				audit_id: this.$route.params.id,
				checked: false,
			};
		},
		async mounted() {
			if (typeof this.audit.id == "undefined") {
				const res = await service.show("audit", this.audit_id);
				this.checked = res.data.data.valid_step >= 2;
				this.check1 = this.checked;
				this.check2 = this.checked;
			} else {
				this.checked = this.audit.valid_step >= 2;
				this.check1 = this.checked;
				this.check2 = this.checked;
			}
		},
		methods: {
			async onSubmit() {
				if (!this.check1 && !this.check2) {
					this.$toast.warning("Tiene que marcar los checkbox");
				}
				try {
					await service.update("audit", this.audit_id, {
						current_step: 3,
						valid_step:
							this.audit.valid_step >= this.currentStep
								? this.audit.valid_step
								: this.currentStep,
					});
					this.$emit("next", 2);
				} catch (err) {
					let message = err.response.message
						? err.response.message
						: "Ocurrio un error al guardar los cambios";
					this.$toast.error(message);
					console.log(err);
				}
			},
			handle(event) {
				console.log(event, this.check2);
			},
		},
	};
</script>