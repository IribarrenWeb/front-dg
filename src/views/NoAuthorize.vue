<template>
	<div>
		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
					<q-banner class="bg-primary text-white">
						Contenido no autorizado
						<template v-slot:action>
							<!-- <q-btn flat color="white" label="Dismiss" /> -->
							<!-- <q-btn flat color="white" label="Update Credit Card" /> -->
						</template>
					</q-banner>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: "no-authorize-view",
	components: {
	},
};
</script>
<style>

</style>
