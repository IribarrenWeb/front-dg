<template>
	<div>
		<base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
		</base-header>

		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
                    <visit-tablet title="Visitas"></visit-tablet>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import VisitTablet from './Tables/VisitTablet.vue';
    
	export default {
		name: "tables",
		components: {
            VisitTablet,
		},
	};
</script>
<style></style>
