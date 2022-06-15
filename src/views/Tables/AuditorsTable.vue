<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Auditores</h3>
				</div>
				<div class="col text-right">
					<a
						href="#"
						@click.prevent="handleAdd()"
						class="btn btn-sm btn-default"
						>Agregar</a
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Email</th>
					<th>Móvil</th>
					<th>Delegado</th>
					<th>Acciones</th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.user.full_name}}
					</th>
					<td>
						{{ row.item?.user.email }}
					</td>
					<td>
						{{ row.item?.phone_number }}
					</td>
					<td>
						{{ row.item?.delegate.user.full_name }}
					</td>
					<td class="d-flex">
						<a
							href="#"
							@click.prevent="handleView(row.item?.id)"
							class="btn btn-sm btn-default"
							><i class="fa-regular fa-eye"></i></a
						>
						<delete-button @deleted="getAuditors" model="auditor" :id="row.item.id"></delete-button>
					</td>
				</template>
			</base-table>
			<div v-if="tableData.length >= 1">
				<base-pagination
					:perPage="this.metaData.perPage"
					:value="this.page"
					@changePage="handleChange($event)"
					:total="this.metaData.total"
					align="center"
				></base-pagination>
			</div>
			<loader v-if="loader"></loader>
		</div>
		<Transition name="fade">
			<modal
				v-model:show="this.modal"
				model="auditor"
				:action="action"
				modalClasses="modal-xl"
				@close="action = 'Registrar'"
				v-if="this.modal"
			>
				<form-auditor
					:id="auditor_id"
					@closeModal="this.modal = false"
					@resetTable="getAuditors"
				>
				</form-auditor>
			</modal>
		</Transition>
	</div>
</template>
<script>
import DeleteButton from '../../components/Utils/DeleteButton.vue';
	import service from "../../store/services/model-service";
	export default {
	components: { DeleteButton },
		name: "auditors-table",
		data() {
			return {
				tableData: {},
				metaData: {},
				page: 1,
				modal: false,
				submit: false,
				loader: false,
				auditor_id: null,
				disabled: false,
				action: "Registrar",
			};
		},
		mounted() {
			this.getAuditors(this.page);
		},
		methods: {
			async getAuditors(page = 1) {
				try {
					const response = await service.getIndex(
						"auditor",
						page,
						`&includes[]=user&includes[]=delegate.user`
					);
					this.tableData = response.data.data;
					this.metaData = response.data.meta.page;
					this.page = this.metaData.currentPage;
				} catch (err) {
					console.log(err);
				}
			},
			async handleChange(event) {
                if (event != this.page) {
                    this.getAuditors(event);
                }
			},
			handleAdd() {
				this.auditor_id = null;
				this.disabled = false;
				this.auditor = {};
				this.modal = true;
			},
			async handleView(id) {
				this.auditor_id = id;
				this.action = "editar";
				this.disabled = true;
				this.modal = true;
			},
		},
		watch: {
			modal(newVal) {
				if (!newVal) {
					this.action = "Registrar";
				}
			},
		},
	};
</script>
<style></style>
