<template>
	<div class="filter">
        <input placeholder="Ciudad" class="form-control form-control-sm" v-model="selectedCity" @input="handleEmit"/>
	</div>
</template>
<script>
	import { debounce } from "lodash";
	import { ref, computed, watch } from "vue";
	// import Multiselect from "vue-multiselect";

	export default {
		inheritAttrs: true,
        name: 'city-filter',
		components: {
			// Multiselect,
		},
		props: {
			clear: {
				type:Boolean,
				default: false
			}
		},
		setup(props, {emit}) {
			const provinces = ref([]);
			const selectedCity = ref(null);
			const data = computed(() => {
				return provinces.value.map((p) => {
					return {
						label: p.name,
						value: p.name,
					};
				});
			});
			
            
            const handleEmit = debounce(() =>{
                emit('updated',selectedCity.value)
            }, 500)

			watch(() => props.clear, (val) => {
				if (val) {
					selectedCity.value = null
					emit('update:clear', false)
				}
			})

			return {
				data,
                handleEmit,
				selectedCity,
			};
		},
	};
</script>