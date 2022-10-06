<template>
	<div>
		

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
	import InstallationTable from "../components/Installation/InstallationTable.vue";
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
