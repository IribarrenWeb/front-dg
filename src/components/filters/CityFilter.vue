<template>
	<div class="d-inline-block mx-2 filter">
        <input placeholder="Ciudad" class="form-control form-control-sm" v-model="selectedCity" @input="handleEmit"/>
	</div>
</template>
<script>
	import { debounce } from "lodash";
	import { ref, computed, watch } from "vue";
	import service from "../../store/services/model-service";
	// import Multiselect from "vue-multiselect";

	export default {
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
			async function getDelegates() {
				const res = await service.getIndex("city", null);
				provinces.value = res.data.data;
			}
            
            const handleEmit = debounce(() =>{
                emit('updated',selectedCity.value)
            }, 500)
			getDelegates();

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