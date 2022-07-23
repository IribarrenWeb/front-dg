<template>
	<div>
		<div class="container-fluid">
			<base-steps
				:currentStep="currentStep"
				listClasses="mb-md-4 pb-md-2 mt-5"
				:steps="steps"
				:edit="true"
				@step="currentStep = $event"
				@navigate="currentStep = $event"
			></base-steps>
			<div class="row">
				<template v-if="currentStep == 1">
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

							<div class="px-lg-3 px-md-2 px-1 mx-xl-4">
								<div v-if="role == 'admin'">
									<h6 class="heading-small text-muted mb-4">
										Informacion de usuario
									</h6>
									<form-validate @submit="updateUser" class="row">
										<div class="col-md-6">
											<base-field name="name" label="Nombre">
												<field-validate
													class="form-control"
													name="name"
													label="nombre"
													rules="required"
													v-model="model.name"
												/>
											</base-field>
										</div>
										<div class="col-md-6">
											<base-field name="last_name" label="Apellido">
												<field-validate
													class="form-control"
													name="last_name"
													label="apellido"
													rules="required"
													v-model="model.last_name"
												/>
											</base-field>
										</div>
										<div class="col-md-6">
											<base-field name="email" label="Correo">
												<field-validate
													class="form-control"
													name="email"
													label="Correo"
													rules="required|email"
													v-model="model.email"
												/>
											</base-field>
										</div>
										<div class="col-12 d-flex">
											<base-button class="mr-0 ml-auto" nativeType="submit"
												>Actualizar</base-button
											>
										</div>
									</form-validate>
								</div>
								<!-- Address -->
								<div v-if="model.role_id >= 2">
									<h6 class="heading-small text-muted mb-4">
										Informacion de perfil
									</h6>
									<div class="px-0">
										<component
											:is="component"
											:id="roleModel.id"
											:business="roleModel"
											:profile="true"
											:user="model"
										></component>
									</div>
								</div>
							</div>
						</card>
					</div>
				</template>
				<template v-if="currentStep == 2">
					<div class="col-12">
						<card shadow type="secondary">
							<template v-slot:header>
								<div class="bg-white border-0">
									<div class="row align-items-center">
										<div class="col-8">
											<h3 class="mb-0">Cambio de contraseña</h3>
										</div>
										<div class="col-4 text-right">
											<!-- <a href="#!" class="btn btn-sm btn-default">Configuracion</a> -->
										</div>
									</div>
								</div>
							</template>
							<div class="px-lg-3 px-md-2 px-1 mx-xl-4">
								<form-password></form-password>
							</div>
						</card>
					</div>
				</template>
				<template v-if="currentStep == 3 && !$store.state.is_admin">
					<div class="col-12">
						<card shadow type="secondary">
							<template v-slot:header>
								<div class="bg-white border-0">
									<div class="row align-items-center">
										<div class="col-8">
											<h3 class="mb-0">{{steps[2].title}}</h3>
										</div>
										<div class="col-4 text-right">
											<!-- <a href="#!" class="btn btn-sm btn-default">Configuracion</a> -->
										</div>
									</div>
								</div>
							</template>
							<div class="px-md-2 px-1 mx-xl-1">
								<profile-show :profile="profileModel" :title="model.role_id == 4 ? 'Consultores ADR' : 'Delegación'" />
							</div>
						</card>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
	import service from "../store/services/profile-service.js";
	import { computed, onMounted, ref, watch } from "vue";
	import functions from "../utils/functions";
	import FormDelegate from "../components/forms/FormDelegate";
	import FormAuditor from "../components/forms/FormAuditor";
	import FormPassword from "../components/forms/FormPassword";
	import ShowBusiness from "../components/forms/Business/ShowBusiness";
	import apiService from "../store/services/model-service.js";
	import { useStore } from "vuex";
	import ProfileShow from "../components/ProfileShow";

	export default {
		name: "user-profile",
		components: {
			FormDelegate,
			FormAuditor,
			FormPassword,
			ShowBusiness,
			ProfileShow,
		},
		setup() {
			const model = ref({
				name: null,
				last_name: null,
				email: null,
			});
			const store = useStore();
			const component = computed(() => {
				let comp = "";
				if (role.value == "auditor" || role.value == "delegate") {
					comp = "form-" + role.value;
				} else {
					comp = "show-business";
				}
				return comp;
			});

			const currentStep = ref(1);
			const steps = ref([
				{
					title: "General",
					number: 1,
					valid: null,
				},
				{
					title: "Contraseña",
					number: 2,
					valid: null,
				},
			]);
			const role = computed(() => {
				return model.value?.role?.name;
			});
			const roleModel = computed(() => {
				return functions.assignSchema(role.value, model.value[role.value], [
					"address",
				]);
			});
			const profileModel = computed(() => {
				let profile = null;
				if (roleModel.value) {
					if (role.value == 'business') {
						profile = roleModel.value.administrable
					}else if(role.value == 'auditor'){
						profile = roleModel.value.delegate
					}
				}
				return profile;
			})

			async function updateUser(values) {
				try {
					await apiService.api("users", "put", null, null, values);
				} catch (err) {
					console.log(err);
				}
			}

			async function getUser(params = null) {
				const data = await service.get(params);
				model.value = data.list.user;
			}

			onMounted(() => {
				// getUser();
			});

			watch(
				() => store.state.role,
				(v) => {
					if (v > 0) {
						
						let params = '';
						if (v == 4) {
							params = 'includes[]=administrable.user';

							steps.value.push({
								title: "Consultores ADR",
								number: 3,
								valid: null,
							});
						}

						if (v == 3) {
							params = 'includes[]=delegate.user';

							steps.value.push({
								title: "Delegación",
								number: 3,
								valid: null,
							});
						}

						getUser(params);
					}
				},
				{ immediate: true }
			);

			return {
				model,
				role,
				updateUser,
				component,
				roleModel,
				steps,
				currentStep,
				profileModel
			};
		},
	};
</script>
<style>
	.bg-gradient-blue {
		background: linear-gradient(87deg, #2d41ce 0, #0206ff 100%) !important;
	}
</style>
