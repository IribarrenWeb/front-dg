<template>
	<div class="row justify-content-center">
		<div class="col-lg-5 col-lg-7">
			<div class="card bg-secondary shadow border-0">
				<div class="card-body px-lg-5 py-lg-5">
					<div class="text-center text-muted mb-4">
						<small>Resetear password</small>
					</div>
					<form-validate @submit="submit()" v-slot="{ meta, isSubmitting }">
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
						<base-field name="password" addon-left-icon="fa-solid fa-lock">
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
						<base-field
							name="password_confirmation"
							addon-left-icon="fa-solid fa-lock"
						>
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

						<base-field
							name="token"
							label="Codigo"
							helpText="Ingresa el codigo que te enviamos al correo."
						>
							<field-validate
								class="form-control border-0 shadow pl-2"
								placeholder="Codigo"
								rules="required"
								name="token"
								label="Codigo"
								v-slot="{ field }"
							>
								<code-input
									v-bind="field"
									@complete="completed = true, model.token = $event"
									:fields="5"
									:fieldWidth="56"
									:fieldHeight="56"
									:required="true"
								/>
							</field-validate>
						</base-field>
						<div class="text-center">
							<base-button
								type="default"
								:disabled="!meta.valid || isSubmitting || !completed"
								nativeType="submit"
								class="my-4"
							>
								<div
									class="spinner-border text-light spinner-border-sm mr-2"
									v-if="isSubmitting"
									role="status"
								></div>
								<span>{{ isSubmitting ? "Enviando" : "Cambiar" }}</span>
							</base-button>
						</div>
					</form-validate>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-6">
					<router-link to="/login" class="text-light"><small>Login</small></router-link>
				</div>
				<div class="col-6 text-right">
					<a
						href="#"
						@click.prevent="handleReset"
						:disabled="resend_code"
						class="text-light"
					>
						<small v-if="!resend_code">Enviar codigo nuevamente</small>
						<div v-else>
							<div class="spinner-border spinner-border-sm text-light" role="status">
								<span class="sr-only">Loading...</span>
							</div>
							Enviando codigo...
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import CodeInput from "../../components/Utils/CodeInput.vue";
	export default {
		components: { CodeInput },
		name: "login",
		data() {
			return {
				model: {
					email: "",
					password: "",
					password_confirmation: "",
					token: "",
				},
				completed: false,
				loading: false,
				resend_code: false,
			};
		},
		mounted() {
			if (this.$route.params.email) {
				this.model.email = this.$route.params.email;
			} else {
				this.$route.back();
			}
		},
		methods: {
			async submit() {
				this.loading = true;
				try {
					await this.$store.dispatch("auth/resetPassword", this.model);
					this.$toast.success("Su contrasena se ha actualizado correctamente");
					this.$router.push("/login");
				} catch (err) {
					this.$toast.error(err.response.data.message);
				}
				this.loading = false;
			},
			async handleReset() {
				try {
					this.resend_code = true;
					await this.$store.dispatch("auth/sendResetEmail", {
						email: this.model.email,
					});
					this.resend_code = false;
					this.$toast.success("Codigo reenviado");
				} catch (err) {
					this.resend_code = false;
					this.$toast.error(err.response.data.message);
				}
			},
		},
	};
</script>
<style></style>