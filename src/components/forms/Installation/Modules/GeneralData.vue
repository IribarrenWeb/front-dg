<template>
	<div>
		<div class="row" :class="classes">
			<div class="col-12">
				<h4>Datos principales</h4>
			</div>
			<div class="col-lg-4">
				<base-field :name="form_id ? `installarions[${form_id}].` : '' + 'name'" label="Nombre de instalación">
					<field-validate
						:disabled="isSaved"
						type="text"
						class="form-control"
						:name="form_id ? `installarions[${form_id}].` : '' + 'name'"
						rules="required"
						label="Nombre"
						@input="$emit('update:name', $event.target.value)"
						:value="name"
					/>
				</base-field>
			</div>
			<div class="col-lg-4" v-if="role != 'auditor' && role != 'business'">
				<base-field :name="form_id ? `installarions[${form_id}].` : '' + 'auditable'" label="Auditor">
					<div v-if="auditable != null">
						<span class="mr-md-4 text-uppercase"
							>{{ auditable?.name }} {{ auditable?.last_name }}</span
						>
						<base-button
							@click="$emit('update:auditable', null)"
							size="sm"
							type="default"
							:outline="true"
							:disabled="isSaved"
							><i class="fa-solid fa-pencil"></i
						></base-button>
					</div>
					<div v-else>
						<field-validate
							:name="form_id ? `installarions[${form_id}].` : '' + 'auditable'"
							label="Auditor"
							rules=""
							@input="$emit('update:auditable', $event.target.value)"
							:value="auditable"
						>
							<async-select
								@selected="$emit('update:auditable', $event)"
								:roles="[2, 3]"
								:disabled="isSaved"
								:params="`&delegate_id=${delegate_id}`"
							>
							</async-select>
						</field-validate>
					</div>
				</base-field>
			</div>
			<div class="col-lg-4" v-if="role != 'business'">
				<base-field :name="form_id ? `installarions[${form_id}].` : '' + 'periodicy'" label="Periodicidad de visitas">
					<field-validate
						:disabled="isSaved"
						class="form-control"
						as="select"
						:name="form_id ? `installarions[${form_id}].` : '' + 'periodicy'"
						rules=""
						label="periodicidad"
						@input="$emit('update:periodicity', $event.target.value)"
						:value="periodicity"
					>
						<option value="" selected>Selecciona una periodicidad</option>
						<option value="ANUAL">ANUAL</option>
						<option value="BIANUAL">BIANUAL</option>
					</field-validate>
				</base-field>
			</div>
			<div class="col-lg-6">
				<base-field name="file_document.base64" label="Documentación de la instalación">
					<div v-if="file_document.length >= 1">
						<span class="mr-md-4">{{ file_document[0].name }}</span>
						<base-button
							@click="$emit('update:file_document', null)"
							size="sm"
							type="default"
							:outline="true"
							:disabled="isSaved"
							><i class="fa-solid fa-pencil"></i
						></base-button>
					</div>
					<field-validate
						:disabled="isSaved"
						v-show="$empty(file_document)"
						class="form-control"
						type="file"
						:name="form_id ? `installarions[${form_id}].` : '' + 'file_document.base64'"
						rules="ext:pdf"
						:validateOnInput="true"
						label="documentación de la instalación"
						@change="$emit('update:file_document', $event.target.files)"
					/>
				</base-field>
			</div>
		</div>
	</div>
</template>
<script>
import { computed } from '@vue/runtime-core';
	import { useStore } from "vuex";
	import AsyncSelect from "../../../AsyncSelect.vue";
	export default {
		components: { AsyncSelect },
		props: {
			file_document: {
				type: Object || Array,
			},
			auditable: {
				type: Object || Array,
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
				type:Number,
				default: null
			},
			onlyForm: {
				type: Boolean,
				default: false
			}
		},
		setup(props) {
			const store = useStore();
            const role = computed(() => {
                return store.getters.ROLE
            })
			const classes = computed(() => {
				const styles = 'border rounded border-light px-4 py-2'
                return !props.onlyForm ? styles : 'm-0' 
            })

            return {
                role,
				classes
            }
		},
	};
</script>