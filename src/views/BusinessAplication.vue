<template>
	<div>
		<div class="container-fluid mt--7">
			<q-tabs v-model="tab" class="text-white" content-class="custom-q-tabs" align="left"
				indicator-color="transparent">
				<q-tab name="formation" label="Formaciones" content-class="q-tab-custom" />
				<q-tab name="audit" label="Auditorías" content-class="q-tab-custom" />
			</q-tabs>
			<q-tab-panels class="card shadow card-header border-radius-top-0 px-0 custom-tabpanel" v-model="tab"
				animated>
				<q-tab-panel name="formation">
					<aplication-table :typeAplication="tab" />
				</q-tab-panel>
				<q-tab-panel name="audit">
					<aplication-table :typeAplication="tab" />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity';
import CartageTable from '../components/CartageLetter/CartageTable.vue';
import AplicationTable from '../components/BusinessAplication/AplicationTable.vue';
export default {
	components: {
		CartageTable,
		AplicationTable
	},
	props: {

	},
	setup(props) {
		const tab = ref('formation')
		return {
			tab
		}
	}
};
</script>
<style lang="scss">

</style>
