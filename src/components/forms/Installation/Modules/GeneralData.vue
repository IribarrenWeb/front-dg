<template>
	<div>
		<div class="row border rounded border-light px-4 py-2">
			<div class="col-12">
				<h4>Datos principales</h4>
			</div>
			<div class="col-lg-4">
				<base-field name="name" label="Nombre de instalación">
					<field-validate
						:disabled="isSaved"
						type="text"
						class="form-control"
						name="name"
						rules="required"
						label="Nombre"
						@input="$emit('update:name', $event.target.value)"
						:value="name"
					/>
				</base-field>
			</div>
			<div class="col-lg-4" v-if="role != 'auditor' && role != 'business'">
				<base-field name="auditable" label="Auditor">
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
							name="auditable"
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
				<base-field name="periodicy" label="Periodicidad de visitas">
					<field-validate
						:disabled="isSaved"
						class="form-control"
						as="select"
						name="periodicy"
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
				<base-field name="file_document" label="Alta consejero ADR">
					<div v-if="file_document.length >= 1">
						<span class="mr-md-4">{{ file_document[0].name }}</span>
						<base-button
							@click="$emit('update:file_document', [])"
							size="sm"
							type="default"
							:outline="true"
							:disabled="isSaved"
							><i class="fa-solid fa-pencil"></i
						></base-button>
					</div>
					<field-validate
						:disabled="isSaved"
						v-show="file_document.length < 1"
						class="form-control"
						type="file"
						name="file_document"
						rules="ext:pdf"
						:validateOnInput="true"
						label="alta consejero ADR"
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
		},
		setup() {
			const store = useStore();
            const role = computed(() => {
                return store.getters.ROLE
            })

            return {
                role
            }
		},
	};
</script>