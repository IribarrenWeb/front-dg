<template>
	<div>
		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
					<subscription-module />
					<q-separator spaced />
					<create-card-element />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import CreateCardElement from '../components/Stripe/CreateCardElement.vue';
import SubscriptionModule from '../components/Stripe/SubscriptionModule.vue';

export default {
	name: "billing-view",
	components: {
		SubscriptionModule,
		CreateCardElement
	},
};
</script>
<style>

</style>
