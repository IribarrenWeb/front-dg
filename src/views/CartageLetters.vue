<template>
	<div>
		<div class="container-fluid mt--7">
			<q-tabs v-model="tab" class="text-white" content-class="custom-q-tabs" align="left"
				indicator-color="transparent">
				<q-tab name="maritimas" content-class="q-tab-custom" label="Maritimas" />
				<q-tab name="aereas" label="Aereas" content-class="q-tab-custom" />
				<q-tab name="carretera" label="Carretera" content-class="q-tab-custom" />
			</q-tabs>
			<q-tab-panels class="card shadow card-header border-radius-top-0 px-0 custom-tabpanel" v-model="tab" animated>
				<q-tab-panel name="maritimas">
					<cartage-table :type_for="tab" />
				</q-tab-panel>
				<q-tab-panel name="aereas">
					<cartage-table :type_for="tab" />
				</q-tab-panel>
				<q-tab-panel name="carretera">
					<cartage-table :type_for="tab" />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity';
import CartageTable from '../components/CartageLetter/CartageTable.vue';
export default {
	components: {
CartageTable

	},
	props: {

	},
	setup(props) {
		const tab = ref('maritimas')
		return {
			tab
		}
	}
};
</script>
<style lang="scss">

</style>
