<template>
	<q-select :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)" :options="data"
		emit-value map-options label="Empresa" outlined dense>
		<template v-slot:append>
			<q-icon name="close" v-if="modelValue" @click.stop.prevent="$emit('update:model-value', null)"
				class="cursor-pointer" />
		</template>
	</q-select>
</template>
<script>
import { ref, computed } from "vue";
import service from "../../store/services/model-service";
import { map } from 'lodash';

export default {
	inheritAttrs: true,
	components: {
	},
	props: {
		modelValue: {}
	},
	setup(props, { emit }) {
		const business = ref({});
		const data = computed(() => {
			if (business.value?.length < 1) return 

			return map(business.value,(p) => {
				return {
					label: p.user?.full_name,
					value: p.id,
				};
			});
		});

		async function getData() {
			const res = await service.getIndex("business", null, "includes[]=user");
			business.value = res.data.data;
		}

		getData();

		return {
			data,
			getData
		};
	},
};
</script>