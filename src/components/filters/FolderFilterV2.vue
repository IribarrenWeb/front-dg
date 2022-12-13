<template>
	<div>
		<q-select v-model="folder_id" class="mb-none q-mb-none"
			@update:model-value="$emit('update:model-value', $event)" :options="data" emit-value map-options
			label="Carpeta" outlined dense>
			<template v-slot:prepend>
				<q-icon name="fa-solid fa-folder" />
			</template>

			<template v-slot:after>
				<q-btn round dense flat icon="fa-solid fa-plus" @click="addFolder = true">
					<q-tooltip>
						Agregar carpeta
					</q-tooltip>
				</q-btn>
			</template>

		</q-select>
		<document-folder-create-modal v-if="addFolder" @created="handleCreated" v-model="addFolder" />
	</div>
</template>
<script>
import { ref, computed, watch } from "vue";
import service from "../../store/services/model-service";
import DocumentFolderCreateModal from '../DocumentFolder/DocumentFolderCreateModal.vue';

export default {
	inheritAttrs: true,
	components: {
		DocumentFolderCreateModal
	},
	props: {
		modelValue: {},
		clear: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { emit }) {
		const folders = ref([]);
		const folder_id = ref(null)
		const addFolder = ref(false);
		const data = computed(() => {
			if (folders.value?.length < 1) return
			return folders.value.map((f) => {
				return {
					label: f.name,
					value: f.id,
					model: f
				};
			});
		});

		function handleCreated() {
			emit('new-folder', true)

			getFolders()
		}
		async function getFolders() {
			const res = await service.api({ url: 'document-folder' });
			folders.value = res?.data?.data ?? [];
		}

		watch(() => props.clear, (val) => {
			if (val) {
				folder_id.value = null
				emit('update:clear', false)
			}
		})

		getFolders();

		return {
			data,
			folder_id,
			addFolder,
			
			handleCreated,
			getFolders,
		};
	},
};
</script>