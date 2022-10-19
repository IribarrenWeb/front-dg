<template>
	<div>
		<form-validate @submit="changePass">
			<div class="row border rounded border-light px-md-3 py-md-2">
				<div class="col-md-6">
					<base-field name="password" label="Contrasena actual">
						<field-validate
							type="password"
							class="form-control"
							:validateOnInput="true"
							name="password"
							v-model="model.password"
							rules="required"
							label="contrasena actual"
						/>
					</base-field>
				</div>
				<div class="col-12">
					<div class="row">
						<div class="col-md-6">
							<base-field name="new_password" label="Contrasena nueva">
								<field-validate
									type="password"
									class="form-control"
									:validateOnInput="true"
									name="new_password"
									v-model="model.new_password"
									rules="required|min:6"
									label="contrasena nueva"
								/>
							</base-field>
						</div>
						<div class="col-md-6">
							<base-field
								name="new_password_confirmation"
								label="Confirmación contrasena"
							>
								<field-validate
									type="password"
									:validateOnInput="true"
									class="form-control"
									name="new_password_confirmation"
									v-model="model.new_password_confirmation"
									rules="required|confirmed:@new_password"
									label="confirmación contrasena"
								/>
							</base-field>
						</div>
					</div>
				</div>
				<div class="col-12 d-flex justify-content-end mb-3">
					<base-button
						type="default"
						nativeType="submit"
					>
						Actualizar
					</base-button>
				</div>
			</div>
		</form-validate>
	</div>
</template>
<script>
	import { createToaster } from "@meforma/vue-toaster";
	import { ref } from "vue";
	import service from "../../store/services/model-service";

	export default {
        name:"form-password",
		setup() {
			const toaster = createToaster();
			const model = ref({
				password: null,
				new_password: null,
				new_password_confirmation: null,
			});
			async function changePass(values, {resetForm}) {
				try {
                    await service.api({url:"update-password", method: "put",data: values});
                    toaster.success('Contrasena actualizada')
                    resetForm()
                } catch (error) {
                    toaster.error('No se pudo actualizar su contrasena')
                    console.log(error);
                }
			}
			return {
				changePass,
				model,
			};
		},
	};
</script>