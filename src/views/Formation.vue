<template>
	<div>

		<div class="container-fluid mt--7">

			<q-tabs v-model="tab" class="text-white" content-class="custom-q-tabs" align="left"
				indicator-color="transparent">
				<q-tab name="formations" label="Formaciones" content-class="q-tab-custom" />
				<q-tab name="aplications" content-class="q-tab-custom" label="Solicitudes" />
			</q-tabs>
			<q-tab-panels class="card shadow card-header border-radius-top-0 px-0 custom-tabpanel" v-model="tab"
				animated>
				
				<q-tab-panel name="formations">
					<!--Tables-->
					<div>
						<formation-table @reloadTraining="handleReload"></formation-table>
					</div>
					<div class="mt-3">
						<training-table :reload="reload" @reloaded="reload = false"></training-table>
					</div>
					<!--End tables-->
				</q-tab-panel>

				<q-tab-panel name="aplications">
					<!-- Aplication forms -->
				</q-tab-panel>
			</q-tab-panels>

		</div>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import FormationTable from '../components/Formation/FormationTable.vue';
import TrainingTable from '../components/Training/TrainingTable.vue';
// Charts

export default {
	components: { FormationTable, TrainingTable },
	setup() {
		const reload = ref(false)
		const store = useStore();
		const role = computed(() => {
			return store.getters.ROLE;
		});

		function handleReload() {
			reload = true
		}

		return {
			reload,
			role,
			handleReload
		};
	}
};
</script>
<style>

</style>
