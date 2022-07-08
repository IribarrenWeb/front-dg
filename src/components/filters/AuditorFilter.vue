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
		inheritAttrs: true,
        components: {
			Multiselect,
		},
		setup() {
			const auditors = ref({});
			const model = ref(null);
			const data = computed(() => {
				return auditors.value.map((p) => {
					return {
						label: p.user.full_name,
						value: p.id,
					};
				});
			});

			async function getAuditors() {
				const res = await service.getIndex("auditor", null, "includes[]=user");
				auditors.value = res.data.data;
			}

			getAuditors();

			return {
				model,
				data,
			};
		},
	};
</script>