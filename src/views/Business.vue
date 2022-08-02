<template>
	<div>
		

		<div class="container-fluid mt--7">
			<!--Tables-->
			<div class="card">
				<business-table></business-table>
			</div>
			<!--End tables-->
		</div>
	</div>
</template>
<script>
	import BusinessTable from "./Tables/Business/BusinessTable.vue";
	// Charts

	export default {
		components: { BusinessTable },
		data() {
			return {
				users: {},
				meta: {},
			};
		},

		async mounted() {},
		methods: {},
	};
</script>
<style></style>
