<template>
	<div class="row justify-content-center">
		<div class="col-lg-5 col-lg-7">
			<div class="card bg-secondary shadow border-0">
				<div class="card-body px-lg-5 py-lg-5">
					<div class="text-center text-muted mb-4">
						<small>Resetear password</small>
					</div>
					<form-validate @submit="submit()" v-slot="{meta,isSubmitting}">
						<base-field name="email" addon-left-icon="ni ni-email-83">
							<field-validate
								autocomplete="off"
								class="form-control border-0 shadow pl-2"
								placeholder="Email"
								rules="required|email"
								v-model="model.email"
								name="email"
								:disabled="true"
								label="email"
							></field-validate>
						</base-field>
						<base-field name="token" addon-left-icon="ni ni-email-83">
							<field-validate
								class="form-control border-0 shadow pl-2"
								placeholder="Codigo"
								rules="required"
								v-model="model.token"
								name="token"
								label="Codigo"
							></field-validate>
						</base-field>
						<base-field name="password" addon-left-icon="ni ni-email-83">
							<field-validate
								autocomplete="off"
								type="password"
								:validateOnInput="true"
								class="form-control border-0 shadow pl-2"
								placeholder="Nueva contraseña"
								rules="required"
								v-model="model.password"
								name="password"
								label="nueva contraseña"
							></field-validate>
						</base-field>
						<base-field name="password_confirmation" addon-left-icon="ni ni-email-83">
							<field-validate
								autocomplete="off"
								class="form-control border-0 shadow pl-2"
								type="password"
								:validateOnInput="true"
								placeholder="Confirmar contraseña"
								rules="required|confirmed:@password"
								v-model="model.password_confirmation"
								name="password_confirmation"
								label="confirmar contraseña"
							></field-validate>
						</base-field>

						<div class="text-center">
							<base-button type="default" :disabled="!meta.valid || isSubmitting" nativeType="submit" class="my-4">
								<div class="spinner-border text-light spinner-border-sm mr-2" v-if="isSubmitting" role="status">
								</div>
								<span>{{ isSubmitting ? 'Enviando' : 'Cambiar' }}</span>
							</base-button>
						</div>
					</form-validate>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-6">
					<a href="#" class="text-light"><small>Login</small></a>
				</div>
				<div class="col-6 text-right">
					<router-link to="/reset-password-request" class="text-light"
						><small>Enviar codigo nuevamente</small></router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "login",
		data() {
			return {
				model: {
					email: "",
					password: "",
					password_confirmation: "",
					token: "",
				},
				loading: false,
			};
		},
		mounted() {
			if (this.$route.params.email) {
				this.model.email = this.$route.params.email
			}else{
				this.$route.back()
			}
		},
		methods: {
			async submit() {
				this.loading = true;
				try {
					await this.$store.dispatch(
						"auth/resetPassword",
						this.model
					);
					this.$toast.success("Su contrasena se ha actualizado correctamente");
					this.$router.push("/login");
				} catch (err) {
					this.$toast.error(err.response.data.message);
				}
				this.loading = false;
			},
		},
	};
</script>
<style></style>