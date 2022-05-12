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
				<h4 class="text-uppercase">RESULTADO VISITA / INFORME</h4>
				<div class="row">
					<div class="col-md-12 my-md-3">
						<h6 class="text-uppercase text-muted">Documentación</h6>
						<input type="file" multiple class="form-control" accept=".pdf" />
					</div>
					<div class="col-md-12 mt-md-3">
						<h6 class="text-uppercase text-muted">Reportaje Fotográfico</h6>
						<input type="file" multiple class="form-control" accept="image/*" />
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
			};
		},
		async mounted() {},
		methods: {
			async onSubmit() {
				try {
					await service.update("audit", this.audit_id, {
						current_step: 13,
						valid_step:
							this.audit.valid_step >= this.currentStep
								? this.audit.valid_step
								: this.currentStep,
						non_c: this.nonconformities,
						general_observations: this.general_observations,
						compliance_level_id: this.level,
					});
					this.$emit("next", 12);
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
					priority_id: this.non_c.pri.id,
					pri: this.non_c.pri,
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
				this.non_c.pri = this.audit.pri_types[newVal];
			},
		},
	};
</script>