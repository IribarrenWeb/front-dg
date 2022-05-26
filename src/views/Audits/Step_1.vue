<template>
	<form-validate @submit="onSubmit" v-slot="{ meta }">
		<div
			class="d-flex justify-content-center"
			v-if="typeof installation.id == 'undefined'"
		>
			<div class="spinner-border" role="status"></div>
		</div>
		<div v-else>
			<span class="col-2 font-weight-bold text-muted h5"
				>Referencia de informe: #{{ audit_id }}</span
			>
			<hr />
			<div class="row px-md-2">
				<div class="col-12">
					<h4 class="text-uppercase">Datos iniciales</h4>
					<div class="row">
						<div class="col row" v-if="installation.auditable != null">
							<base-input
								:view="true"
								formClasses="col-md-6"
								:modelValue="installation.auditable.user.name"
								label="Consejero de seguridad designado"
								disabled
							/>
							<base-input
								:view="true"
								formClasses="col-md-6"
								:modelValue="installation.auditable.user.email"
								label="Email Consejero de seguridad"
								disabled
							/>
						</div>
                        <div class="col row" v-else>
                            <base-input
								:view="true"
								formClasses="col-md-6"
								modelValue="No posee auditor"
								label="Email Consejero de seguridad"
								disabled
							/>
                        </div>
					</div>
				</div>
				<div class="col-12 row">
					<div class="col-md-4">
						<base-field name="visit_date" label="FECHA DE VISITA">
							<field-validate
								type="date"
								class="form-control"
								name="visit_date"
								rules="required"
								label="fecha de visita"
								v-model="visit_date"
							/>
						</base-field>
					</div>
				</div>
				<base-input
					:view="true"
					formClasses="col-md-4"
					:modelValue="`${installation.company.business_name} - ${installation.name}`"
					label="EMPRESA/INSTALACIÓN QUE SE REALIZA LA VISITA"
					disabled
				/>
				<div class="col-md-12 row">
					<base-input
						:view="true"
						formClasses="col-md-6"
						:modelValue="installation.address"
						label="Dirección de la instalación"
						disabled
					/>
					<base-input
						:view="true"
						formClasses="col-md-6"
						:modelValue="installation.province.name"
						label="Provincia"
						disabled
					/>
					<base-input
						:view="true"
						formClasses="col-md-4"
						:modelValue="installation.province.city.name"
						label="Ciudad"
						disabled
					/>
					<base-input
						:view="true"
						formClasses="col-md-4"
						modelValue="542121"
						label="Codigo postal"
						disabled
					/>
					<base-input
						:view="true"
						formClasses="col-md-4"
						modelValue="ESPAÑA"
						label="País"
						disabled
					/>
				</div>
				<div class="col-md-12 row" v-if="installation.responsible != null">
					<base-input
						:view="true"
						formClasses="col-md-6"
						:modelValue="installation.responsible.name"
						label="Nombre del responsable"
						disabled
					/>
					<base-input
						:view="true"
						formClasses="col-md-6"
						:modelValue="installation.responsible.email"
						label="Correo electronico del responsable"
						disabled
					/>
				</div>
				<div class="col-md-12 row" v-else>No posee responsable</div>
				<div class="col-12">
					<div class="mt-4 float-md-right">
						<!-- <base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
                        >Anterior</base-button
                        > -->
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
		</div>
	</form-validate>
</template>
<script>
	import service from "@/store/services/model-service";
	export default {
		props: ["audit", "currentStep"],
		data() {
			return {
				visit_date: "",
				installation: {},
				installation_id: null,
				audit_id: null,
			};
		},
		async mounted() {
			let id = this.$route.params.id;
			this.audit_id = id;
			if (typeof this.audit.id == "undefined") {
				const res = await service.show("audit", id);
				console.log(this.audit.visit_date);
				this.visit_date = res.data.data.visit_date;
				this.installation_id = res.data.data.installation_id;
			} else {
				console.log(this.audit.visit_date);
				this.visit_date = this.audit.visit_date;
				this.installation_id = this.audit.installation_id;
			}
			this.loadInstallation();
		},
		methods: {
			async onSubmit() {
				try {
					await service.update("audit", this.audit_id, {
						visit_date: this.visit_date,
						current_step: 2,
						valid_step:
							this.audit.valid_step >= this.currentStep
								? this.audit.valid_step
								: this.currentStep,
						status: "INCOMPLETO",
					});
				} catch (err) {
					let message = err.response.message
						? err.response.message
						: "Ocurrio un error al guardar los cambios";
					this.$toast.error(message);
					console.log(err);
				}
				this.$emit("next", 1);
			},
			async loadInstallation() {
				try {
					const res = await service.show(
						"installation",
						this.installation_id,
						"responsible=responsible&includes[]=company&includes[]=province.city&includes[]=auditable.user"
					);
					this.installation = res.data.data;
				} catch (err) {
					console.log(err);
				}
			},
		},
	};
</script>