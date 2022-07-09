<template>
	<div class="filter">
		<multiselect
			v-model="model"
			:options="data"
			placeholder="Empresa"
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
			const business = ref({});
			const data = computed(() => {
				return business.value.map((p) => {
					return {
						label: p.user.full_name,
						value: p.id,
					};
				});
			});

			async function getBusiness() {
				const res = await service.getIndex("business", null, "includes[]=user");
				business.value = res.data.data;
			}

			watch(() => props.clear, (val) => {
				if (val) {
					model.value = null
					emit('update:clear', false)
				}
			})
			getBusiness();

			return {
				model,
				data,
				getBusiness
			};
		},
	};
</script>