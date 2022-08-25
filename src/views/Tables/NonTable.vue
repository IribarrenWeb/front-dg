<template>
	<div class="card shadow" :class="classes">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">No conformidades</h4>
				</div>
				<div class="col text-right">
					<router-link
						v-if="dash"
						to="/audits/nonconformities"
						class="btn btn-sm btn-default"
						>Ver todas</router-link
					>
				</div>
			</div>
		</div>

		<div
			v-if="!dash"
			class="card-header border-0 py-3 bac-ligth row mx-0 align-items-center"
		>
			<div class="col-md-10">
				<div class="row align-items-center">
					<date-filter
						class="col-md-4 col-lg-3"
						v-model:clear="clear"
						@updated="handleFilter('acting_date', $event)"
					/>
					<installation-filter
						class="col-md-4 col-lg-3"
						v-model:clear="clear"
						@updated="handleFilter('installation', $event)"
					/>
					<select-filter
						class="col-md-4 col-lg-3"
						v-model:clear="clear"
						:options="nonTypes"
						@updated="handleFilter('type', $event)"
					/>

					<select-filter
						class="col-md-4 col-lg-3"
						v-model:clear="clear"
						:options="priorities"
						@updated="handleFilter('priority', $event)"
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
		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Instalación</th>
					<th>Tipo</th>
					<th v-if="!$store.state.is_business">Empresa</th>
					<th v-else>Descripción</th>
					<th v-if="!dash">Fecha actuación</th>
					<th>Prioridad</th>
					<th>Plazo</th>
					<th>Estado</th>
					<th v-if="!dash"></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.installation.name }}
					</th>
					<th scope="row">
						{{ row.item?.type.name }}
					</th>
					<td v-if="!$store.state.is_business">
						{{ row.item?.installation?.company?.user?.full_name }}
					</td>
					<td v-else>
						{{ row.item?.description }}
					</td>
					<td v-if="!dash">
						{{
							row.item?.action ? row.item?.action?.date_end : "SIN ACTUACIÓN"
						}}
					</td>
					<td :class="`text-${row.item?.priority?.colour}`">
						{{ row.item?.priority?.name }}
					</td>
					<td>{{ row.item?.priority?.term }}MESES</td>
					<td>
						<badge
							class="badge-dot mr-4"
							:type="$functions.status(row.item?.status)"
						>
							<i :class="`bg-${$functions.status(row.item?.status)}`"></i>
							<span class="status">{{ $functions.toCapitalize(row.item?.status) }}</span>
						</badge>
					</td>
					<td v-if="!dash">
						<a
							href="#"
							@click="(modal = true), (selected_non = row.item)"
							class="btn btn-sm btn-default"
							><i class="fa-regular fa-circle-check"></i
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
		</div>
		<modal
			v-if="this.modal"
			v-model:show="this.modal"
			modalClasses="modal-xl"
			model="actuación de no conformidad"
		>
			<form-action
				:role="ROLE"
				@close="modal = false"
				:nonconformity="selected_non"
				:show="ROLE != 'business' || selected_non.status == 'COMPLETADO'"
				@reload="index(page)"
			></form-action>
		</modal>
	</div>
</template>
<script>
	import service from "../../store/services/model-service";
	import FormAction from "../../components/forms/FormAction.vue";
	import { mapGetters } from "vuex";
	import InstallationFilter from "../../components/filters/InstallationFilter.vue";
	import DateFilter from "../../components/filters/DateFilter.vue";
	import SelectFilter from "../../components/filters/SelectFilter.vue";

	export default {
		components: { FormAction, InstallationFilter, DateFilter, SelectFilter },
		name: "non-table",
		props: {
			dash: {
				type: Boolean,
				default: false,
			},
			classes: {
				type: String,
			},
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				page: 1,
				modal: false,
				selected_non: null,
				params: "includes[]=installation&includes[]=audit",
				params_filter: null,
				clear: false,
				nonTypes: [],
				priorities: [],
			};
		},
		mounted() {
			this.index();
			this.getTypes();
			this.getPiorities();
		},
		methods: {
			async index(page = 1) {
				if (this.params_filter == null) {
					this.params_filter = this.params;
				}

				let params = this.params_filter;

				if (this.ROLE != "business" && !this.dash) {
					params += "&includes[]=action.responsible&includes[]=installation.company.user";
				}

				if (this.dash) {
					params += "&status_dash=true";
				}

				const resp = await service.getIndex("non", page, params);
				this.tableData = resp?.data?.data;
				this.metaData = resp?.data?.meta?.page;
				this.page = this?.metaData?.currentPage;
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.index(event);
			},
			async getTypes() {
				const res = await service.api("non-types", "get", null, null);

				this.nonTypes = res?.data?.data.map((d) => {
					return {
						label: d.name,
						value: d.id,
					};
				});
			},
			async getPiorities() {
				const res = await service.api("priorities", "get", null, null);

				this.priorities = res?.data?.data.map((d) => {
					return {
						label: d.name,
						value: d.id,
					};
				});
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
		},
		computed: {
			...mapGetters(["ROLE"]),
		},
	};
</script>
<style></style>
