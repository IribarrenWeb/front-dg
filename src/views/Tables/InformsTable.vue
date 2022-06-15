<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Informes anuales</h4>
				</div>
				<div class="col text-right">
					<!-- <a href="#" class="btn btn-sm btn-default">Agregar</a> -->
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Empresa</th>
					<th v-if="this.$store.state.is_admin">Delegación</th>
					<th>Provincia</th>
					<th>Dirección</th>
					<th>Instalaciones</th>
					<th>Año</th>
					<th>Estado</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.business?.user.full_name }}
					</th>
					<th scope="row" v-if="this.$store.state.is_admin">
						{{ row.item?.business?.administrable?.user.full_name }}
					</th>
					<td>
						{{ row.item?.business?.province?.name }}
					</td>
					<td>
						{{ row.item?.business?.address }}
					</td>
					<td>
						{{ row.item?.installations_count }}
					</td>
					<th>
						{{ row.item?.period }}
					</th>
					<td>
						<badge
							class="badge-dot mr-4"
							:type="setStatusType(row.item?.status)"
						>
							<i :class="`bg-${setStatusType(row.item?.status)}`"></i>
							<span class="status">{{ row.item?.status }}</span>
						</badge>
					</td>
					<td>
						<a
							href="#"
							class="btn btn-sm btn-default"
							v-if="row.item?.status == 'COMPLETADO'"
							@click.prevent="generate(row.item)"
							><i class="fa-solid fa-file-pdf"></i> INFORME{{
								row.item?.period
							}}</a
						>
						<a
							href="#"
							class="btn btn-sm btn-default"
							v-if="
								row.item?.status == 'PENDIENTE' ||
								(ROLE != 'business' && row.item?.status != 'COMPLETADO')
							"
							@click="handleView(row.item)"
							><i class="fa-regular fa-eye"></i
						></a>
					</td>
				</template>
			</base-table>
			<base-pagination
				v-if="!dash"
				:perPage="this.metaData.perPage"
				:value="this.page"
				@changePage="handleChange($event)"
				:total="this.metaData.total"
				align="center"
			>
			</base-pagination>

			<modal
				v-if="this.modal"
				v-model:show="this.modal"
				action="generar"
				modalClasses="modal-xl"
				model="informe anual"
			>
				<report-show
					@reload="index(page)"
					@close="modal = false"
					:report_id="report_id"
				></report-show>
			</modal>
		</div>
	</div>
</template>
<script>
	import service from "../../store/services/model-service";
	import { isEmpty } from "lodash";
	import ReportShow from "../Shows/ReportShow.vue";
	import { mapGetters } from "vuex";

	export default {
		components: { ReportShow },
		name: "informs-table",
		props: {
			dash: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				page: 1,
				modal: false,
				report_id: null,
			};
		},
		computed: {
			hasRole() {
				return this.$store.state.role != 0;
			},
			...mapGetters(["ROLE", "FORMAT_DOC_B64"]),
		},
		methods: {
			async index(page = 1) {
				let params =
					"includes[]=business.province.city" +
					"&includes[]=business.user" +
					"&counts[]=nonconformities" +
					"&counts[]=installations" +
					"&counts[]=audits" +
					"&counts[]=audits_completed";

				if (this.$store.state.is_admin) {
					params += "&includes[]=business.administrable.user";
				}

				if (this.dash) {
					params += "&status=PENDIENTE";
				}

				const resp = await service.getIndex("report", page, params);
				if (!isEmpty(resp.data.data)) {
					this.tableData = resp.data.data;
					this.metaData = resp.data.meta.page;
					this.page = page;
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.index(event);
			},
			handleView(item) {
				let audits_completed = item.audits_count == item.audits_completed_count;
				// let hasPendingCon = item.nonconformities_count == 0;
				if (!audits_completed) {
					this.$swal(
						"No puedes realizar el informe",
						"Aun no puedes realizar el informe ya que los datos estan incompletos o estan pendientes.",
						"warning"
					);
					return;
				} else {
					this.modal = true;
					this.report_id = item.id;
				}
			},
			setStatusType(status) {
				let type = "";
				switch (status) {
					case "PENDIENTE":
						type = "danger";
						break;
					case "POR REVISAR":
						type = "warning";
						break;
					case "COMPLETADO":
						type = "success";
						break;

					default:
						break;
				}
				return type;
			},
			async generate(report) {
				if (report.status == "COMPLETADO") {
					try {
						const rep = await service.getReport(report.id);
						const b64 = rep.data.data;
						const fileUrl = await this.FORMAT_DOC_B64(b64);
						window.open(fileUrl);
					} catch (err) {
						console.log(err);
						this.$toast.error(
							typeof err.response.data != undefined
								? err.data.message
								: "Ocurrio un error al generar el informe"
						);
					}
				}
			},
		},
		watch: {
			hasRole: {
				handler(val) {
					if (val) {
						this.index();
					}
				},
				immediate: true,
			},
		},
	};
</script>
<style></style>
