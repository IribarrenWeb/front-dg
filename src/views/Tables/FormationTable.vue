<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Formaciones</h4>
				</div>
				<div class="col text-right">
					<a href="#" class="btn btn-sm btn-default" @click.prevent="handleAdd"
						>Agregar</a
					>
				</div>
			</div>
		</div>

		<div
			class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row align-items-center"
		>
			<div class="col-md-3 filter">
				<async-select
					placeholder="Selecciona responsable..."
					v-model:clear="clear"
					@updated="handleFilter('facilitable', $event.id)"
					v-if="!$store.state.is_auditor"
					:roles="[2, 3]"
				></async-select>
			</div>
			<select-filter
				class="col-md-3"
				v-model:clear="clear"
				:options="[
					{ label: 'Online', value: 1 },
					{ label: 'Presencial', value: 2 },
				]"
				@updated="handleFilter('type', $event)"
			/>
			<div class="col-md-2">
				<base-button
					size="sm"
					@click="(params_filter = params), index(page), (clear = true)"
					>Borrar filtros</base-button
				>
			</div>
		</div>
		<div  class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Formación</th>
					<th>Modalidad</th>
					<th>Duración</th>
					<th>Responsable</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.name }}
					</th>
					<td>
						{{ row.item?.type.name }}
					</td>
					<td>
						{{ row.item?.duration }}
					</td>
					<td>
						{{ row.item?.facilitable.user.full_name }}
					</td>
					<td>
						<base-dropdown
							v-if="!row.item?.status"
							class="dropdown audit-drop"
							position="right"
							:direction="row.idx == 0 || row.idx == 1 ? 'down' : 'up'"
						>
							<template v-slot:title>
								<a
									class="btn btn-sm btn-icon-only text-light"
									role="button"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									<i class="fas fa-ellipsis-v"></i>
								</a>
							</template>
							<a
								class="dropdown-item"
								href="#"
								@click="handleAssign(row.item?.id)"
								>Asignar</a
							>
							<a
								class="dropdown-item"
								href="#"
								@click="handleDelete(row.item?.id)"
								>Eliminar</a
							>
							<a
								class="dropdown-item"
								href="#"
								v-if="!row.item?.status"
								@click="handleView(row.item)"
								>Detalles</a
							>
							
						</base-dropdown>
					</td>
				</template>
			</base-table>
			<base-pagination
				:perPage="this.metaData.perPage"
				:value="this.page"
				@changePage="handleChange($event)"
				:total="this.metaData.total"
				align="center"
			>
			</base-pagination>

			<modal
				v-if="this.modal"
				v-model:show="this.modal"
				:action="action"
				@close="action = 'registrar',assign = false"
				modalClasses="modal-xl"
				model="formación"
			>
				<component :is='component'
					@reload="handleReload"
					@close="handleClose"
					:formation_id="formation_id"
				/>
			</modal>
		</div>
	</div>
</template>
<script>
	import AsyncSelect from "../../components/AsyncSelect.vue";
	import SelectFilter from "../../components/filters/SelectFilter.vue";
	import FormFormation from "../../components/forms/FormFormation.vue";
	import FormFormationAssign from "../../components/forms/FormFormationAssign.vue";
	import service from "../../store/services/model-service";
	export default {
		components: { FormFormation, FormFormationAssign, SelectFilter, AsyncSelect },
		name: "formation-table",
		data() {
			return {
				tableData: [],
				metaData: {},
				modal: false,
				action: "Registrar",
				page: 1,
				formation_id: null,
				assign: false,
				clear: false,
				params: "includes[]=type&includes[]=facilitable.user",
				params_filter: null,
			};
		},
		mounted() {
			this.index(this.page);
		},
		computed: {
			component() {
				return !this.assign ? "form-formation" : "form-formation-assign"
			}
		},
		methods: {
			async index(page = 1) {
				if (this.params_filter == null) {
					this.params_filter = this.params;
				}

				const resp = await service.getIndex(
					"formation",
					page,
					this.params_filter
				);
				if (typeof resp.data.data != "undefined") {
					this.tableData = resp.data.data;
					this.metaData = resp.data.meta.page;
					this.page = this.metaData.currentPage;
				}
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.index(event);
			},
			handleFilter(type, value) {
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=` + value;
					this.index(this.page);
				} else {
					this.params_filter = this.params;
					this.index(this.page);
				}
			},
			handleAdd() {
				this.modal = true;
				this.formation_id = null;
			},
			handleView(item) {
				this.modal = true;
				this.formation_id = item.id 
				this.action = 'editar';
			},
			handleAssign(id) {
				this.formation_id = id;
				this.assign = true;
				this.action = "Asignar";
				this.modal = true;
			},
			handleClose() {
				this.action = "registrar";
				this.modal = false;
				this.assign = false;
			},
			async handleDelete(id) {
				try {
					await this.$store.dispatch('delete', {model: 'formation', id: id})
					this.index(this.page);
				} catch (error) {
					console.log(error);
				}
			},
			handleReload() {
				if (this.assign) {
					this.$emit("reloadTraining");
				}else{
					this.index()
				}
			},
		},
	};
</script>
<style></style>
