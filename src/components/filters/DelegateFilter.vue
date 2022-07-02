<template>
	<div class="d-inline-block filter">
		<multiselect
			v-model="model"
			:options="data"
			placeholder="Delegados"
			label="label"
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
			const delegates = ref({});
			const data = computed(() => {
				return delegates.value.map((p) => {
					return {
						label: p.user.full_name,
						value: p.id,
					};
				});
			});

			async function getDelegates() {
				const res = await service.getIndex("delegate", null, "includes[]=user");
				delegates.value = res.data.data;
			}

			watch(() => props.clear, (val) => {
				if (val) {
					model.value = null
					emit('update:clear', false)
				}
			})
			getDelegates();

			return {
				model,
				data,
			};
		},
	};
</script>