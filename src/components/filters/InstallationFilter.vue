<template>
	<div class="filter">
		<multiselect
			v-model="model"
			:options="data"
			placeholder="Instalación"
			label="label"
			selectLabel="+"
			deselectLabel="-"
			track-by="label"
			@select="$emit('updated', $event.value)"
		></multiselect>
	</div>
</template>
<script>
	import { ref, computed, watch } from "vue";
	import service from "../../store/services/model-service";
	import Multiselect from "vue-multiselect";

	export default {
		inheritAttrs: true,
        components: {
			Multiselect,
		},
		props:{
			clear:{
				type: Boolean,
				default: false
			}
		},
		setup(props, {emit}) {
			const model = ref(null)
			const installations = ref({});
			const data = computed(() => {
				return installations.value?.length ? installations.value.map((p) => {
					return {
						label: p.name,
						value: p.id,
					};
				}) : [];
			});

			async function getInstallation() {
				const res = await service.getIndex("installation", null);
				installations.value = res.data.data;
			}

			watch(() => props.clear, (val) => {
				if (val) {
					model.value = null
					emit('update:clear', false)
				}
			})
			getInstallation();

			return {
				model,
				data,
				getInstallation
			};
		},
	};
</script>