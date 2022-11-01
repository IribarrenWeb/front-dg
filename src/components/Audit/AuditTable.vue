<template>
	<div class="card shadow" :class="classes">
		<div class="card-header border-0" :class="classes">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						{{ title }}
					</h3>
				</div>
				<div class="col justify-content-end d-flex">
					<base-button v-if="!$store.state.is_business" @click="toInit = true" type="default" size="sm">
						Iniciar auditoria</base-button>
				</div>
			</div>
		</div>

		<div class="
				card-header
				border-0
				pl-2
				py-3
				bac-ligth
				mx-0
				row
				align-items-end
				filter-container
			">
			<div class="col-md-10">
				<div class="row align-items-end ">
					<date-filter class="col-md-3" v-model:clear="clear"
						@updated="handleFilter('scheduled_date', $event)" />
					<delegate-filter class="col-md-3" v-model:clear="clear" @updated="handleFilter('delegate', $event)"
						v-if="$store.state.is_admin"></delegate-filter>
					<business-filter class="col-md-3" v-model:clear="clear" @updated="handleFilter('business', $event)"
						v-if="$store.state.is_auditor || $store.state.is_delegate"></business-filter>
					<installation-filter class="col-md-3" v-model:clear="clear"
						@updated="handleFilter('installation', $event)" v-if="$store.state.is_business">
					</installation-filter>
					<city-filter class="col-md-3" v-model:clear="clear" @updated="handleFilter('city', $event)">
					</city-filter>
					<select-filter class="col-md-3" v-model:clear="clear" :options="[
						{ label: 'Pendiente', value: 'pendiente' },
						{ label: 'Completado', value: 'completado' },
						{ label: 'En progreso', value: 'en progreso' },
					]" placeholder="Selecciona un estado..." @updated="handleFilter('status', $event)" />
				</div>
			</div>

			<div class="col-md-2">
				<base-button size="sm" @click="(params_filter = params), getAudits(), (clear = true)">Borrar filtros
				</base-button>
			</div>
		</div>
		<div class="table-responsive">
			<base-table class="table align-items-center table-flush" :class="type === 'dark' ? 'table-dark' : ''"
				:thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'" tbody-classes="list" :data="tableData">
				<template v-slot:columns>
					<th>Empresa</th>
					<th>Instalacion</th>
					<th>Nombre</th>
					<th>Ciudad</th>
					<th>Ultima auditoria</th>
					<th>Estado</th>
					<th>Hora y fecha</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						<span class="name mb-0 text-sm">{{
								row.item?.installation.company.user.full_name
						}}</span>
					</th>
					<td>
						{{ row.item?.installation.name }}
					</td>
					<td class="budget">
						{{ row.item?.name }}
					</td>
					<td>
						{{ row.item?.installation?.address?.city }}
					</td>
					<td>Sin datos</td>
					<td>
						<badge class="badge-dot mr-4" :type="setStatusType(row.item?.status)">
							<i :class="`bg-${setStatusType(row.item?.status)}`"></i>
							<span class="status">{{ $functions.toCapitalize(row.item?.status_name) }}</span>
						</badge>
					</td>
					<td>
						{{ row.item?.scheduled_date }}
					</td>
					<td v-if="ROLE == 'business' && row.item?.status == 'COMPLETADO'">
						<a class="btn btn-sm btn-primary" :href="url + '/audits/report/' + row.item?.id"
							target="_blank">Imprimir</a>
					</td>
					<td class="text-right" v-if="ROLE != 'business'">
						<q-btn-dropdown class="custom-drop" flat rounded icon="fa-solid fa-ellipsis-vertical"
							color="grey-7">
							<q-list bordered>
								<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
									@click="toSchedule(row.item?.id)">
									<q-item-section>
										<q-item-label>{{
												row.item?.scheduled_date != null ? "Re-agendar" : "Agendar"
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
									@click="handleInit(row.item)" v-if="
										row.item?.status != 'COMPLETADO' &&
										row.item?.scheduled_date != null
									">
									<q-item-section>
										<q-item-label>{{ row.item?.status == "PENDIENTE" ? "Iniciar" : "Completar" }}
										</q-item-label>
									</q-item-section>
								</q-item>
								<q-item style="min-width: 200px;text-align: center;" to="/audits/nonconformities"
									clickable v-close-popup v-if="row.item?.status == 'COMPLETADO'">
									<q-item-section>
										<q-item-label>No conformidades</q-item-label>
									</q-item-section>
								</q-item>
								<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
									@click.prevent="handleDelegate(row.item)" v-if="
										row.item?.status != 'COMPLETADO' && !$store.state.is_auditor
									" :disabled="row.item?.status != 'PENDIENTE'">
									<q-item-section>
										<q-item-label>Delegar</q-item-label>
									</q-item-section>
								</q-item>
								<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
									v-if="row.item?.status == 'COMPLETADO'"
									:href="url + '/audits/report/' + row.item?.id" target="_blank">
									<q-item-section>
										<q-item-label>Imprimir</q-item-label>
									</q-item-section>
								</q-item>
								<q-item @click="handleDocs(row.item.id)" style="min-width: 200px;text-align: center;" clickable
									v-close-popup v-if="row.item?.status == 'COMPLETADO'">
									<q-item-section>
										<q-item-label>Documentos</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</q-btn-dropdown>
					</td>
				</template>
			</base-table>

			<q-dialog v-model="showDocs">
				<q-card style="min-width: 500px;">
					<q-card-section>
						<div class="text-h6">Documentos</div>
					</q-card-section>

					<q-separator />

					<q-card-section style="max-height: 50vh" class="scroll">
						<docs-loader v-if="loadingDocs" />
						<div v-else>
							<div v-if="docs?.length < 1 || !docs">No se adjuntaron documentos a esta auditoria</div>
							<div v-for="file, idx in docs" :key="idx">
								<q-item clickable style="width: 100%;">
									<q-item-section top avatar>
										<q-img
											src="/icons/pdf.png"
											spinner-color="primary"
											spinner-size="82px"
										/>
										<!-- <q-icon size="2rem" color="primary" name="fa-regular fa-file-pdf" /> -->
									</q-item-section>
									<q-item-section @click="open(file?.public_url)">
										<q-item-label>{{ file.file_name }}</q-item-label>
										<q-item-label caption lines="2" v-if="file?.size">{{ file.size /
												1000
										}}
											KB</q-item-label>
									</q-item-section>
								</q-item>
							</div>
						</div>
					</q-card-section>

					<q-separator />

					<q-card-actions align="right">
						<q-btn flat label="Cerrar" color="primary" v-close-popup />
					</q-card-actions>
				</q-card>
			</q-dialog>
			<!-- <loader v-if="loader"></loader> -->

			<base-pagination :perPage="this.metaData.perPage" :value="this.page" @changePage="handleChange($event)"
				:total="this.metaData.total" align="center">
			</base-pagination>

			<modal v-model:show="toDelegate" model="auditoria" action="delegar" v-if="toDelegate">
				<div class="mb-4 pb-md-2">
					<base-field label="Auditor actual">
						<input disabled :value="audit?.auditable?.user?.full_name" class="form-control" />
					</base-field>
					<AsyncSelect :list="true" :roles="[2, 3]" @selected="new_auditable = $event" :params="params_async">
					</AsyncSelect>
					<div class="mt-2 row">
						<div class="col">
							<base-button size="sm" :block="true" @click="submitDelegate">Aceptar</base-button>
						</div>
						<div class="col">
							<base-button :outiline="true" size="sm" :block="true" @click="toDelegate = false">Cancelar
							</base-button>
						</div>
					</div>
				</div>
			</modal>
			<modal modalClasses="modal-xxl" v-model:show="toInit" model="auditoria" action="iniciar" v-if="toInit">
				<init-table @cancel="toInit = false" :data="toInitAudit" />
			</modal>
		</div>
	</div>
</template>
<script>
// import { axios } from '@/axios';

import { mapGetters } from "vuex";
import service from "../../store/services/model-service";
import AsyncSelect from "../core_components/AsyncSelect.vue";
import CityFilter from "../filters/CityFilter.vue";
import DelegateFilter from "../filters/DelegateFilter";
import BusinessFilter from "../filters/BusinessFilter.vue";
import InstallationFilter from "../filters/InstallationFilter.vue";
import SelectFilter from "../filters/SelectFilter.vue";
import DateFilter from "../filters/DateFilter.vue";
import InitTable from './InitTable.vue';
import { baseUrl, apiUrl } from '../../axios/index';
import DocsLoader from '../../loaders/DocsLoader.vue'
import { Notify } from 'quasar';

export default {
	name: "audits-table",
	props: {
		type: {
			type: String,
		},
		title: String,
		classes: {
			type: String,
		},
	},
	data() {
		return {
			tableData: [],
			metaData: {},
			baseImage: baseUrl + "img/dg_logo.png",
			loader: false,
			page: 1,
			clear: false,
			url: apiUrl,
			toDelegate: false,
			new_auditable: null,
			audit: null,
			params:
				"includes[]=auditable.user" +
				"&includes[]=installation.company.user" +
				"&order_by=scheduled_date" +
				"&order_direction=asc",
			params_filter: null,
			toInit: false,
			showDocs: false,
			docs: [],
			loadingDocs: false
		};
	},
	mounted() {
		this.params_filter = this.params;
		this.getAudits(this.page);
	},
	computed: {
		...mapGetters(["CURRENT_DATE", "ROLE"]),
		params_async() {
			let params = null;
			if (this.audit) {
				params =
					"&delegate_id=" + this.audit.installation.company?.administrable_id;
			}
			return params;
		},
		toInitAudit() {
			return this.tableData.filter((d) => d.can_init && d.status == 'PENDIENTE');
		},
	},
	methods: {
		async getAudits(page = 1) {
			const resp = await service.getIndex("audit", page, this.params_filter);
			if (typeof resp.data.data != "undefined") {
				this.tableData = resp.data.data;
				this.metaData = resp.data.meta.page;
				this.page = this.metaData.currentPage;
			}
		},
		open(url) {
			window.open(url, '_blank').focus();
		},
		async handleDocs(id) {
			try {
				this.showDocs = true
				this.loadingDocs = true
				const res = await service.apiNoLoading({ url: 'audit-images?type=GENERAL_FILES&audit_id=' + id })
				this.docs = res.data.data ?? []
				this.loadingDocs = false
			} catch (err) {
				this.loadingDocs = false
				Notify.create({
					message: 'Ocurrio un error al cargar las imagenes',
					color: 'negative'
				})
			}
		},
		handleFilter(type, value) {
			if (!this.$empty(value) || value >= 1) {
				this.params_filter += `&${type}_id=` + value;
				this.getAudits(this.page);
			} else {
				this.params_filter = this.params;
				this.getAudits(this.page);
			}
		},
		handleInit(item) {
			const link = `/audit-init/${item.id}`;
			if (item.can_init == null) {
				let msg =
					"Esta auditoria no se puede iniciar ya que no esta programada";
				if (item.can_init == false) {
					msg =
						"Esta auditoria esta programada para la fecha: <b>" +
						item.scheduled_date +
						"</b>";
				}
				this.$swal("Auditoria no programada", msg, "warning");
			} else if (item.auditable == null) {
				this.$swal(
					"Instalación sin auditor",
					`La instalación <b>${item.installation.name}</b> no cuenta con un auditor.`,
					"warning"
				);
			} else {
				this.$router.push(link);
			}
		},
		setStatusType(status) {
			let type = "";
			switch (status) {
				case "PENDIENTE":
					type = "danger";
					break;
				case "INCOMPLETO":
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
		async handleChange(event) {
			if (event == this.page) {
				return;
			}
			this.getAudits(event);
		},
		handleDelegate(audit) {
			this.audit = audit;
			this.toDelegate = true;
		},
		cancel() {
			alert('canelll')
		},
		async toSchedule(id) {
			await this.$store.dispatch("toSchedule", {
				model: "audits",
				id: id,
				name: "auditoria",
			});
			console.log("asdasdasd");
			this.getAudits();
		},
		async submitDelegate() {
			if (this.new_auditable) {
				try {
					await service.update("audit", this.audit.id, {
						auditable_id: this.new_auditable.id,
					});
					this.getAudits();
					this.toDelegate = false;
					this.$toast.success("Auditoria delegada con exito");
				} catch (err) {
					console.log(err);
				}
			} else {
				this.$toast.warning("Tienen que seleccionar un auditor.");
			}
		},
	},
	components: {
		AsyncSelect,
		CityFilter,
		DelegateFilter,
		BusinessFilter,
		InstallationFilter,
		SelectFilter,
		DateFilter,
		InitTable,
		DocsLoader
	},
};
</script>
<style lang="scss">
.custom-drop .q-btn-dropdown__arrow {
	display: none;
}
</style>
