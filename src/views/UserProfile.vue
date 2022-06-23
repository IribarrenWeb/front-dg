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
							<!-- Address -->
							<div v-if="model.role_id >= 2">
								<h6 class="heading-small text-muted mb-4">Informacion de perfil</h6>
								<div class="pl-lg-4">
									<AddressSelect
										v-model:address="roleModel.address.address" 
										v-model:city="roleModel.address.city" 
										v-model:code="roleModel.address.code" 
										v-model:country="roleModel.address.country"
									/>
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
import AddressSelect from "../components/AddressSelect.vue";
import { computed, onMounted, ref } from "vue";
import functions from "../utils/functions";

export default {
    name: "user-profile",
    components: { AddressSelect },
	setup() {
		const model = ref(null)
		const role = computed(() => {
			return model.value?.role?.name
		})
		const roleModel = computed(() => {
			console.log(model.value,role.value);
			return functions.assignSchema(role.value, model.value, ['address'])
		})
		
		async function getUser(){
			const data = await service.get();
			model.value = data.list.user;
			roleModel.value = data.list[role.value]
		}

		onMounted(() => {
			getUser()
		})
		
		return {
			model,
			role,
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
