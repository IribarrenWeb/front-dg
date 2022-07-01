<template>
	<div class="d-inline-block mx-2 filter">
        <input placeholder="Ciudad" class="form-control filter" v-model="selectedCity" @input="handleEmit"/>
		<!-- <multiselect
			v-model="selectedCity"
			:options="data"
			placeholder="Ciudades"
			label="label"
			track-by="label"
			@select="$emit('updated', $event.value)"
		></multiselect> -->
	</div>
</template>
<script>
	import { debounce } from "lodash";
import { ref, computed } from "vue";
	import service from "../../store/services/model-service";
	// import Multiselect from "vue-multiselect";

	export default {
        name: 'city-filter',
		components: {
			// Multiselect,
		},
		setup(props, {emit}) {
			const provinces = ref([]);
			const model = ref(0);
			const selectedCity = ref(null);
			const data = computed(() => {
				return provinces.value.map((p) => {
					return {
						label: p.name,
						value: p.name,
					};
				});
			});
			async function getDelegates() {
				const res = await service.getIndex("city", null);
				provinces.value = res.data.data;
			}
            
            const handleEmit = debounce(() =>{
                emit('updated',selectedCity.value)
            }, 500)
			getDelegates();

			return {
				model,
				data,
                handleEmit,
				selectedCity,
			};
		},
	};
</script>