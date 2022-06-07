<template>
	<div>
		

		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
					<ul class="nav nav-tabs border-bottom-0">
						<li class="nav-item">
							<router-link
								to="/materials"
								class="nav-link tab-custom-link"
								exact-active-class="active"
							>
								Mercancías
							</router-link>
						</li>
						<li class="nav-item">
							<router-link
								to="/materials/residues"
								class="nav-link tab-custom-link"
								exact-active-class="active"
							>
								Residuos
							</router-link>
						</li>
					</ul>
					<material-table
						v-if="!isResidue"
                        :installations="installations"
						classes="border-radius-top-0"
						title="Mercancías"
					></material-table>
					<material-table
						v-if="isResidue"
                        :installations="installations"
						classes="border-radius-top-0"
						residue="true"
					></material-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import service from "@/store/services/model-service";
	import MaterialTable from "./Tables/MaterialTable.vue";

	export default {
		name: "tables",
		components: {
			MaterialTable,
		},
		data() {
			return {
                installations: null
            };
		},
		mounted() {
            this.getInstallations();
        },
        methods: {
            async getInstallations() {
                const response = await service.getIndex("installation", null, 'includes[]=auditable.user&includes[]=employees&includes[]=province');
				this.installations = response.data.data;
			},
        },
		computed: {
			isResidue() {
				return this.$router.currentRoute.value.path == "/materials/residues";
			},
		},
	};
</script>
<style></style>
