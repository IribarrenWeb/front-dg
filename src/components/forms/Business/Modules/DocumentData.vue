<template>
	<div class="row border border-light mt-3 rounded p-2">
		<div class="col-12">
			<h4>Alta empresa</h4>
		</div>
		<div class="col-lg-6">
			<base-field name="file_date.date" label="Fecha de alta">
				<field-validate
					type="date"
					class="form-control"
					name="file_date.date"
					label="fecha alta"
					@input="$emit('update:file_date', $event.target.value)"
					:value="file_date"
				/>
			</base-field>
		</div>
		<div class="col-lg-6">
			<base-field name="file_document.base64" label="Alta empresa">
				<div v-if="file_document?.length >= 1">
					<span class="mr-md-4">{{ file_document[0].name }}</span>
					<base-button
						@click="$emit('update:file_document', [])"
						size="sm"
						type="default"
						:outline="true"
						><i class="fa-solid fa-pencil"></i
					></base-button>
				</div>
				<field-validate
					v-show="$empty(file_document)"
					type="file"
					class="form-control"
					name="file_document.base64"
					rules="ext:pdf"
					label="documento"
					@change="$emit('update:file_document', $event.target.files)"
				/>
			</base-field>
		</div>
	</div>
</template>
<script>
	import { computed } from "@vue/runtime-core";
	import { useStore } from "vuex";
	export default {
		props: {
			file_document: {
				type: Object || Array,
			},
			file_date: {
				type: String,
			},
		},
		setup() {
			const store = useStore();
			const role = computed(() => {
				return store.getters.ROLE;
			});

			return {
				role,
			};
		},
	};
</script>