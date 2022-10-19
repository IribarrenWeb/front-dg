<template>
	<div>
		<div class="container-fluid mt--7">
			<div class="d-flex justify-content-lg-end mb-2">
				<base-button
					@click="this.modal = true"
					size="sm"
					type="default"
					:outline="false"
					><i class="fa-solid fa-pencil"></i> Editar</base-button
				>
			</div>
			<div class="card overflow-auto">
				<table class="table table-sm table-bordered">
					<tbody>
						<tr class="text-uppercase">
							<th scope="row">Nombre empresa</th>
							<th scope="col">CIF/NIF</th>
							<th scope="row">Ciudad</th>
							<th scope="row">Codigo postal</th>
							<th scope="row">Pais</th>
							<th scope="row">Instalaciones</th>
						</tr>
						<tr>
							<td>{{ business?.user.full_name }}</td>
							<td>{{ business?.business_nif ?? "N/A" }}</td>
							<td>{{ business?.address?.city ?? "N/A" }}</td>
							<td>{{ business?.address?.code ?? "N/A" }}</td>
							<td>{{ business?.address?.country ?? "N/A" }}</td>
							<td>{{ business?.installations_count }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="col">Nombre Responsable</th>
							<th scope="col">DNI</th>
							<th scope="col">Email</th>
							<th colspan="4" scope="col">Movil</th>
						</tr>
						<tr>
							<td>
								{{ business?.property_name ?? "N/A" }}
								{{ business?.property_last_name }}
							</td>
							<td>{{ business?.property_dni ?? "N/A" }}</td>
							<td>{{ business?.property_email ?? "N/A" }}</td>
							<td colspan="4">{{ business?.property_phone ?? "N/A" }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="row">Fecha de ALTA</th>
							<th colspan="6" scope="row">Documentacion</th>
						</tr>
						<tr>
							<td>
								<span v-if="file_doc">
									{{ formatDate(file_doc?.document_date, "en-GB") }}
								</span>
								<span v-else>SIN DOCUMENTACIÓN</span>
							</td>
							<td colspan="6">
								<a
									v-if="file_doc"
									href="#"
									@click.prevent="getDocument(file_doc?.id)"
								>
									<i class="fa fa-file-pdf-o" aria-hidden="true"></i>
									{{ file_doc?.name_document ?? "Documentación" }}
								</a>
								<span v-else>SIN DOCUMENTACIÓN</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div>
				<profile-show :columns="colsProfile" :profile="business?.administrable">
					<template #actions>
						<base-button
							v-if="$store.state.is_admin"
							size="sm"
							@click="(modal = true), (template = 'delegate')"
							>Cambiar</base-button
						>
					</template>
				</profile-show>
			</div>

			<modal
				v-if="this.modal"
				v-model:show="this.modal"
				:modalClasses="template == 'business' ? 'modal-xxl' : 'modal-md'"
				model="empresa"
				action="Editar"
				@close="template = 'business'"
			>
				<div v-if="template == 'delegate'" style="min-height: 200px;" >
					<async-select
						class="w-100"
						@selected="selected_delegate = $event?.id"
						:list="true"
						:option_disabled="business?.administrable?.user?.id"
					></async-select>
					<div class="d-flex justify-content-end mt-4 w-100">
						<base-button size="sm" @click="changeDelegate" :disabled="!selected_delegate">Cambiar</base-button>
					</div>
				</div>
				<show-business
					v-if="template == 'business'"
					@close="modal = false"
					@reload="getBusiness()"
					:business="business"
				></show-business>
			</modal>

			<installation-table
				:reload="reload"
				@reloaded="reload = false"
				v-if="business != null"
				:business_id="business?.id"
				:delegate_id="business?.administrable?.id"
			></installation-table>
		</div>
	</div>
</template>
<script>
	import service from "../../store/services/model-service";
	import utils from "@/mixins/utils-mixin";
	import InstallationTable from "../Installation/InstallationTable.vue";
	import ShowBusiness from "./ShowBusiness.vue";
	import ProfileShow from "../ProfileShow.vue";
	import AsyncSelect from "../core_components/AsyncSelect.vue";

	export default {
		components: { InstallationTable, ShowBusiness, ProfileShow, AsyncSelect },
		mixins: [utils],
		data() {
			return {
				meta: {},
				business: null,
				id: "",
				modal: false,
				template: "business",
				colsProfile: [
					{
						title: "Nombre",
						field: "user.full_name",
					},
					{
						title: "CIF/NIF",
						field: "cif_nif",
						op_field: "dni",
					},
					{
						title: "Móvil",
						field: "phone_number",
					},
					{
						title: "Email",
						field: "user.email",
					},
				],
				reload: false,
				selected_delegate: null
			};
		},
		async created() {
			this.id = this.$route.params.id;
			await this.getBusiness();
			this.$watch(
				() => this.$route.params,
				(toParams) => {
					this.id = toParams.id;
				}
			);
		},
		methods: {
			async getBusiness() {
				const id = this.id;
				const response = await service.show(
					"business",
					id,
					"includes[]=province.city&counts[]=installations&includes[]=documents.type&includes[]=bank" +
						"&includes[]=administrable.user"
				);
				this.business = response.data.data;
			},
			changeDelegate() {
				this.$swal({
					title: "¿Estas seguro de querer cambiar el delegado?",
					text: "Con esta accion se cambiaran todos los auditores dependientes de este delegado para las instalaciones, auditorias y demas de esta empresa.",
					icon: "warning",
					showCancelButton: true,
					confirmButtonText: "Confirmar",
					cancelButtonText: "Cancelar",
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							await service.api({url:'business/'+this.business.id+'/change-delegate',method: 'PUT',data:{
								delegate_id: this.selected_delegate
							}});
							this.$swal('Delegado actualizado', 'El delegado de esta empresa se ha actualizado', 'success')
							this.modal = false
							this.template = 'business'
							this.reload = true
							this.getBusiness()
						} catch (err) {
							this.$swal('No se pudo actualizar el delegado',null,'danger')
						}
					}
				});
			},
		},
		computed: {
			file_doc() {
				return this.$functions.filterDoc(
					this.business?.documents,
					"DOCUMENTACION"
				);
			},
		},
	};
</script>
<style>
	#table-data {
		overflow: hidden;
		overflow-x: auto;
	}
</style>
