<template>

	<div class="container-fluid mt--7">
		<div class="row billings-container">
			<div class="col">
				<!-- <q-splitter limits="[30, 70]" v-model="splitterModel"> -->
				<!-- <template v-slot:before> -->
				<!-- <q-tabs v-model="tab"  class="text-primary" active-class="active-tab">
							<q-tab name="plans" class="custom-shadow-sm mb-0 mx-0 mx-md-2 mb-md-3" icon="fa-solid fa-address-card" label="Planes" />
							<q-tab name="payments" class="custom-shadow-sm mb-0 mx-0 mx-md-2 mb-md-3" icon="fa-regular fa-credit-card" label="Metodos de pago" />
							<q-tab name="transactions" class="custom-shadow-sm mb-0 mx-0 mx-md-2 mb-md-3" icon="fa-solid fa-landmark" label="Transacciones" />
						</q-tabs> -->
				<q-tabs v-model="tab" inline-label align="justify" class="text-white q-mb-md">
					<q-tab name="plans" icon="fa-solid fa-address-card" label="Planes" />
					<q-tab name="payments" class="q-mx-md" icon="fa-regular fa-credit-card" label="Metodos de pago" />
					<!-- <q-tab name="transactions" icon="fa-solid fa-landmark" label="Transacciones" /> -->
				</q-tabs>
				<!-- </template> -->

				<!-- <template v-slot:after> -->
				<q-tab-panels keep-alive class="mx-0 mb-5 custom-shadow" v-model="tab" animated swipeable
					transition-prev="jump-up" transition-next="jump-up">
					<q-tab-panel name="plans" class="">
						<!-- <div class="text-h4 q-mb-md">Planes</div> -->
						<subscription-module />
					</q-tab-panel>

					<q-tab-panel name="payments">
						<payment-methods></payment-methods>
					</q-tab-panel>

					<q-tab-panel name="transactions">
						<div class="text-h4 q-mb-md">Transacciones</div>
						<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
							magnam
							odio
							iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda
							consectetur
							culpa fuga nulla ullam. In, libero.</p>
						<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
							magnam
							odio
							iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda
							consectetur
							culpa fuga nulla ullam. In, libero.</p>
						<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
							magnam
							odio
							iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda
							consectetur
							culpa fuga nulla ullam. In, libero.</p>
					</q-tab-panel>
				</q-tab-panels>
				<!-- </template> -->

				<!-- </q-splitter> -->
				<!-- <subscription-module />
				<q-separator spaced />
				<create-card-element /> -->
			</div>
		</div>
	</div>
</template>
<script>

import { ref } from '@vue/reactivity';
import CreateCardElement from '../components/Stripe/CreateCardElement.vue';
import PaymentMethods from '../components/Stripe/PaymentMethods.vue';
import SubscriptionModule from '../components/Stripe/SubscriptionModule.vue';

export default {
	name: "billing-view",
	components: {
		SubscriptionModule,
		PaymentMethods
	},
	setup(props) {
		return {
			tab: ref('plans'),
			splitterModel: ref(20)
		}
	}
};
</script>
<style lang="scss">
.billings-container {
	.q-tab__content {
		flex-direction: row !important;

		.q-icon {
			margin-right: 10px;
		}
	}

	.q-tab {
		// border-radius: 20px;
		// background-color: white;
		// z-index: 1000000000000;
		// opacity: 1 !important;
		// box-shadow: -1px 2px 5px 1px #5a5a5a8a;
	}

	.q-tab__indicator {
		// display: none;
	}

	.active-tab {
		border: 1px solid darkblue;
		background: lightgray;
	}

	.q-tab-panels {
		border-radius: 15px;
	}

	.q-splitter__separator {
		display: none;
	}

}
</style>
