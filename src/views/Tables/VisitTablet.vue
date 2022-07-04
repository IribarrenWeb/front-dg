<template>
	<div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
		<div
			class="card-header border-0"
			:class="type === 'dark' ? 'bg-transparent' : ''"
		>
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						{{ title }}
					</h3>
				</div>
				<div class="col text-right">
					<router-link
						v-if="dash"
						to="/visits"
						class="btn btn-sm btn-default"
						>Ver todas</router-link
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<div class="card-header border-0 pl-2 py-3 bac-ligth d-flex">
				<installation-filter
					v-model:clear="clear"
					@updated="handleFilter('installation', $event)"
				></installation-filter>
				<div class="ml-2">
					<base-button
						size="sm"
						@click="(params_filter = params), getVisits(), (clear = true)"
						>Borrar filtros</base-button
					>
				</div>
			</div>
			<base-table
				class="table align-items-center table-flush"
				:class="type === 'dark' ? 'table-dark' : ''"
				:thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
				tbody-classes="list"
				:data="tableData"
			>
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Instalacion</th>
					<th>Responsable</th>
					<th>Tipo</th>
					<th>Fecha</th>
					<th>Hora</th>
                    <th>Estado</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<td class="budget">
						{{ row.item?.name }}
					</td>
					<th scope="row">
						<div class="media align-items-center">
							<div class="media-body">
								<span class="name mb-0 text-sm">{{
									row.item?.visitable.installation.name
								}}</span>
							</div>
						</div>
					</th>
                    <td class="budget">
						{{ row.item?.visitable.installation.auditable != null ? row.item?.visitable.installation.auditable.user.full_name : 'SIN RESPONSABLE'}}
					</td>
					<td class="text-uppercase">
						{{ row.item?.type }}
					</td>
					<td>
						{{ this.$functions.formatDate(row.item?.date_scheduled) }}
					</td>
                    <td>
						{{ row.item?.time }}
					</td>
                    <td>
						<badge
							class="badge-dot mr-4"
							:type="setStatusType(row.item?.status)"
						>
							<i :class="`bg-${setStatusType(row.item?.status)}`"></i>
							<span class="status">{{ row.item?.status == 0 ? 'PENDIENTE' : 'COMPLETADO' }}</span>
						</badge>
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
	</div>
</template>
<script>
    import { mapGetters} from 'vuex';
import InstallationFilter from '../../components/filters/InstallationFilter.vue';
	import service from "../../store/services/model-service";
	export default {
	components: { InstallationFilter },
		name: "audits-table",
		props: {
			type: {
				type: String,
			},
			title: String,
			dash: {
				default: false
			}
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				loader: false,
				page: 1,
                url: this.$store.state.api_url,
				clear: false,
				params: "includes[]=visitable.installation.auditable.user"+
					"&status=false",
				params_filter: null
			};
		},
		mounted() {
			this.getVisits(this.page);
		},
        computed: {
            ...mapGetters(['CURRENT_DATE'])
        },
		methods: {
			async getVisits(page = 1) {
				
				if (this.params_filter == null) {
					this.params_filter = this.params
				}

				const resp = await service.getIndex(
					"visit",
					page,
					this.params_filter
				);
				this.tableData = resp?.data?.data;
				this.metaData = resp?.data?.meta?.page;
				this.page = this.metaData?.currentPage;
			},
			handleFilter(type, value) {
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=` + value;
					this.getVisits(this.page);
				} else {
					this.params_filter = this.params;
					this.getVisits(this.page);
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.getVisits(event);
			},
            setStatusType(status) {
				let type = "";
				switch (status) {
					case 0:
						type = "danger";
						break;
					case 1:
						type = "success";
						break;

					default:
						break;
				}
				return type;
			},
		},
	};
</script>
<style></style>
