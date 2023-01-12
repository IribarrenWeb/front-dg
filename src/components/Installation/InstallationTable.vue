<template>
	<div :class="`card shadow mt-3 ${classes}`">
		<div class="card-header border-0" v-if="!byAuditableId">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Instalaciones</h4>
				</div>
				<div class="col text-right">
					<a href="#" @click.prevent="handleAdd()" class="btn btn-sm btn-default">Agregar</a>
				</div>
			</div>
		</div>
		<div></div>
		<div class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row filter-container">
			<div class="col-md-3 filter" v-if="!byAuditableId && !$store.state.is_auditor">
				<async-select placeholder="Selecciona auditor..." v-model:clear="clear"
					@updated="handleFilter('auditor', $event)" :roles="[2, 3]"
					params="&includes[]=delegate&includes[]=auditor"></async-select>
			</div>
			<city-filter class="col-md-3" v-model:clear="clear" @updated="handleFilter('city', $event)"></city-filter>
			<div class="col-md-3">
				<base-button size="sm" @click="params_filter = params, getInstallations(), clear = true">Borrar
					filtros</base-button>
			</div>
		</div>
		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>#</th>
					<th>Nombre</th>
					<th>Ciudad</th>
					<th>Empleados</th>
					<th v-if="!byAuditableId">Auditor</th>
					<th v-if="!byAuditableId">Acciones</th>
				</template>

				<template v-slot:default="row">
					<th>{{ row.idx + 1 }}</th>
					<th scope="row" class="text-capitalize">
						{{ row.item?.name ?? 'N/A' }}
					</th>
					<td class="text-uppercase">
						{{ row.item?.address?.city ?? 'N/A' }}
					</td>
					<td>
						{{ row.item?.employees.length }}
					</td>
					<td class="text-uppercase" v-if="!byAuditableId">
						<a v-if="row.item?.auditable != null" href="#" @click="showAuditor()">{{
							row.item?.auditable.user.full_name
						}}</a>
						<span v-else>SIN AUDITOR</span>
					</td>
					<td v-if="!byAuditableId">
						<router-link v-if="client" class="btn btn-sm btn-default"
							:to="`/installations/${row.item?.id}`">
							<i class="fa-regular fa-eye"></i>
						</router-link>
						<a v-else href="#" @click.prevent="view(row.item?.id)" class="btn btn-sm btn-default"><i
								class="fa-regular fa-eye"></i></a>
						<a v-if="$store.state.is_business && !$store.state?.profile?.me?.profile?.consultancy_id" href="#" @click.prevent="assign = true,selectedInstallation = row.item" class="btn btn-sm btn-outline-default"><i
								class="fa-solid fa-user-tie"></i>
							<q-tooltip>
								Asignar auditor
							</q-tooltip>
						</a>
						<a href="#" @click.prevent="destroy(row.item?.id)" class="btn btn-sm btn-outline-default"><i
								class="fa-regular fa-trash-can"></i></a>
					</td>
				</template>
			</base-table>
			<div>
				<base-pagination :perPage="this.metaData.perPage" :value="this.page" @changePage="handleChange($event)"
					:total="this.metaData.total" align="center"></base-pagination>
			</div>

			<q-dialog v-if="modal" v-model="modal" full-width>
				<q-card class="full-width q-pa-lg">
					<q-card-section class="">
						<form-installation class="pb-5" v-if="!isView" @close="modal = false"
							@reload="getInstallations()" :business_id="business_id"
							:delegate_id="delegate_id"></form-installation>
						<installation-show v-else :installation_id="installation_id" @reload="getInstallations()"
							@close="(modal = false), (isView = false)"></installation-show>
					</q-card-section>
				</q-card>
			</q-dialog>
			<!-- <modal
				v-if="this.modal"
				v-model:show="this.modal"
				:action="action"
				@close="action = 'registrar',isView = false"
				modalClasses="modal-xxl"
				model="instalación"
			>
				<form-installation
					v-if="!isView"
					@close="modal = false"
					@reload="getInstallations()"
					:business_id="business_id"
					:delegate_id="delegate_id"
				></form-installation>
				<installation-show
					v-else
					:installation_id="installation_id"
					@reload="getInstallations()"
					@close="(modal = false), (isView = false)"
				></installation-show>
			</modal> -->
			<q-dialog v-model="assign" persistent>
				<q-card class="flex column" style="min-width: 500px;height: 300px;">
					<q-card-section>
						<q-input readonly dense :model-value="selectedInstallation?.auditable?.user?.full_name ?? 'Sin auditor'" outlined type="text" label="Auditor actual" />
						<AsyncSelect :list="true" :roles="[3]" @selected="new_auditable = $event">
						</AsyncSelect>
					</q-card-section>
					<q-card-actions align="right" style="margin-top: auto;">
						<q-btn :loading="loadingAuditor" flat label="Cancelar" color="primary" v-close-popup />
						<q-btn :loading="loadingAuditor" flat label="Asignar" color="primary" @click="assignAuditor" />
					</q-card-actions>
				</q-card>
			</q-dialog>
		</div>
	</div>
