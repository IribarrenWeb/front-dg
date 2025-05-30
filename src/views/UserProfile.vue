<template>
	<div class="mt--7">
		<div class="container-fluid">
			<div class="container mb-4">
				<q-tabs inline-label v-model="currentStep" dense align="justify" class="text-grey-3">
					<q-tab v-for="step, idx in steps" :key="idx" :name="step.number" icon="mail" :label="step.title" />
				</q-tabs>
			</div>
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
											<q-btn v-if="!$store.state?.is_superadmin" :loading="loadingDelete"
												color="danger" outline icon="fa-regular fa-trash-can"
												label="Eliminar mi cuenta" @click="deleteAccount" />
											<!-- <a href="#!" class="btn btn-sm btn-default">Configuracion</a> -->
										</div>
									</div>
								</div>
							</template>

							<div class="px-lg-3 px-md-2 px-1 mx-xl-4">
								<div v-if="[1, 5].includes(model.role_id)">
									<h6 v-if="!model?.profile?.id" class="heading-small text-muted mb-4">
										Informacion de usuario
									</h6>
									<form-consulting :profileMode="true" v-if="model?.profile?.id"
										:consultingId="model.profile.id" />
									<form-validate v-else @submit="updateUser" class="row">
										<div class="col-md-6">
											<base-field name="name" label="Nombre">
												<field-validate class="form-control" name="name" label="nombre"
													rules="required" v-model="model.name" />
											</base-field>
										</div>
										<div class="col-md-6">
											<base-field name="last_name" label="Apellido">
												<field-validate class="form-control" name="last_name" label="apellido"
													rules="required" v-model="model.last_name" />
											</base-field>
										</div>
										<div class="col-md-6">
											<base-field name="email" label="Correo">
												<field-validate class="form-control" name="email" label="Correo"
													rules="required|email" v-model="model.email" />
											</base-field>
										</div>
										<div class="col-12 d-flex">
											<base-button class="mr-0 ml-auto" nativeType="submit">Actualizar
											</base-button>
										</div>
									</form-validate>
								</div>
								<!-- Address -->
								<div v-if="model.role_id >= 2 && model.role_id != 5">
									<h6 class="heading-small text-muted mb-4">
										Informacion de perfil
									</h6>
									<div class="px-0">
										<component :is="component" :id="roleModel.id" :business="roleModel" :profile="true"
											:user="model"></component>
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
											<h3 class="mb-0">{{ steps[2].title }}</h3>
										</div>
										<div class="col-4 text-right">
											<!-- <a href="#!" class="btn btn-sm btn-default">Configuracion</a> -->
										</div>
									</div>
								</div>
							</template>
							<div class="px-md-2 px-1 mx-xl-1">
								<profile-show :profile="profileModel" :columns="colsProfile"
									:title="model.role_id == 4 ? 'Consultores ADR' : 'Delegación'" />
							</div>
							<div class="px-md-2 px-1 mx-xl-1" v-if="$store.state.is_business">
								<profile-show :data="model.business.installations" :columns="colsAuditors"
									title="Auditores ADR" />
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
import FormDelegate from "../components/Delegate/FormDelegate";
import FormAuditor from "../components/Auditor/FormAuditor";
import FormPassword from "../components/Auth/FormPassword";
import ShowBusiness from "../components/Business/ShowBusiness";
import apiService from "../store/services/model-service.js";
import { useStore } from "vuex";
import FormConsulting from "../components/Superadmin/FormConsulting.vue";
import ProfileShow from "../components/ProfileShow";
import { Dialog, Notify } from "quasar";

export default {
	name: "user-profile",
	components: {
		FormDelegate,
		FormAuditor,
		FormPassword,
		ShowBusiness,
		ProfileShow,
		FormConsulting
	},
	setup() {
		const model = ref({
			name: null,
			last_name: null,
			email: null,
		});

		const loadingDelete = ref(false)

		const colsProfile = [
			{
				title: 'Nombre',
				field: 'user.full_name'
			},
			{
				title: 'CIF/NIF',
				field: 'cif_nif',
				op_field: 'dni'
			},
			{
				title: 'Móvil',
				field: 'phone_number'
			},
			{
				title: 'Email',
				field: 'user.email'
			},
		]
		const colsAuditors = [
			{
				title: 'Instalación',
				field: 'name'
			},
			{
				title: 'Nombre',
				field: 'auditable.user.full_name'
			},
			{
				title: 'DNI',
				field: 'auditable.dni'
			},
			{
				title: 'Móvil',
				field: 'auditable.phone_number'
			},
			{
				title: 'Email',
				field: 'auditable.user.email'
			},
		]
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
			return model.value?.role?.name == 'business_no_adr' ? 'business' : model.value?.role?.name;
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
				} else if (role.value == 'auditor') {
					profile = roleModel.value.delegate
				}
			}
			return profile;
		})

		async function updateUser(values) {
			try {
				await apiService.api({ url: "users", method: "put", data: values });
			} catch (err) {
				console.log(err);
			}
		}

		async function getUser(params = null) {
			const data = await service.get(params);
			model.value = data.list.user;
		}

		function deleteAccount() {
			Dialog.create({
				title: 'Eliminar mi cuenta',
				message: '¿Estas seguro de querer eliminar tu cuenta?. Esta acción es irreversible. Todos los datos seran eliminados y no podran ser recuperados',
				ok: {
					label: 'Eliminar',
					outline: true,
					color: 'danger'
				},
				cancel: {
					label: 'Cancelar'
				}
			}).onOk(async () => {
				try {
					loadingDelete.value = true
					// throw Error

					const res = await apiService.api({ url: 'users/delete-account', method: 'DELETE' })

					Notify.create({
						// position: 'center',
						closeBtn: 'Aceptar',
						message: 'Tu cuenta ha sido eliminada.',
						color: 'positive'
					})
					setTimeout(() => {
						store.dispatch("auth/logout");
					}, 1000);
					loadingDelete.value = false
				} catch (error) {
					console.error(error);
					loadingDelete.value = false
					Notify.create({
						// position: 'center',
						closeBtn: 'Aceptar',
						message: 'Ocurrio un error al eliminar tu cuenta.',
						color: 'negative'
					})
				}
			})
		}

		onMounted(() => {
			// getUser();
		});

		watch(
			() => store.state.role,
			(v) => {
				if (v > 0) {

					let params = '';
					if ((v == 4 || v == 6) && (store.getters['profile/profile']?.consultancy_id || store.getters['profile/profile']?.administrable_type)) {
						params = 'includes[]=administrable.user&includes[]=installations.auditable.user';

						steps.value.push({
							title: "Consultores ADR",
							number: 3,
							valid: null,
						});
					}

					if (v == 3 && store.getters['profile/profile']?.consultancy_id) {
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
			component,
			roleModel,
			colsProfile,
			steps,
			currentStep,
			profileModel,
			colsAuditors,
			loadingDelete,
			updateUser,
			deleteAccount,
		};
	},
};
</script>
<style>
.bg-gradient-blue {
	background: linear-gradient(87deg, #2d41ce 0, #0206ff 100%) !important;
}
</style>
