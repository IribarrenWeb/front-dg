<template>
	<q-select :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)" :options="data"
		emit-value map-options outlined dense>
		<template v-slot:append>
			<q-icon name="close" v-if="modelValue" @click.stop.prevent="$emit('update:model-value', null)"
				class="cursor-pointer" />
		</template>
	</q-select>
</template>
<script>
import { map } from "lodash";
import { ref, computed } from "vue";
import service from "../../store/services/model-service";

export default {
	inheritAttrs: true,
	components: {
	},
	props: {
		modelValue: {},
		type_for: {
			type: String,
			default: 'destinatary'
		}
	},
	setup(props, { emit }) {
		const datas = ref({});
		const endpoint = computed(() => {
			return `cartage-${props.type_for}`;
		})
		const data = computed(() => {
			if (datas.value?.length < 1) return 

			return map(datas.value,(p) => {
				return {
					label: p.business_name,
					value: p.id,
				};
			});
		});

		async function getData() {
			const res = await service.api({ url: endpoint.value});
			datas.value = res.data.data;
		}

		getData();

		return {
			data,
			getData
		};
	},
};
</script>