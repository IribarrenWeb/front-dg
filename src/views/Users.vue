<template>
	<div>
		<div class="container-fluid mt--7">
			<q-tabs v-model="tab" class="text-white" content-class="custom-q-tabs" align="left"
				indicator-color="transparent">
				<q-tab name="consulting" content-class="q-tab-custom" label="Consultorias" />
				<q-tab name="auditors" label="Auditores" content-class="q-tab-custom" />
				<q-tab name="business" label="Empresas" content-class="q-tab-custom" />
			</q-tabs>
			<q-tab-panels class="card shadow card-header border-radius-top-0 px-0 custom-tabpanel" v-model="tab" animated>
				<q-tab-panel name="consulting">
					<!--  -->
					<users-table :typeUser="tab" />
				</q-tab-panel>
				<q-tab-panel name="auditors">
					<!--  -->
					<users-table :typeUser="tab" />

				</q-tab-panel>
				<q-tab-panel name="business">
					<!--  -->
					<users-table :typeUser="tab" />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity';
import UsersTable from '../components/Superadmin/UsersTable.vue';

export default {
	components: {UsersTable},
	setup(props) {
		return {
			tab:ref('consulting')
		}
	}
};
</script>
<style>

</style>
