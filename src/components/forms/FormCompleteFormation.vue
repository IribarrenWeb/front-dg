<template>
	<div>
		<div
			class="row border rounded border-light px-3 py-2 mx-0"
			v-if="isComplete"
		>
			<div class="col-lg-6">
				<base-field name="name" label="Nombre">
					<input
						type="text"
						class="form-control text-uppercase"
						:disabled="true"
						:value="training?.formation?.name"
					/>
				</base-field>
			</div>
			<div class="col-lg-6">
				<base-field name="formation_type_id" label="Modalidad">
					<input
						type="text"
						class="form-control text-uppercase"
						:disabled="true"
						:value="training?.formation?.type?.name"
					/>
				</base-field>
			</div>
			<div class="col-lg-6">
				<base-field name="duration" label="Duración">
					<input
						type="text"
						class="form-control text-uppercase"
						:disabled="true"
						:value="training?.formation?.duration"
					/>
				</base-field>
			</div>
			<div class="col-lg-6" v-if="!$store.state.is_auditor">
				<base-field name="auditor_id" label="Responsable">
					<input
						type="text"
						class="form-control text-uppercase"
						:disabled="true"
						:value="training?.formation?.facilitable.user.full_name"
					/>
				</base-field>
			</div>
			<div class="col-lg-12">
				<base-field name="content" label="Contenido">
					<textarea
						cols="20"
						:disabled="true"
						rows="5"
						class="form-control"
						:value="training?.formation?.content"
					></textarea>
				</base-field>
			</div>
		</div>

		<form-validate @submit="onSubmit" v-slot="{ resetForm }">
			<div
				class="border rounded border-light px-3 py-2 my-2"
				style="overflow-x: scroll"
			>
				<h4 v-if="isComplete">Listado de asistentes</h4>
				<table class="table table-sm table-hover table-bordered">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>DNI</th>
							<th>CARGO</th>
							<th>ULTIMA FORMACIÓN</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="training.employees.length < 1">
							<td colspan="4">No hay empleados disponibles</td>
						</tr>
						<tr v-for="employee in training.employees" :key="employee.id">
							<td>
								<div class="form-check">
									<input
										v-if="!isComplete"
										class="form-check-input"
										type="checkbox"
										:value="employee.id"
										v-model="employees_ids"
									/>
									<label class="form-check-label" for="flexCheckDefault">
										{{ employee.full_name }}
									</label>
								</div>
							</td>
							<td>
								{{ employee.dni }}
							</td>
							<td>
								{{ employee.position }}
							</td>
							<td>
								{{
									employee.last_formation == null
										? "SIN FORMACIÓN"
										: employee.last_formation.date_formatted
								}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="mt-4 float-md-right">
				<base-button type="default" nativeType="submit" v-if="!isComplete"
					>Aceptar</base-button
				>
				<base-button
					type="default"
					:outline="true"
					class="ml-auto"
					@click="handleClose(resetForm)"
					>Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>

<script>
	import service from "@/store/services/model-service";

	export default {
		props: {
			training_id: null,
			isComplete: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				employees_ids: [],
				training: null,
			};
		},
		mounted() {
			this.loadTraining();
		},
		methods: {
			async onSubmit(values, { resetForm }) {
				try {
					await service.update("training", this.training_id, {
						employees_ids: this.employees_ids,
						status: 1,
					});

					this.$toast.success("Formación completada");
					resetForm();
					this.$emit("close");
					this.$emit("reload");
				} catch (error) {
					console.log(error);
				}
			},
			async loadTraining() {
				try {
					const resp = await service.show(
						"training",
						this.training_id,
						"includes[]=employees&includes[]=formation.facilitable.user&includes[]=formation.type"
					);
					this.training = resp.data.data;
				} catch (err) {
					console.log(err);
				}
			},
			async loadInstallations() {
				try {
					const resp = await service.getIndex("installation", null);
					this.installations = resp.data.data;
				} catch (err) {
					console.log(err.response);
					// this.$toast.error('No se pudieron cargar los tipos de vehiculos')
				}
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
		},
	};
</script>