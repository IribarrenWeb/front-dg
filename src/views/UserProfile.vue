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
										<!-- <a href="#!" class="btn btn-sm btn-default">Configuracion</a> -->
									</div>
								</div>
							</div>
						</template>

						<div class="px-lg-5 px-md-3 px-1 mx-xl-5">
							<div v-if="model.role_id == 1">
								<h6 class="heading-small text-muted mb-4">
									Informacion de usuario
								</h6>
								<div class="row">
									<div class="col-lg-4 col-md-6">
										<base-input :view="true" name="first_name" label="Nombre"
											:modelValue="model.name" />
									</div>
									<div class="col-lg-4 col-md-6">
										<base-input :view="true" label="Apellido" :modelValue="model.last_name" />
									</div>
									<div class="col-lg-4 col-md-6">
										<base-input :view="true" name="email" label="Correo" :modelValue="model.email" />
									</div>
								</div>
								<hr class="my-4" />
							</div>
							<!-- Address -->
							<div v-if="model.role_id >= 2">
								<h6 class="heading-small text-muted mb-4">Informacion de perfil</h6>
								<div class="px-0">
									<component :is="component" :id="roleModel.id" :business="roleModel" :profile="true" :user="model"></component>
								</div>
							</div>
							<hr>
							<div class="mt-5 mb-2">
								<h6 class="heading-small text-muted mb-4">
									Cambio de contrasena
								</h6>
								<form-password></form-password>
							</div>
						</div>
					</card>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import service from "../store/services/profile-service.js";
import { computed, onMounted, ref } from "vue";
import functions from "../utils/functions";
import FormDelegate from "../components/forms/FormDelegate";
import FormAuditor from "../components/forms/FormAuditor";
import FormPassword from "../components/forms/FormPassword";
import ShowBusiness from "../components/forms/Business/ShowBusiness";

export default {
    name: "user-profile",
	components: {
		FormDelegate,
		FormAuditor,
		FormPassword,
		ShowBusiness
	},
	setup() {
		const model = ref({
			name: null,
			last_name: null,
			email: null
		})
		const component = computed(() => {
			let comp = ''
			if (role.value == 'auditor' || role.value == 'delegate') {
				comp = 'form-' + role.value
			}else{
				comp = 'show-business';
			}
			return comp;
		})
		const role = computed(() => {
			return model.value?.role?.name
		})
		const roleModel = computed(() => {
			return functions.assignSchema(role.value, model.value[role.value], ['address'])
		})
		
		async function getUser(){
			const data = await service.get();
			model.value = data.list.user;
		}

		onMounted(() => {
			getUser()
		})
		
		return {
			model,
			role,
			component,
			roleModel
		}
	},
};
</script>
<style>
.bg-gradient-blue {
	background: linear-gradient(87deg, #2d41ce 0, #0206ff 100%) !important;
}
</style>
