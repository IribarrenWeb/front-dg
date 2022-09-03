<template>
	<div class="filter">
		<base-field :label="label" customClases="mb-0">
			<input class="form-control form-control-sm" type="date" v-model="date" @input="handleEmit"/>
		</base-field>
	</div>
</template>
<script>
	import { debounce } from "lodash";
	import { ref, computed, watch } from "vue";
	import service from "../../store/services/model-service";
	// import Multiselect from "vue-multiselect";

	export default {
		inheritAttrs: true,
        name: 'date-filter',
		components: {
			// Multiselect,
		},
		props: {
			clear: {
				type:Boolean,
				default: false
			},
			label: {
				type: String,
				default: 'Fecha'
			}
		},
		setup(props, {emit}) {
			const provinces = ref([]);
			const date = ref(null);
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
                emit('updated',date.value)
            }, 500)
			getDelegates();

			watch(() => props.clear, (val) => {
				if (val) {
					date.value = null
					emit('update:clear', false)
				}
			})

			return {
				data,
                handleEmit,
				date,
			};
		},
	};
</script>