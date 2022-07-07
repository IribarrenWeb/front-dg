<template>
	<div class="d-inline-block mx-2 filter">
		<select class="form-control p-0 text-uppercase" @input="handleEmit" v-model="value">
			<option selected :value="0">{{placeholder}}</option>
			<option :value="option.value" class="text-uppercase" v-for="option,idx in options" :key="idx">{{option.label}}</option>
		</select>
	</div>
</template>
<script>
	import { debounce } from "lodash";
	import { ref, watch } from "vue";

	export default {
        name: 'select-filter',
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
			},
			placeholder: {
				type: String,
				default: 'Selecciona un tipo...'
			},
			options: Array||Object
		},
		setup(props, {emit}) {
			const value = ref(0)
            const handleEmit = debounce(() =>{
                emit('updated',value.value)
            }, 100)

			watch(() => props.clear, (val) => {
				if (val) {
					value.value = 0
					emit('update:clear', false)
				}
			})

			return {
				value,
                handleEmit,
			};
		},
	};
</script>