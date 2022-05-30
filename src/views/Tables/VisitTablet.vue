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
				</div>
			</div>
		</div>

		<div class="table-responsive">
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
					<th></th>
				</template>

				<template v-slot:default="row">
					<td class="budget">
						{{ row.item.name }}
					</td>
					<th scope="row">
						<div class="media align-items-center">
							<div class="media-body">
								<span class="name mb-0 text-sm">{{
									row.item.visitable.installation.name
								}}</span>
							</div>
						</div>
					</th>
                    <td class="budget">
						{{ row.item.visitable.installation.auditable.user.full_name }}
					</td>
					<td class="text-uppercase">
						{{ row.item.type }}
					</td>
					<td>
						{{ FORMAT_DATE(row.item.date_scheduled) }}
					</td>
                    <td>
						{{ row.item.time }}
					</td>
				</template>
			</base-table>

			<base-pagination
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
	import service from "../../store/services/model-service";
	export default {
		name: "audits-table",
		props: {
			type: {
				type: String,
			},
			title: String,
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				loader: false,
				page: 1,
                url: this.$store.state.api_url
			};
		},
		mounted() {
			this.getVisits(this.page);
		},
        computed: {
            ...mapGetters(['CURRENT_DATE', 'FORMAT_DATE'])
        },
		methods: {
			async getVisits(page = 1) {
				const resp = await service.getIndex(
					"visit",
					page,
					"includes[]=visitable.installation.auditable.user"
				);
				if (typeof resp.data.data != "undefined") {
					this.tableData = resp.data.data;
					this.metaData = resp.data.meta.page;
					this.page = this.metaData.currentPage;
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.getVisits(event);
			},
		},
	};
</script>
<style></style>
