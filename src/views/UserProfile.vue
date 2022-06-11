<template>
	<div>
		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col-12">
					<card shadow type="secondary">
						<template v-slot:header>
							<div class="bg-white border-0">
								<div class="row align-items-center">
									<div class="col-8">
										<h3 class="mb-0">Mi cuenta</h3>
									</div>
									<div class="col-4 text-right">
										<a href="#!" class="btn btn-sm btn-default">Configuracion</a>
									</div>
								</div>
							</div>
						</template>

						<form>
							<h6 class="heading-small text-muted mb-4">
								Informacion de usuario
							</h6>
							<div class="row">
								<div class="col-lg-4 col-md-6">
									<base-input :view="true" name="email" label="Correo" :modelValue="u_data.email" />
								</div>
								<div class="col-lg-4 col-md-6">
									<base-input :view="true" name="first_name" label="Nombre"
										:modelValue="u_data.name" />
								</div>
								<div class="col-lg-4 col-md-6">
									<base-input :view="true" label="Apellido" :modelValue="u_data.last_name" />
								</div>
							</div>
							<hr class="my-4" />
							<!-- Address -->
							<div v-if="u_data.role_id >= 2">
								<h6 class="heading-small text-muted mb-4">Informacion de perfil</h6>
								<div class="pl-lg-4">
									<div class="row">
										<div class="col-md-12">
											<base-input name="" label="Direccion" placeholder="Dirección"
												input-classes="form-control-alternative" :modelValue="model.address" />
										</div>
									</div>
									<div class="row">
										<div class="col-lg-4">
											<base-input name="" :view="true" label="Ciudad" placeholder="Ciudad"
												input-classes="form-control-alternative" :modelValue="model.city" />
										</div>
										<div class="col-lg-4">
											<base-input name="" :view="true" label="Pais" placeholder="País"
												input-classes="form-control-alternative" :modelValue="model.country" />
										</div>
										<div class="col-lg-4">
											<base-input name="" :view="true" label="Codigo postal"
												placeholder="Codigo postal" input-classes="form-control-alternative"
												:modelValue="model.zipCode" />
										</div>
									</div>
								</div>
							</div>
						</form>
					</card>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import service from "../store/services/profile-service.js";
export default {
	name: "user-profile",
	data() {
		return {
			model: {
				address: "Av samaniego",
				city: "Barcelona",
				country: "España",
				zipCode: "80151",
			},
			u_data: {}
		};
	},
	async beforeMount() {
		const u_data = await service.get()
		this.u_data = u_data.list.user
	},
	computed: {

	}
};
</script>
<style>
.bg-gradient-blue {
	background: linear-gradient(87deg, #2d41ce 0, #0206ff 100%) !important;
}
</style>
