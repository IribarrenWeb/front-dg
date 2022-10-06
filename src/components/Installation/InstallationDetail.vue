<template>
	<div>
		<div class="container-fluid mt--7">
			<div class="row px-1 px-lg-4">
				<div class="col-md-7 d-flex text-white">
					<a href="#" class="text-white h3" @click.prevent="this.$router.back()" 
						><i class="fa-solid fa-angle-left"></i
					>
						{{ installation?.name }}
					</a>
				</div>
				<div class="col-12 card p-md-5">
					<installation-show
						v-if="id != null"
						:installation_id="id"
						@installation="installation = $event"
					></installation-show>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import InstallationShow from "./InstallationShow.vue";
	export default {
		name: "installation-detail",
		components: {
			InstallationShow,
		},
		data() {
			return {
				id: null,
				installation: null,
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
