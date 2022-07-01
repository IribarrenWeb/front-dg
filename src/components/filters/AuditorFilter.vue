<template>
	<div class="d-inline-block filter">
		<multiselect
			v-model="model"
			:options="data"
			placeholder="Auditores"
			label="label"
			track-by="label"
			@select="$emit('updated', $event.value)"
		></multiselect>
	</div>
</template>
<script>
	import { ref, computed } from "vue";
	import service from "../../store/services/model-service";
	import Multiselect from "vue-multiselect";

	export default {
        components: {
			Multiselect,
		},
		setup() {
			const delegates = ref({});
			const model = ref(null);
			const data = computed(() => {
				return delegates.value.map((p) => {
					return {
						label: p.user.full_name,
						value: p.id,
					};
				});
			});

			async function getDelegates() {
				const res = await service.getIndex("auditor", null, "includes[]=user");
				delegates.value = res.data.data;
			}

			getDelegates();

			return {
				model,
				data,
			};
		},
	};
</script>