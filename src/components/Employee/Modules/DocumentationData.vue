<template>
	<div>
		<div class="col-lg-6">
			<base-field
				name="file_document.base64"
				label="Documentación de la instalación"
			>
				<div
					v-if="
						(!newDoc && firm_document) || file_inst?.file?.length >= 1
					"
				>
					<a
						href="#"
						class="mr-md-4"
						v-if="firm_document"
						@click.prevent="getDocument(firm_document.id)"
						>{{ firm_document.name_document }}</a
					>
					<span class="mr-md-4" v-else>{{ file_inst?.file[0].name }}</span>
					<base-button
						v-if="newDoc"
						@click="newDoc = false, file_inst.file = []"
						size="sm"
						type="default"
						:outline="true"
						:disabled="isSaved"
						><i class="fa-solid fa-pencil"></i
					></base-button>
					<base-button
						v-if="!newDoc"
						@click="newDoc = true"
						size="sm"
						type="default"
						:outline="true"
						:disabled="isSaved"
						><i class="fa-solid fa-pencil"></i
					></base-button>
				</div>
				<field-validate
					v-else
					:disabled="isSaved"
					v-show="$empty(file_inst?.file)"
					class="form-control"
					type="file"
					:name="
						form_id
							? `installarions[${form_id}].`
							: '' + 'file_document.base64'
					"
					rules="ext:pdf"
					:validateOnInput="true"
					label="documentación de la instalación"
					v-model="file_inst.file"
				/>
			</base-field>
		</div>
	</div>
</template>
<script>
	import { computed, ref, watch } from "@vue/runtime-core";
	import { useStore } from "vuex";
	import utils from "@/mixins/utils-mixin";
	import functions from "../../../utils/functions";
	
	export default {
		mixins: [utils],

		props: {
			file_document: {
				type: Object || Array,
			},
			file_auditor: {
				type: Object || Array,
			},
			auditable: {
				type: Number,
			},
			auditable_value: {
				type: Number,
			},
			name: {
				type: String,
			},
			periodicity: {
				type: String,
			},
			isSaved: {
				type: Boolean,
				default: false,
			},
			delegate_id: {
				type: Number,
				required: true,
			},
			form_id: {
				type: Number,
				default: null,
			},
			onlyForm: {
				type: Boolean,
				default: false,
			},
			firm_document: {
				type: Object || Array,
				default: null
			},
			auditor_document: {
				type: Object || Array,
				default: null
			},
		},
		setup(props, {emit}) {
			const store = useStore();
			const role = computed(() => {
				return store.getters.ROLE;
			});
			const params = computed(() => {
				return props.delegate_id ? `&delegate_id=${props.delegate_id}` : null
			})
			
			const file_inst = ref(props.file_document);
			const file_aud = ref(props.file_auditor);

			const newAuditor = computed(() => {
				return props.auditable && props.auditable != props.auditable_value;
			});
			const auditable_id = computed(() => {
				return props.auditable ? props.auditable : props.auditable_value
			})
			const newDoc = ref(false);

			const classes = computed(() => {
				const styles = "border rounded border-light px-4 py-2";
				return !props.onlyForm ? styles : "m-0";
			});

			watch(() => file_inst.value?.file, async (v) => {
				if (v) {
					file_inst.value.base64 = await functions.toBase64(v[0]) 
					file_inst.value.file_name = v[0].name 
				}else{
					file_inst.value.base64 = ""
					file_inst.value.file = null
					file_inst.value.file_name = null
				}
				emit('update:file_document', file_inst)
			})

			watch(() => file_aud.value?.file, async (v) => {
				if (v) {
					file_aud.value.base64 = await functions.toBase64(v[0]) 
					file_aud.value.file_name = v[0].name 
				}else{
					file_aud.value.base64 = null
					file_aud.value.file_name = null 
				}
				emit('update:file_auditor', file_aud)
			})

			return {
				role,
				classes,
				newDoc,
				newAuditor,
				file_inst,
				file_aud,
				auditable_id,
				params,
				functions: functions
			};
		},
	};
</script>