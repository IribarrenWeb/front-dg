<template>
	<div>
		<div class="container-fluid mt--7">
			<div>
				<formation-table @reloadTraining="handleReload"></formation-table>
			</div>
			<div class="mt-3">
				<training-table :reload="reload" @reloaded="reload = false"></training-table>
			</div>
		</div>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import FormationTable from '../components/Formation/FormationTable.vue';
import TrainingTable from '../components/Training/TrainingTable.vue';
import { computed } from '@vue/runtime-core';
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
			reload.value = true
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
