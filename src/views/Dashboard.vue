<template>
	<div>
		<base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
			<div class="row" v-if="role == 'admin'">
				<div class="col-xl-3 col-lg-6">
					<stats-card
						title="Delegados"
						type="gradient-info"
						:sub-title="counter.delegates"
						icon="ni ni-single-02"
						class="mb-4 mb-xl-0"
					></stats-card>
				</div>
				<div class="col-xl-3 col-lg-6">
					<stats-card
						title="Auditores"
						type="gradient-info"
						:sub-title="counter.auditors"
						icon="ni ni-hat-3"
						class="mb-4 mb-xl-0"
					></stats-card>
				</div>
				<div class="col-xl-3 col-lg-6">
					<stats-card
						title="Empresas"
						type="gradient-info"
						:sub-title="counter.business"
						icon="ni ni-shop"
						class="mb-4 mb-xl-0"
					>
					</stats-card>
				</div>
				<div class="col-xl-3 col-lg-6">
					<stats-card
						title="Instalaciones"
						type="gradient-info"
						:sub-title="counter.insts"
						icon="ni ni-chart-bar-32"
						class="mb-4 mb-xl-0"
					>
					</stats-card>
				</div>
			</div>
		</base-header>

		<div class="container-fluid mt--5">
			<div>
				<visits-table></visits-table>
			</div>
			<div class="my-md-4">
				<informs-table></informs-table>
			</div>
			<div>
				<non-table :dash="true"></non-table>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import InformsTable from "./Tables/InformsTable.vue";
	import NonTable from "./Tables/NonTable.vue";
	import VisitsTable from "./Tables/VisitsTable.vue";
	import service from "@/store/services/model-service";
	export default {
		components: { VisitsTable, InformsTable, NonTable },
		data() {
			return {
				counter: {
					delegates: null,
					business: null,
					auditors: null,
					insts: null,
				},
			};
		},
		async mounted() {},
		computed: {
			...mapGetters({
				role: "ROLE",
			}),
		},
		methods: {
			async getDash() {
				try {
					const res = await service.dashboard();
					let data = res.data.data;
					this.counter = {
						delegates: data.delegates >= 1 ? data.delegates : "0",
						business: data.business >= 1 ? data.business : "0",
						auditors: data.auditors >= 1 ? data.auditors : "0",
						insts: data.installations >= 1 ? data.installations : "0",
					};
				} catch (err) {
					console.log(err);
				}
			},
		},
		watch: {
			role: {
				handler(role) {
					if (role == "admin") {
						this.getDash();
					}
				},
				immediate: true,
			},
		},
	};
</script>
<style></style>
