<template>
	<div>
		<form-validate @submit="onSubmit" v-slot="{ resetForm }">
			<div class="row border rounded border-light px-4 py-2">
				<div class="col-lg-6">
					<base-field name="name" label="Nombre">
						<field-validate
							type="text"
							class="form-control text-uppercase"
							name="name"
							label="name"
							v-model="model.name"
						/>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="file" label="Documento">
						<field-validate
							class="form-control"
							type="file"
							name="file"
							rules="required"
							:validateOnInput="true"
							label="documentacion"
							v-model="model.file"
						/>
					</base-field>
				</div>
			</div>

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
	import service from "../../store/services/model-service";
	export default {
        name: "form-document",
		data() {
			return {
				model: {
					name: null,
					file: null,
				},
				loader: false,
			};
		},
		mounted() {
			console.log(this.update);
			if (this.update) {
				this.setModel(this.subcontractor);
			}
		},
		methods: {
			async onSubmit(values, { resetForm }) {
				try {
					const data = new FormData;

                    data.append('name', this.model.name);
                    data.append('file', this.model.file[0]);

                    await service.store("documents", data,true);
                    this.$toast.success("Documento registrado");
                    resetForm();
                    this.$emit("close");

					this.$emit("reload");
				} catch (error) {
					console.log(error);
				}
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
		},
	};
</script>