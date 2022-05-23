<template>
	<div>
		<base-header type="gradient-default" class="py-5"> </base-header>

		<div class="container-fluid mt-4">
            <div class="d-flex justify-content-lg-end mb-2">
                <base-button
                    @click="this.modal = true"
                    size="sm"
                    type="default"
                    :outline="false"
                    ><i class="fa-solid fa-pencil"></i
                > Editar</base-button>
            </div>
			<div class="card overflow-auto" v-if="business != null">
				<table class="table table-sm table-bordered">
					<thead>
						<tr class="text-uppercase">
							<th scope="row">Nombre empresa</th>
							<th scope="col">CIF/NIF</th>
							<th scope="row">Ciudad</th>
							<th scope="row">Provincia</th>
							<th scope="row">Codigo postal</th>
							<th scope="row">Pais</th>
							<th scope="row">Instalaciones</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ business.business_name }}</td>
							<td>{{ business.business_nif }}</td>
							<td>{{ business.province.city.name }}</td>
							<td>{{ business.province.name }}</td>
							<td>{{ business.postal_code }}</td>
							<td>ESPANA</td>
							<td>{{ business.installations_count }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="col">Nombre Responsable</th>
							<th scope="col">DNI</th>
							<th scope="col">Email</th>
							<th colspan="4" scope="col">Movil</th>
						</tr>
						<tr>
							<td>{{ business.user.name }}</td>
							<td>{{ business.property_dni }}</td>
							<td>{{ business.user.email }}</td>
							<td colspan="4">{{ business.property_phone }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="row">Fecha de ALTA</th>
							<th colspan="6" scope="row">Documentacion</th>
						</tr>
						<tr>
							<td>
								<span v-if="file_doc">
									{{ formatDate(file_doc.document_date, "en-GB") }}
								</span>
								<span v-else>SIN DOCUMENTACIÓN</span>
							</td>
							<td colspan="6">
								<a
									v-if="file_doc"
									href="#"
									@click.prevent="getDocument(file_doc.id)"
								>
									<i class="fa fa-file-pdf-o" aria-hidden="true"></i>
									Documentación
								</a>
								<span v-else>SIN DOCUMENTACIÓN</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card" v-else>
				<h3>No hay resultados</h3>
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
				:business_id="business.id"
			></installation-table>
		</div>
	</div>
</template>
<script>
	import service from "../store/services/model-service";
	import utils from "@/mixins/utils-mixin";
	import InstallationTable from "./Tables/InstallationTable.vue";
    import ShowBusiness from '../components/forms/Business/ShowBusiness.vue';
    import { mapGetters } from 'vuex';

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
					"includes[]=province.city&counts[]=installations&includes[]=documents.type&includes[]=bank"
				);
				this.business = response.data.data;
			},
		},
        computed: {
            ...mapGetters(['FILTER_DOC']),
            file_doc(){
                return this.FILTER_DOC(this.business.documents, 'DOCUMENTACION')
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