</template>
<script>
import FormInstallation from "../../components/Installation/FormInstallation.vue";
import service from "../../store/services/model-service";
import InstallationShow from "../../components/Installation/InstallationShow.vue";
import { isNull } from "lodash";
import CityFilter from "../../components/filters/CityFilter.vue";
import AsyncSelect from "../../components/core_components/AsyncSelect.vue";
import { Notify } from 'quasar';

export default {
	components: { FormInstallation, InstallationShow, CityFilter, AsyncSelect },
	name: "installation-table",
	props: {
		business_id: {
			required: false,
			default: null,
		},
		delegate_id: {
			required: false,
			default: null,
		},
		classes: {
			type: String,
		},
		client: {
			type: Boolean,
			default: false
		},
		byAuditableId: {
			type: Number,
			default: null
		},
		byAuditableType: {
			type: String,
			default: 'delegate_id'
		},
		reload: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			tableData: {},
			assign: false,
			modal: false,
			delegate: {},
			metaData: {},
			selectedInstallation: null,
			page: 1,
			clear: false,
			new_auditable: null,
			isView: false,
			action: "Registrar",
			installation_id: {},
			params: 'includes[]=auditable.user&includes[]=employees&includes[]=province&order_by=id&order_direction=asc',
			params_filter: null,
			loadingAuditor: false
		};
	},
	mounted() {
		this.params_filter = this.params
		this.getInstallations();
	},
	methods: {
		handleAdd() {
			this.modal = true;
		},
		async assignAuditor() {
			try {
				if (!this.new_auditable?.id) {
					Notify.create({
						message: 'Debe seleccionar un auditor',
						color: 'negative'
					})
					return
				}
				this.loadingAuditor = true
				await service.api({url:`installations/${this.selectedInstallation.id}`, method: 'PUT', data: {
					auditable_id: this.new_auditable?.id
				}})
				this.loadingAuditor = false
				this.new_auditable = null
				this.assign = false
				Notify.create({
					message: 'Auditor asignado correctamente',
					color: 'positive'
				})
				this.getInstallations()
				return
			} catch (error) {
				this.loadingAuditor = false
				Notify.create({
					message: 'Ocurrio un error al actualizar el auditor',
					color: 'negative'
				})
			}
		},
		async getInstallations(page = 1) {
			let response = null;
			if (this.byAuditableId) {
				this.params_filter += "&" + this.byAuditableType + "=" + this.byAuditableId
			}
			if (isNull(this.business_id)) {
				response = await service.getIndex("installation", page, this.params_filter);
			} else {
				response = await service.getIndex("installation", page, this.params_filter + '&business_id=' + this.business_id);
			}

			this.tableData = response.data.data;
			this.metaData = response.data.meta.page;
			this.page = page;
		},
		handleFilter(type, value) {
			if (!this.$empty(value) || value >= 1) {
				if (type == 'auditor') {
					type = !this.$empty(value.auditor) ? 'auditor' : 'delegate';
					value = value[type].id
				}
				this.params_filter += `&${type}_id=` + value
				this.getInstallations(this.page)
			} else {
				this.params_filter = this.params
				this.getInstallations(this.page)
			}
		},
		async destroy(id) {
			try {
				await service.destroy("installation", id);
				this.getInstallations();
			} catch (error) {
				console.log(error);
			}
		},
		async handleChange(event) {
			if (event == this.page) {
				return;
			}

			await service.getInstallations(event);
		},
		async view(id) {
			try {
				this.isView = true;
				this.modal = true;
				this.action = "editar";
				this.installation_id = id;
			} catch (err) {
				console.log(err);
			}
		},
	},
	watch: {
		reload(value) {
			if (value) {
				this.getInstallations();
				this.$emit('reloaded')
			}
		}
	}
};
</script>
<style>
.max-h-modal {
	max-height: 850px;
}
</style>
