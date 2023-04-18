<template>
	<div>
		

		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
					<ul class="nav nav-tabs border-bottom-0">
						<li class="nav-item">
							<router-link
								to="/audits"
								class="nav-link tab-custom-link"
								exact-active-class="active"
							>
								Auditorias
							</router-link>
						</li>
						<li class="nav-item">
							<router-link
								to="/audits/nonconformities"
								class="nav-link tab-custom-link"
								exact-active-class="active"
							>
								No conformidades
							</router-link>
						</li>
					</ul>
					<!-- <audit-table
						v-if="!isNons"
						classes="border-radius-top-0"
						title="Auditorias"
					></audit-table>
					<non-table
						v-if="isNons"
						classes="border-radius-top-0"
						residue="true"
					></non-table> -->
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import AuditTable from "../components/Audit/AuditTable.vue";
	import NonTable from "../components/Non/NonTable.vue";
	export default {
		name: "tables",
		components: {
			AuditTable,
			NonTable,
		},

		mounted() {
			console.log("on mounted bebe");
			console.log(this.$router.currentRoute.value.path);
		},
		updated() {
			if (this.$router.currentRoute.value.path == "/audits") {
				this.$router.push("/audits");
			}
		},
		computed: {
			isNons() {
				return this.$router.currentRoute.value.path == "/audits/nonconformities";
			},
		},
	};
</script>
<style></style>
