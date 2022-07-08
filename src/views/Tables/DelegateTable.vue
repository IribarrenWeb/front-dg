<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Delegación</h3>
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
			<div class="card-header border-0 pl-2 py-3 bac-ligth row" v-if="$store.state.is_admin">
				<city-filter class="col-md-3" v-model:clear="clear" @updated="handleFilter('city',$event)"></city-filter>
				<div class="col-md-2">
					<base-button size="sm" @click="params_filter = params,getDelegates(),clear = true">Borrar filtros</base-button>
				</div>
			</div>
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Email</th>
					<th>Móvil</th>
					<th>Ciudad</th>
					<th>Acciones</th>
				</template>

				<template v-slot:default="row">
					<th scope="row" class="text-uppercase">
						{{ row.item?.user.full_name }}
					</th>
					<td>
						{{ row.item?.user.email }}
					</td>
					<td>
						{{ row.item?.phone_number }}
					</td>
					<td>
						{{ row.item?.address?.city }}
					</td>
					<td class="d-flex">
						<a
							href="#"
							class="btn btn-sm btn-default"
							@click.prevent="handleView(row.item?.id)"
							><i class="fa-regular fa-eye"></i></a
						>
						<delete-button @deleted="getDelegates" model="delegate" :id="row.item.id"></delete-button>
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
import CityFilter from '../../components/filters/CityFilter.vue';
import DeleteButton from '../../components/Utils/DeleteButton.vue';
	import service from "../../store/services/model-service";

	export default {
	components: { DeleteButton, CityFilter },
		name: "delegate-table",
		data() {
			return {
				tableData: {},
				metaData: {},
				page: 1,
				clear: false,
				modal: false,
				submit: false,
				delegate_id: null,
				disabled: false,
				action: "Registrar",
				params: `&includes[]=user&includes[]=province`,
				params_filter: null
			};
		},
		mounted() {
			this.params_filter = this.params
			this.getDelegates(this.page);
		},
		methods: {
			async getDelegates(page = 1) {
				const response = await service.getIndex(
					"delegate",
					page,
					this.params_filter
				);
				this.tableData = response.data.data;
				this.metaData = response.data.meta.page;
			},
			async handleChange(event) {
                if (event != this.page) {
                    this.page = event
                    this.getDelegates(event);
                }
			},
			async handleView(id) {
				this.delegate_id = id;
				this.action = "editar";
				this.disabled = true;
				this.modal = true;
			},
			handleFilter(type, value){
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=`+value
					this.getDelegates(null)
				}else{
					this.params_filter = this.params
					this.getDelegates(null)
				}
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
