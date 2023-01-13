<template>
	<div>
		<div class="container-fluid mt--7">
			<!--Tables-->
			<documents-table :reload="reload" @reloaded="reload = false">
				<template v-slot:button>
					<div class="col text-right" v-if="$store.state.is_admin || $store.state.is_delegate || $store.state.is_business || ($store.state.is_auditor && $store.getters['profile/profile']?.business_id)">
						<a
							href="#"
							@click.prevent="handleAdd()"
							class="btn btn-sm btn-default"
							>Agregar</a
						>
					</div>
				</template>
			</documents-table>
			<!--End tables-->

			<Transition name="fade">
				<modal
					v-model:show="this.modal"
					model="documento"
					:action="action"
					modalClasses="modal-xxl"
					@close="action = 'Registrar'"
					v-if="this.modal"
				>
					<form-document
						:id="auditor_id"
						@close="modal = false"
						@reload="reload = true"
					>
					</form-document>
				</modal>
			</Transition>
		</div>
	</div>
</template>
<script>
	import FormDocument from '../components/Document/FormDocument.vue';
	import DocumentsTable from "../components/Document/DocumentsTable.vue";

	export default {
		components: { DocumentsTable, FormDocument },
		data() {
			return {
				modal: false,
				reload: false
			};
		},
		methods: {
			handleAdd() {
				this.modal = true
				// this.model.name = null;
				// this.model.file = null;
			},
		},
	};
</script>
<style></style>
