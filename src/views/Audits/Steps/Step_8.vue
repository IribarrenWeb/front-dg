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
				<h4 class="text-uppercase">DOCUMENTACIÓN REGLAMENTARIA</h4>
				<div class="row justify-content-center">
					<div class="col-md-12 my-md-3">
						<h5 class="text-uppercase text-muted">
							REALIZACIÓN DEL INFORME ANUAL ADR Y PRESENTACIÓN EN PLAZO Y FORMA
						</h5>
						<div v-for="(comp, idx) in comprobations" :key="comp.id">
							<base-field :name="`comprobations[${idx}]`" :label="comp.text">
								<div class="row">
									<div class="col-md-6">
										<field-validate
											as="select"
											class="form-control"
											:name="`comprobation${idx}`"
											label="un"
											rules=""
											v-model="comprobations[idx].comprobation_type_id"
										>
											<option selected>COMPROBACIÓN</option>
											<option
												:value="co.id"
												v-for="co in audit.con_types"
												:key="co.id"
											>
												{{ co.name }}
											</option>
										</field-validate>
									</div>
									<div class="col-md-6">
										<field-validate
											as="select"
											class="form-control"
											:name="`evaluation${idx}`"
											label=""
											rules=""
											v-model="comprobations[idx].evaluation_type_id"
										>
											<option selected>EVALUACIÓN</option>
											<option
												:value="ev.id"
												v-for="ev in audit.ev_types"
												:key="ev.id"
											>
												{{ ev.name }}
											</option>
										</field-validate>
									</div>
								</div>
							</base-field>
						</div>
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
						v-if="currentStep !== 12"
						>Siguiente</base-button
					>
				</div>
			</div>
		</div>
	</form-validate>
</template>
<script>
	import service from "@/store/services/model-service";
	import _ from "lodash";
	export default {
		props: ["audit", "currentStep"],
		data() {
			return {
				audit_id: this.$route.params.id,
				comprobations: this.formatComp(),
				valid_step: this.audit.valid_step,
			};
		},
		async mounted() {},
		methods: {
			async onSubmit() {
				try {
					await service.update("audit", this.audit_id, {
						current_step: 9,
						valid_step:
							this.audit.valid_step >= this.currentStep
								? this.audit.valid_step
								: this.currentStep,
						comprobations: this.comprobations,
					});
					this.$emit("next", 8);
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
			formatComp() {
				let compr = [];
				_.forEach(this.audit.comprobations, (comp) => {
					if (comp.step == 10) {
						compr.push(comp);
					}
				});
				return compr;
			},
		},
		computed: {},
	};
</script>