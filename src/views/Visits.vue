<template>
	<div>
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
