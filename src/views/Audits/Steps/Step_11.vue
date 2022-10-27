<template>
	<form-validate @submit="onSubmit" v-slot="{ meta }">
		<div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
			<div class="spinner-border" role="status"></div>
		</div>
		<div v-else class="row justify-content-center">
			<div class="col-md-12">
				<h4 class="text-uppercase">
					INFORME DE RESULTADOS DE LA VISITA TÉCNICA
				</h4>
				<div class="row">
					<div class="col-md-12 mt-md-3">
						<h6 class="text-uppercase text-muted">NO CONFORMIDADES</h6>
						<form-validate @submit="addNon">
							<div class="row">
								<div class="col-md-3">
									<base-field name="type" label="Tipo">
										<field-validate as="select" class="form-control" name="type" label="tipo"
											v-model="non_c.type_id" rules="required">
											<option selected>Tipo</option>
											<option :value="idx" v-for="(type, idx) in audit.non_types" :key="idx">
												{{ type.name }}
											</option>
										</field-validate>
									</base-field>
								</div>
								<div class="col-md-3">
									<base-field name="priority" label="Prioridad">
										<field-validate as="select" class="form-control" name="priority"
											label="prioridad" v-model="non_c.pri_id" rules="required">
											<option selected>Prioridad</option>
											<option :value="idx" v-for="(pri, idx) in audit.pri_types" :key="idx">
												{{ pri.name }}
											</option>
										</field-validate>
									</base-field>
								</div>
								<div class="col-md-5">
									<base-field name="description" label="Descripción">
										<q-input outlined v-model="non_c.description" class="bg-white" type="textarea" />
										<field-validate v-show="false" type="text" class="form-control" name="description"
											rules="required" label="descripción" v-model="non_c.description" />
									</base-field>
								</div>
								<div class="col-md-1 d-flex">
									<div class="align-self-center">
										<base-button size="sm" nativeType="submit" :outline="true">
											<i class="fa fa-plus" aria-hidden="true"></i>
										</base-button>
									</div>
								</div>
							</div>
						</form-validate>
						<div class="row" v-for="(non, idx) in nonconformities" :key="idx">
							<div class="col-md-3">
								<base-input :view="true" :modelValue="non.type.name" disabled />
							</div>
							<div class="col-md-3">
								<base-input :view="true" :modelValue="non.priority.name" disabled />
							</div>
							<div class="col-md-4">
								<base-input :view="true" :modelValue="non.description" disabled />
							</div>
							<div class="col-md-2 d-flex">
								<div class="align-self-center">
									<base-button size="sm" @click="unlink(non.id)" type="danger" :outline="true">
										<i class="fa fa-minus" aria-hidden="true"></i>
									</base-button>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-12 mt-md-3">
						<base-field label="OBSERVACIONES GENERALES VISITA INSTALACIÓN">
							<textarea class="form-control" cols="30" rows="10"
								v-model="general_observations"></textarea>
						</base-field>
					</div>
					<div class="col-md-12 mt-md-3">
						<h6 class="text-uppercase text-muted">NIVEL DE CUMPLIMIENTO</h6>
						<div class="col-md-6">
							<base-field name="level"
								label="VALORACIÓN CUMPLIMIENTO NORMATIVA ADR MERCANCÍAS PELIGROSAS EVALUACIÓN GENERAL">
								<field-validate as="select" class="form-control" name="level"
									label="nivel de cumplimiento" v-model="level" rules="required">
									<option selected>Nivel de cumplimiento</option>
									<option :value="level.id" v-for="(level, idx) in audit.levels" :key="idx">
										{{ level.name }}
									</option>
								</field-validate>
							</base-field>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="mt-4 float-md-right">
					<base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1">Anterior
					</base-button>
					<base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep !== 12">
						Siguiente</base-button>
				</div>
			</div>
		</div>
	</form-validate>
</template>
<script>
import service from "@/store/services/model-service";
import _, { random } from "lodash";
export default {
	props: ["audit", "currentStep"],
	data() {
		return {
			audit_id: this.$route.params.id,
			nonconformities: this.audit.nonconformities,
			non_c: {
				index: null,
				id: null,
				type_id: null,
				pri_id: null,
				type: null,
				priority: null,
				description: null,
			},
			level: this.audit.compliance_level_id,
			general_observations: this.audit.general_observations,
		};
	},
	async mounted() { },
	methods: {
		async onSubmit() {
			try {
				await service.update("audit", this.audit_id, {
					current_step: 12,
					valid_step:
						this.audit.valid_step >= this.currentStep
							? this.audit.valid_step
							: this.currentStep,
					non_c: this.nonconformities,
					general_observations: this.general_observations,
					compliance_level_id: this.level,
				});
				this.$emit("next", 11);
			} catch (err) {
				let message = err.response.message
					? err.response.message
					: "Ocurrio un error al guardar los cambios";
				this.$toast.error(message);
				console.log(err);
			}
		},
		formatComp() {
			let compr = [];
			_.forEach(this.audit.comprobations, (comp) => {
				if (comp.step == 11) {
					compr.push(comp);
				}
			});
			return compr;
		},
		addNon(values, { resetForm }) {
			this.nonconformities.push({
				id: random(1, 999999),
				priority_id: this.non_c.priority.id,
				priority: this.non_c.priority,
				nonconformity_type_id: this.non_c.type.id,
				type: this.non_c.type,
				description: this.non_c.description,
			});

			this.non_c = {
				index: null,
				id: null,
				type_id: null,
				pri_id: null,
				description: null,
			};
			resetForm();
		},
		unlink(id) {
			let position = 0;
			let position_item = 0;
			_.mapKeys(
				this.nonconformities,
				(veh) => {
					if (veh.id == id) {
						position_item = position;
					}
					position++;
				},
				position_item,
				id
			);

			this.nonconformities.splice(position_item, 1);
		},
	},
	computed: {},
	watch: {
		"non_c.type_id": function (newVal) {
			this.non_c.type = this.audit.non_types[newVal];
		},
		"non_c.pri_id": function (newVal) {
			this.non_c.priority = this.audit.pri_types[newVal];
		},
	},
};
</script>