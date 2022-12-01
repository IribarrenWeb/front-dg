<template>
	<q-select :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)" :options="data"
		emit-value map-options label="Instalación" outlined dense>
		<template v-slot:append>
			<q-icon name="close" v-if="modelValue" @click.stop.prevent="$emit('update:model-value', null)"
				class="cursor-pointer" />
		</template>
	</q-select>
</template>
<script>
import { ref, computed } from "vue";
import service from "../../store/services/model-service";

export default {
	inheritAttrs: true,
	components: {
	},
	props: {
		modelValue: {}
	},
	setup(props, { emit }) {
		const installations = ref({});
		const data = computed(() => {
			return installations.value.map((p) => {
				return {
					label: p.name,
					value: p.id,
				};
			});
		});

		async function getInstallation() {
			const res = await service.getIndex("installation", null);
			installations.value = res.data.data;
		}

		getInstallation();

		return {
			data,
			getInstallation
		};
	},
};
</script>