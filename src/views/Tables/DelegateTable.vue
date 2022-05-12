<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Delegados</h3>
				</div>
				<div class="col text-right">
					<a
						href="#"
						class="btn btn-sm btn-default"
						@click.prevent="handleAdd()"
						>Agregar</a
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Apellido</th>
					<th>Email</th>
					<th>Móvil</th>
					<th>Acciones</th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.user.name }}
					</th>
					<td>
						{{ row.item.user.last_name }}
					</td>
					<td>
						{{ row.item.user.email }}
					</td>
					<td>
						{{ row.item.phone_number }}
					</td>
					<td>
						<a
							href="#"
							class="btn btn-sm btn-default"
							@click.prevent="handleView(row.item.id)"
							>Ver</a
						>
					</td>
				</template>
			</base-table>
			<div>
				<base-pagination
					:perPage="this.metaData.perPage"
					:value="this.page"
					@changePage="handleChange($event)"
					:total="this.metaData.total"
					align="center"
				></base-pagination>
			</div>
		</div>

		<Transition name="fade">
			<modal
				v-model:show="this.modal"
				model="delegado"
				:action="action"
				@close="action = 'Registrar'"
				modalClasses="modal-xl"
				v-if="this.modal"
			>
				<form-delegate
					:id="delegate_id"
					@closeModal="this.modal = false"
					@resetTable="getDelegates"
				>
				</form-delegate>

				<template v-slot:footer>
					<!-- <base-button type="default" @click="submit = true">Save changes</base-button>
          <base-button type="link" class="ml-auto" @click="this.modal = false"
            >Close
          </base-button> -->
				</template>
			</modal>
		</Transition>
	</div>
</template>

<script>
	import service from "../../store/services/model-service";

	export default {
		name: "delegate-table",
		data() {
			return {
				tableData: {},
				metaData: {},
				page: 1,
				modal: false,
				submit: false,
				delegate_id: null,
				disabled: false,
				action: "Registrar",
			};
		},
		mounted() {
			this.getDelegates(this.page);
		},
		methods: {
			async getDelegates(page = 1) {
				const response = await service.getIndex(
					"delegate",
					page,
					`&includes[]=user`
				);
				this.page = this.metaData.currentPage;
				this.tableData = response.data.data;
				this.metaData = response.data.meta.page;
			},
			async handleChange() {
				this.getDelegates();
			},
			async handleView(id) {
				this.delegate_id = id;
				this.action = "editar";
				this.disabled = true;
				this.modal = true;
			},
			handleAdd() {
				this.delegate_id = null;
				this.disabled = false;
				this.delegate = {};
				this.modal = true;
			},
		},
		watch: {
			modal(newVal) {
				if (newVal == false) {
					this.action = "Registrar";
				}
			},
		},
	};
</script>
<style></style>
