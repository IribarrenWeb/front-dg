<template>
	<div>
		<form-validate @submit="onSubmit" v-slot="{ resetForm }">
			<table class="table table-sm table-hover">
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
									: this.$functions.formatDate(
											employee.last_formation.document_date
									  )
							}}
						</td>
					</tr>
				</tbody>
			</table>

			<div class="mt-4 float-md-right">
				<base-button type="default" nativeType="submit">Aceptar</base-button>
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
		props: ["training_id"],
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
					const resp = await service.show("training", this.training_id);
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