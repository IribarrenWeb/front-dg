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
				<h4 class="text-uppercase">
					OPERACIONES DE CARGA Y DESCARGA LIGADAS AL TRANSPORTE
				</h4>
				<div class="row justify-content-center">
					<div class="col-md-12 my-md-3">
						<h5 class="text-uppercase text-muted">
							ACCIDENTES / INCIDENTES / INFRACCIONES GRAVES DURANTE EL EJERCICIO
						</h5>
						<div v-for="(comp, idx) in comprobations" :key="comp.id">
							<base-field
								:name="`comprobations[${idx}]`"
								:label="comp.text"
								v-if="comp.step == 9"
							>
								<div class="row">
									<div class="col-md-6">
										<field-validate
											as="select"
											class="form-control"
											:name="`comprobation${idx}`"
											label="un"
											rules="required"
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
											rules="required"
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
						<base-field
							label="Observaciones ACCIDENTES / INCIDENTES/ INFRACCIONES GRAVES"
						>
							<textarea
								class="form-control"
								cols="30"
								rows="10"
								v-model="accident_observation"
							></textarea>
						</base-field>
					</div>
					<div class="col-md-12 my-md-3">
						<h5 class="text-uppercase text-muted">
							COMPROBACIÓN DEL MATERIAL (MAQUINARIA, EMBALAJES, ETC ) UTILIZADO
							EN EL TRANSPORTE, CARGA , DESCARGA O ALMACENAJE
						</h5>
						<div v-for="(comp, idx) in comprobations" :key="comp.id">
							<base-field
								:name="`comprobations[${idx}]`"
								:label="comp.text"
								v-if="comp.step == 9.1"
							>
								<div class="row">
									<div class="col-md-6">
										<field-validate
											as="select"
											class="form-control"
											:name="`comprobation${idx}`"
											label="un"
											rules="required"
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
											rules="required"
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
					<div class="col-md-12 my-md-3">
						<h5 class="text-uppercase text-muted">
							COMPROBACIÓN DE LA PRESENCIA A BORDO EN LOS MEDIOS DE TRANSPORTE
							DE LOS DOCUMENTOS Y EQUIPOS DE SEGURIDAD (KITADR - EPI´S), Y
							CONFORMIDAD DE LOS MISMOS
						</h5>
						<div v-for="(comp, idx) in comprobations" :key="comp.id">
							<base-field
								:name="`comprobations[${idx}]`"
								:label="comp.text"
								v-if="comp.step == 9.2"
							>
								<div class="row">
									<div class="col-md-6">
										<field-validate
											as="select"
											class="form-control"
											:name="`comprobation${idx}`"
											label="un"
											rules="required"
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
											rules="required"
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
					<div class="col-md-12 my-md-3">
						<h5 class="text-uppercase text-muted">
							EMERGENCIAS EN LAS OPERACIONES CON MERCANCÍAS PELIGROSAS.
							APLICACIÓN DE PROCEDIMIENTOS EN LAS OPERACIONES DE MMPP.
							APLICACIÓN DE PROCEDIMIENTOS DE URGENCIA EN CASO DE ACCIDENTE O
							INCIDENTE EN EL TRANSPORTE , CARGA O DESCARGA.
						</h5>
						<div v-for="(comp, idx) in comprobations" :key="comp.id">
							<base-field
								:name="`comprobations[${idx}]`"
								:label="comp.text"
								v-if="comp.step == 9.3"
							>
								<div class="row">
									<div class="col-md-6">
										<field-validate
											as="select"
											class="form-control"
											:name="`comprobation${idx}`"
											label="un"
											rules="required"
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
											rules="required"
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
	import _ from "lodash";
	export default {
		props: ["audit", "currentStep"],
		data() {
			return {
				audit_id: this.$route.params.id,
				comprobations: this.formatComp(),
				accident_observation: this.audit.accident_observation,
			};
		},
		async mounted() {},
		methods: {
			async onSubmit() {
				try {
					await service.update("audit", this.audit_id, {
						current_step: 8,
						valid_step:
							this.audit.valid_step >= this.currentStep
								? this.audit.valid_step
								: this.currentStep,
						comprobations: this.comprobations,
						accident_observations: this.accident_observation,
					});
					this.$emit("next", 7);
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
					if (comp.step > 8 && comp.step < 10) {
						compr.push(comp);
					}
				});
				return compr;
			},
		},
		computed: {},
	};
</script>