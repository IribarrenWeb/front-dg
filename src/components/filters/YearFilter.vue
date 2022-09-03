<template>
	<div class="filter">
		<base-field :label="label" customClases="mb-0">
			<input
				class="form-control form-control-sm"
				type="number"
				min="1900"
				max="2099"
				:placeholder="placeholder"
				v-model="year"
				@input="handleEmit"
			/>
		</base-field>
	</div>
</template>
<script>
	import { debounce } from "lodash";
	import { ref, watch } from "vue";

	export default {
		inheritAttrs: true,
		name: "year-filter",
		components: {
			// Multiselect,
		},
		props: {
			clear: {
				type: Boolean,
				default: false,
			},
			label: {
				type: String,
				default: "Fecha",
			},
			placeholder: {
				type: String,
				default: ''
			}
		},
		setup(props, { emit }) {
			const year = ref(null);

			const handleEmit = debounce(() => {
				emit("updated", year.value);
			}, 500);

			watch(
				() => props.clear,
				(val) => {
					if (val) {
						year.value = null;
						emit("update:clear", false);
					}
				}
			);

			return {
				handleEmit,
				year,
			};
		},
	};
</script>