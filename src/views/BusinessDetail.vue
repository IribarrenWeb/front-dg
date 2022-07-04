<template>
	<div>
		<div class="container-fluid mt--7">
            <div class="d-flex justify-content-lg-end mb-2">
                <base-button
                    @click="this.modal = true"
                    size="sm"
                    type="default"
                    :outline="false"
                    ><i class="fa-solid fa-pencil"></i
                > Editar</base-button>
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
							<td>{{ business?.business_nif ?? 'N/A' }}</td>
							<td>{{ business?.address?.city ?? 'N/A' }}</td>
							<td>{{ business?.address?.code ?? 'N/A' }}</td>
							<td>{{ business?.address?.country ?? 'N/A' }}</td>
							<td>{{ business?.installations_count }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="col">Nombre Responsable</th>
							<th scope="col">DNI</th>
							<th scope="col">Email</th>
							<th colspan="4" scope="col">Movil</th>
						</tr>
						<tr>
							<td>{{ business?.property_name ?? 'N/A' }} {{ business?.property_last_name }}</td>
							<td>{{ business?.property_dni ?? 'N/A' }}</td>
							<td>{{ business?.property_email ?? 'N/A' }}</td>
							<td colspan="4">{{ business?.property_phone ?? 'N/A' }}</td>
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
									{{file_doc?.name_document ?? 'Documentación'}}
								</a>
								<span v-else>SIN DOCUMENTACIÓN</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="mt-3 card">
				<div class="my-2 ml-md-4 ml-2">
					<h4>Delegación</h4>
				</div>
				<table
					class="table table-bordered table-responsive-md table-sm rounded"
				>
					<thead>
						<tr>
							<td>Nombre</td>
							<td>CIF/NIF</td>
							<td>Móvil</td>
							<td>Email</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>{{ business?.administrable?.user?.full_name ?? 'N/A' }}</th>
							<th>{{ business?.administrable?.cif_nif ? business?.administrable?.cif_nif : dni ?? null }}</th>
							<th>{{ business?.administrable?.phone_number ?? 'N/A' }}</th>
							<th>{{ business?.administrable?.user?.email ?? 'N/A' }}</th>
						</tr>
					</tbody>
				</table>
			</div>

            <modal
				v-if="this.modal"
				v-model:show="this.modal"
				modalClasses="modal-xl"
				model="empresa"
			>
				<show-business
					@close="this.modal = false"
					@reload="getBusiness()"
					:business="business"
				></show-business>
			</modal>

			<installation-table
				v-if="business != null"
				:business_id="business?.id"
				:delegate_id="business?.administrable?.id"
			></installation-table>
		</div>
	</div>
</template>
<script>
	import service from "../store/services/model-service";
	import utils from "@/mixins/utils-mixin";
	import InstallationTable from "./Tables/InstallationTable.vue";
    import ShowBusiness from '../components/forms/Business/ShowBusiness.vue';

	export default {
		components: { InstallationTable, ShowBusiness },
		mixins: [utils],
		data() {
			return {
				meta: {},
				business: null,
				id: "",
                modal: false
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
					"includes[]=province.city&counts[]=installations&includes[]=documents.type&includes[]=bank"+
					"&includes[]=administrable.user"
				);
				this.business = response.data.data;
			},
		},
        computed: {
            file_doc(){
                return this.$functions.filterDoc(this.business?.documents, 'DOCUMENTACION')
            }
        }
	};
</script>
<style>
	#table-data {
		overflow: hidden;
		overflow-x: auto;
	}
</style>
