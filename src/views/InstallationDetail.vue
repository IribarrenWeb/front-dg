<template>
	<div>
		<base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
		</base-header>

		<div class="container-fluid mt--7">
			<div class="row px-1 px-lg-4">
				<div class="col card p-md-5">
                    <div class="mb-lg-4 mb-2 d-flex align-items-center" v-if="installation != null">
                        <div class="row">
                            <div class="col-md-5 d-flex">
                                <a href="#" @click.prevent="this.$router.back()" class="h2"><i class="fa-solid fa-angle-left text-muted mr-2"></i></a>
                                <h3>{{installation.name}}</h3>
                            </div>
                            <div class="col-md-7 d-flex">
                                <span class="h5 text-muted text-uppercase">{{installation.address}}</span>
                                <span class="h5 text-muted text-uppercase">{{installation.province.name}}</span>
                            </div>
                        </div>
                    </div>
					<installation-show v-if="id != null" :installation_id="id" @installation="installation = $event"></installation-show>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import InstallationShow from './Shows/InstallationShow.vue';
	export default {
		name: "installation-detail",
		components: {
            InstallationShow,
		},
		data() {
			return {
                id: null,
                installation: null
			};
		},
        async created() {
			this.id = this.$route.params.id;
			this.$watch(
				() => this.$route.params,
				(toParams) => {
					this.id = toParams.id;
				}
			);
		},
	};
</script>
<style></style>
