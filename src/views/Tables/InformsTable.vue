<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Informes anuales</h4>
				</div>
				<div class="col text-right">
					<router-link v-if="dash" to="/informs" class="btn btn-sm btn-default"
						>Ver todas</router-link
					>
				</div>
			</div>
		</div>

		<div
			v-if="!dash"
			class="card-header border-0 py-3 bac-ligth row align-items-center mx-0"
		>
			<div class="col-md-10">
				<div class="row align-items-center">
					<year-filter
						label="Año"
						class="col-md-3"
						v-model:clear="clear"
						placeholder="Año"
						@updated="handleFilter('year', $event)"
					/>
					<delegate-filter
						class="col-md-3"
						v-model:clear="clear"
						@updated="handleFilter('delegate', $event)"
						v-if="$store.state.is_admin"
					></delegate-filter>
					<city-filter
						class="col-md-3"
						v-model:clear="clear"
						@updated="handleFilter('city', $event)"
					></city-filter>
					<select-filter
						class="col-md-3"
						v-model:clear="clear"
						:options="[
							{ label: 'Pendiente', value: 'pendiente' },
							{ label: 'Completado', value: 'completado' },
							{ label: 'POR REVISAR', value: 'POR REVISAR' },
						]"
						placeholder="Selecciona un estado..."
						@updated="handleFilter('status', $event)"
					/>
				</div>
			</div>
			<div class="col-md-2">
				<base-button
					size="sm"
					@click="(params_filter = params), index(page), (clear = true)"
					>Borrar filtros</base-button
				>
			</div>
		</div>
		<div class="table-responsive mb-4">
			<base-table thead-classes="thead-light" :data="tableData" >
				<template v-slot:columns>
					<th>Empresa</th>
					<th v-if="this.$store.state.is_admin">Delegación</th>
					<th>Ciudad</th>
					<th>Instalaciones (auditadas)</th>
					<th>Año</th>
					<th>Estado</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.business?.user?.full_name }}
					</th>
					<th scope="row" v-if="this.$store.state.is_admin">
						{{ row.item?.business?.administrable?.user?.full_name }}
					</th>
					<td>
						{{ row.item?.business?.address?.city }}
					</td>
					<td>
						{{ row.item?.audits_completed_count }}/{{ row.item?.audits_count }}
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
							<span class="status">{{ $functions.toCapitalize(row.item?.status) }}</span>
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
	import ReportShow from "../Shows/ReportShow.vue";
	import { mapGetters } from "vuex";
	import DelegateFilter from "../../components/filters/DelegateFilter.vue";
	import CityFilter from "../../components/filters/CityFilter.vue";
	import SelectFilter from "../../components/filters/SelectFilter.vue";
	import YearFilter from "../../components/filters/YearFilter.vue";

	export default {
		components: {
			ReportShow,
			DelegateFilter,
			CityFilter,
			SelectFilter,
			YearFilter,
		},
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
				params:
					"includes[]=business.user" +
					"&counts[]=nonconformities" +
					"&counts[]=installations" +
					"&counts[]=audits" +
					"&counts[]=audits_completed",
				params_filter: null,
				clear: false,
			};
		},
		computed: {
			hasRole() {
				return this.$store.state.role != 0;
			},
			...mapGetters(["ROLE"]),
		},
		methods: {
			async index(page = 1) {
				if (this.params_filter == null) {
					this.params_filter = this.params;
				}

				let params = this.params_filter;

				if (this.$store.state.is_admin) {
					params += "&includes[]=business.administrable.user.delegate";
				}

				if (this.dash) {
					params += "&status=PENDIENTE";
				}

				const resp = await service.getIndex("report", page, params);
				this.tableData = resp?.data?.data;
				this.metaData = resp?.data?.meta?.page;
				this.page = page;
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.index(event);
			},
			handleFilter(type, value) {
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=` + value;
					this.index(this.page);
				} else {
					this.params_filter = this.params;
					this.index(this.page);
				}
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
						const fileUrl = await this.$functions.formatDoc(b64);
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
