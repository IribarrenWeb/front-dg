<template>
	<div>
		<div class="container-fluid mt--5">
			<profile-dashboard v-if="role != 'superadmin'" />
			<super-admin-dashboard v-else />
		</div>
	</div>
</template>
<script>
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';
import ProfileDashboard from '../components/Dashboard/ProfileDashboard.vue';
import SuperAdminDashboard from '../components/Dashboard/SuperAdminDashboard.vue';

export default {
	components: { ProfileDashboard, SuperAdminDashboard },
	props: {

	},
	setup(props) {
		const store = useStore()
		const role = computed(() => store.getters.ROLE)

		return {
			role
		}

	}
};
</script>
<style>

</style>
