<template>
	<form-validate @submit="onSubmit" v-slot="{ meta }">
		<div
			class="d-flex justify-content-center"
			v-if="typeof audit.id == 'undefined'"
		>
			<div class="spinner-border" role="status"></div>
		</div>
		<div v-else class="row justify-content-center px-md-2">
			<div class="col-md-12">
				<h4 class="text-uppercase">
					CONSEJEROS DE SEGURIDAD EN MERCANCÍAS PELIGROSAS
				</h4>
				<div class="row">
					<p>
						Este documento ha sido confeccionado por su Asesor/a en Mercancías
						Peligrosas. Dispondrá de una copia del mismo en su área de cliente
						en DGSoftware – Www.dgsoftware.com
					</p>
					<div class="col-md-12 mt-md-5">
						<base-field
							label="Firma Responsable Consejero ADR que ha realizado la visita "
						>
							<signature-pad
								:customStyle="customStyle"
								ref="signaturePad"
								:height="400"
							/>
							<div class="row mx-0 justify-content-end mt-4">
								<base-button @click="save" size="sm" v-if="signatureFile == null">Guardar firma</base-button>
								<base-button @click="undo" size="sm" v-else>Cancelar firma</base-button>
							</div>
						</base-field>

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
						v-if="currentStep !== 13"
						>Siguiente</base-button
					>
					<base-button
						type="default"
						:disabled="!meta.valid || signatureFile == null"
						nativeType="submit"
						v-if="currentStep === 13"
						>Aceptar</base-button
					>
				</div>
			</div>
		</div>
	</form-validate>
</template>
<script>
	import SignaturePad from 'vue3-signature-pad';
	import service from "@/store/services/model-service";
	export default {
		props: ["audit", "currentStep"],
		data() {
			return {
				audit_id: this.$route.params.id,
				signatureFile: null,
				customStyle: {
					border: 'grey 1px solid',
					'border-radius': '5px',
					background: 'white',
					width: '100%',
				} 
			};
		},
		components: {
			SignaturePad
		},
		async mounted() {},
		methods: {
			async onSubmit() {
				try {
					await this.$swal({
						title: "¿Esta seguro de completar la auditoria?",
						text: "Una vez completada no se pueden actualizar los campos.",
						type: "warning",
						showCancelButton: true,
						icon: "warning",
						cancelButtonText: "Cancelar",
					}).then((res) => {
						if (res.isConfirmed) {
							service.update("audit", this.audit_id, {
								current_step: 13,
								valid_step:
									this.audit.valid_step >= this.currentStep
										? this.audit.valid_step
										: this.currentStep,
								status: "COMPLETADO",
								signature_image: this.signatureFile
							});
							this.$emit("next", 13);
						}
					});
				} catch (err) {
					let message = err.response.message
						? err.response.message
						: "Ocurrio un error al guardar los cambios";
					this.$toast.error(message);
					console.log(err);
				}
			},
			undo() {
				this.$refs.signaturePad.openSignaturePad();
				this.$refs.signaturePad.undoSignature();
				this.$refs.signaturePad.clearSignature();
				this.signatureFile = null;
			},
			save() {
				const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
				if(isEmpty){
					this.$toast.error('La firma esta vacia');
				}else{
					this.$refs.signaturePad.lockSignaturePad()
					this.signatureFile = data;
					console.log(isEmpty);
					console.log(data);
				}
			}
		},
	};
</script>