<template>
	<div>
		<base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
		</base-header>

		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
					<installation-table :client="true"></installation-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import InstallationTable from "./Tables/InstallationTable.vue";
	export default {
		name: "tables",
		components: {
			InstallationTable,
		},
		data() {
			return {
				residue: "false",
			};
		},
	};
</script>
<style></style>
