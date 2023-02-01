<template>
	<div class="container-fluid mt--7">
		<div class="row billings-container">
			<div class="col">
				<q-tabs v-model="tab" inline-label align="justify" class="text-white q-mb-md">
					<q-tab name="admin" label="Consultorias" />
					<q-tab name="auditors" class="q-mx-md" label="Auditores" />
					<q-tab name="business" label="Empresas" />
				</q-tabs>

				<q-tab-panels keep-alive class="mx-0 mb-5 p-0 bg-transparent" v-model="tab" animated swipeable>
					<q-tab-panel name="admin" class="">
						<q-table table-class="table" table-header-class="thead-light" :loading="loading" :rows="plans"
							:columns="columns">
							<template v-slot:body-cell-actions="props">
								<q-td :props="props">
									<q-btn color="primary" flat dense icon="fa-solid fa-key"
										@click="handleSelect(props.row)" />
								</q-td>
							</template>
							<template v-slot:body-cell-stripe="props">
								<q-td :props="props">
									<q-badge v-if="props.row?.stripe_price && props.row?.stripe_product" color="success"
										text-color="white" label="Si" />
									<q-badge v-else color="red" text-color="white" label="No" />
								</q-td>
							</template>
						</q-table>
						<!-- <div class="text-h4 q-mb-md">Planes</div> -->
					</q-tab-panel>

					<q-tab-panel name="auditors">
						<q-table table-class="table" table-header-class="thead-light" :loading="loading" :rows="plans"
							:columns="columns">
							<template v-slot:body-cell-actions="props">
								<q-td :props="props">
									<q-btn color="primary" flat dense icon="fa-solid fa-key"
										@click="handleSelect(props.row)" />
								</q-td>
							</template>
							<template v-slot:body-cell-stripe="props">
								<q-td :props="props">
									<q-badge v-if="props.row?.stripe_price && props.row?.stripe_product" color="success"
										text-color="white" label="Si" />
									<q-badge v-else color="red" text-color="white" label="No" />
								</q-td>
							</template>
						</q-table>
					</q-tab-panel>

					<q-tab-panel name="business">
						<q-table table-class="table" table-header-class="thead-light" :loading="loading" :rows="plans"
							:columns="columns">
							<template v-slot:body-cell-actions="props">
								<q-td :props="props">
									<q-btn color="primary" flat dense icon="fa-solid fa-key"
										@click="handleSelect(props.row)" />
								</q-td>
							</template>

							<template v-slot:body-cell-stripe="props">
								<q-td :props="props">
									<q-badge v-if="props.row?.stripe_price && props.row?.stripe_product" color="success"
										text-color="white" label="Si" />
									<q-badge v-else color="red" text-color="white" label="No" />
								</q-td>
							</template>
						</q-table>
						<!-- <div class="text-h4 q-mb-md">Empresas</div> -->
					</q-tab-panel>
				</q-tab-panels>

				<plan-update-module v-model="updatePlan" :planId="planId" :planData="planData" @saved="getPlans" />
			</div>
		</div>
	</div>
</template>
<script>

import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import modelService from '../store/services/model-service';
import PlanUpdateModule from '../components/Stripe/Plans/PlanUpdateModule.vue';

export default {
	name: "plan-view",
	components: {
		PlanUpdateModule

	},
	setup(props) {
		const plans = ref([])
		const tab = ref('admin')
		const planId = ref(null)
		const planData = ref(null)
		const updatePlan = ref(false)
		const role_id = computed(() => tab.value == 'admin' ? 1 : (tab.value == 'auditors' ? 3 : 4))
		const loading = ref(false)
		const columns = [
			{
				name: 'title',
				label: 'Plan',
				align: 'left',
				field: row => row?.title,
				// format: val => `${val}`,
				sortable: true
			},
			{
				name: 'name',
				label: 'Nombre',
				align: 'left',
				field: row => row?.name,
				// format: val => `${val}`,
				sortable: true
			},
			{
				name: 'price',
				label: 'Precio',
				align: 'left',
				field: row => row?.price,
				format: val => `${val}€`,
				sortable: true
			},
			{
				name: 'stripe',
				label: 'Conectado (stripe)',
				align: 'left',
				// field: row => row?.price,
				// format: val => `${val}€`,
				// sortable: true
			},
			{
				name: 'actions',
				align: 'left',
			},
		]

		async function getPlans() {
			try {
				loading.value = true
				const wheres = JSON.stringify({
					role_id: role_id.value
				})
				const res = await modelService.apiNoLoading({ url: `subscription?wheres=${wheres}` })
				loading.value = false

				plans.value = res?.data?.data ?? []
			} catch (error) {
				loading.value = false
			}
		}

		function handleSelect(data) {
			updatePlan.value = true
			planId.value = data?.id
			planData.value = data
		}

		watch(() => role_id.value, (v) => {
			if (v) getPlans()
		}, { immediate: true })

		watch(() => updatePlan.value, (v) => {
			if (!v) {
				planId.value = null
				planData.value = null
			}
		})

		return {
			plans,
			tab,
			loading,
			columns,
			updatePlan,
			planId,
			planData,

			getPlans,
			handleSelect
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
