<template>
	<div class="filter">
        <input :placeholder="placeholder" class="form-control form-control-sm" v-model="query" @input="handleEmit"/>
	</div>
</template>
<script>
	import { debounce } from "lodash";
	import { ref, watch } from "vue";
	// import Multiselect from "vue-multiselect";

	export default {
		inheritAttrs: true,
        name: 'text-filter',
		components: {
			// Multiselect,
		},
		props: {
			clear: {
				type:Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: 'Nombre'
			}
		},
		setup(props, {emit}) {
			const query = ref(null);
            
            const handleEmit = debounce(() =>{
                emit('updated',query.value)
            }, 500)

			watch(() => props.clear, (val) => {
				if (val) {
					query.value = null
					emit('update:clear', false)
				}
			})

			return {
                handleEmit,
				query,
			};
		},
	};
</script>