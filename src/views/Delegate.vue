<template>
	<div>
		

		<div class="container-fluid mt--7">
			<!--Tables-->
			<delegate-table></delegate-table>
			<!--End tables-->
		</div>
	</div>
</template>
<script>
	import DelegateTable from "./Tables/DelegateTable.vue";
	// Charts

	export default {
		components: { DelegateTable },
		data() {
			return {};
		},
		methods: {},
	};
</script>
<style></style>
