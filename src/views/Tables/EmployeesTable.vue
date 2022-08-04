<template>
	<div :class="`card shadow ${classes}`">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Empleados {{ ROLE != 'business' ? "ADR" : "" }}</h3>
				</div>
				<div class="col text-right">
					<a href="#" class="btn btn-sm btn-default" @click="handleAdd"
						>Agregar</a
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<div class="card-header border-0 pl-2 py-3 bac-ligth mx-0 row align-items-center" v-if="$store.state.is_business">
				<installation-filter
					class="col-md-3"
					v-model:clear="clear"
					@updated="handleFilter('installation', $event)"
				></installation-filter>
				<select-filter
					class="col-md-3"
					placeholder="Mercancias peligrosas"
					v-model:clear="clear"
					:options="[{label: 'Si',value:'true'},{label:'No',value:'false'}]"
					@updated="handleFilter('adr', $event)"
				/>
				<div class="col-md-2">
					<base-button
						size="sm"
						@click="(params_filter = params), index(page), (clear = true)"
						>Borrar filtros</base-button
					>
				</div>
			</div>
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th v-if="isClient">Instalación</th>
					<th>Nombre</th>
					<th>DNI</th>
					<th>Email</th>
					<th v-if="!isClient">Móvil</th>
					<th v-if="isClient">Cargo</th>
					<th v-if="isClient">Mercancías peligrosas</th>
					<th>Formación</th>
					<th></th>
				</template>

				<template v-slot:default="row">
                    <th v-if="isClient" scope="row">
						{{ row.item?.installation.name }}
					</th>
					<th scope="row">
						{{ row.item?.name }} {{ row.item?.last_name }}
					</th>
					<td>
						{{ row.item?.dni }}
					</td>
					<td>
						{{ row.item?.email }}
					</td>
					<td v-if="!isClient">
						{{ row.item?.phone_number }}
					</td>
                    <td v-if="isClient">
						{{ row.item?.position }}
					</td>
                    <td v-if="isClient">
						{{ row.item?.is_dangerous_goods ? 'SI' : 'NO' }}
					</td>
					<td>
						<div v-if="row.item.last_formation">
							<span class="d-block">{{
								this.formatDate(row.item?.last_formation.formation_date, "GB")
							}}</span>
							<a
								href="#"
								class="text-uppercase d-block"
								@click.prevent="openFormation(row.item?.last_formation)"
							>
								<i class="fa fa-file-pdf" aria-hidden="true"></i>
								{{ row.item?.last_formation?.document_name }}
							</a>
						</div>
						<div v-else>No procede</div>
					</td>
					<td class="d-flex">
						<a href="#" class="btn btn-sm btn-default" @click="employee_id = row.item?.id, modal = true"><i class="fa-regular fa-eye"></i></a>
						<delete-button model="employee" :id="row.item?.id" @deleted="index"></delete-button>
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
		<modal
			v-if="this.modal"
			v-model:show="this.modal"
			:action="action"
			@close="action = 'registrar'"
			modalClasses="modal-xl"
			model="empleado"
		>
			<form-employee
				@close="this.modal = false, employee_id = null"
				@reload="index(), this.$emit('reload_dash')"
                :employee_id="employee_id"
				:driver="driver"
				:installation_id="installation_id"
			></form-employee>
		</modal>
	</div>
</template>
<script>
	import utils from "@/mixins/utils-mixin";
	import service from "@/store/services/model-service";
	import _ from "lodash";
	import FormEmployee from "../../components/forms/Employee/FormEmployee.vue";
    import { mapGetters } from 'vuex';
	import DeleteButton from '../../components/Utils/DeleteButton.vue';
	import InstallationFilter from '../../components/filters/InstallationFilter.vue';
	import SelectFilter from '../../components/filters/SelectFilter.vue';

	export default {
		components: { FormEmployee, DeleteButton, InstallationFilter, SelectFilter },
		mixins: [utils],
		name: "employees-table",
		props: {
			installation_id: {
				default: null,
				required: false,
			},
			adr: {
				type: Boolean,
				default: false,
			},
			driver: {
				type: Boolean,
				required: false,
				default: null,
			},
			classes: {
				type: String,
			},
            title: {}
		},
		data() {
			return {
				page: 1,
				tableData: {},
				action: "registrar",
				modal: false,
				metaData: {},
                employee_id: null,
				params: "includes[]=documents.type&includes[]=installation",
				params_filter: null,
				clear: false
			};
		},
		mounted() {
			// this.index();
		},
		methods: {
			async index(page) {
				try {
					if (this.params_filter == null) {
						this.params_filter = this.params
					}

					let params = this.params_filter;
					
					if (this.installation_id != null) {
						params += "&installation_id=" + this.installation_id;
					}
					if (this.ROLE != 'business') {
						params += "&adr_id=true";
					}
					if (this.driver != null) {
						params += "&driver=true";
					}

					const res = await service.getIndex("employee", page, params);
					let data = res.data.data;
					let employees = _.map(data, (emp) => {
						let f_doc = null;
						_.forEach(emp.documents, (doc) => {
							if (doc.type.name == "CERTIFICADO") {
								f_doc = doc;
							}
						});
						emp.formation_document = f_doc;
						return emp;
					});
					this.tableData = employees;
					this.metaData = res.data.meta.page;
					// this.page = this.metaData.currentPage;
				} catch (err) {
					console.log(err);
				}
			},
			handleAdd() {
				this.modal = true;
			},
			async handleChange(event) {
				if (event == this.page) {
					return;
				}

				this.index(event);
			},
			handleFilter(type = 'delegate', value){
				console.log(value, type);
				if (!this.$empty(value) || value >= 1) {
					this.params_filter += `&${type}_id=`+value
					this.index(this.page)
				}else{
					this.params_filter = this.params
					this.index(this.page)
				}
			},
			async deleteEmployee(id) {
				try {
					await service.destroy("employee", id);
					this.index()
				} catch (err) {
					console.log(err);
				}
			},
			openFormation(formation) {
				if (formation.dg_formation) {
                    window.open(formation.link);
				}else{
					this.getDocument(formation?.data?.id)
				}
			}
		},
        computed: {
            isClient(){
                return this.ROLE == 'business' && this.driver == null
            },
            ...mapGetters(['ROLE'])
        },
		watch: {
			ROLE: {
				handler(val){
					if (val) {
						this.index()
					}
				},
				immediate: true
			}
		}
	};
</script>
<style></style>
