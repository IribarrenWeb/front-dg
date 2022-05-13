<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Empleados {{ adr != null ? "ADR" : "" }}</h3>
				</div>
				<div class="col text-right">
					<a href="#" class="btn btn-sm btn-default" @click="handleAdd"
						>Agregar</a
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Dni</th>
					<th>Email</th>
					<th>Móvil</th>
					<th>Formación</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.name }}
					</th>
					<td>
						{{ row.item.last_name }}
					</td>
					<td>
						{{ row.item.email }}
					</td>
					<td>
						{{ row.item.phone_number }}
					</td>
					<td>
                        <div v-if="row.item.formation_document != null">
                            <span class="d-block">{{
                                this.formatDate(row.item.formation_document.document_date, "GB")
                            }}</span>
                            <a
                                href="#"
                                class="text-uppercase d-block"
                                @click.prevent="getDocument(row.item.formation_document.id)"
                            >
                                <i class="fa fa-file-pdf" aria-hidden="true"></i>
                                {{ row.item.formation_document.type.name }}
                            </a>
                        </div>
					</td>
					<td>
						<!-- <a href="#" class="btn btn-sm btn-default"><i class="fa-regular fa-eye"></i></a> -->
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
				@close="this.modal = false"
				@reload="index()"
				:installation_id="installation_id"
            ></form-employee>
		</modal>
	</div>
</template>
<script>
	import utils from "@/mixins/utils-mixin";
	import service from "@/store/services/model-service";
	import _ from "lodash";
    import FormEmployee from '../../components/forms/FormEmployee.vue';

	export default {
	components: { FormEmployee },
		mixins: [utils],
		name: "employees-table",
		props: {
			installation_id: {
				default: null,
			},
			adr: {
				default: null,
			},
		},
		data() {
			return {
				page: 1,
				tableData: {},
                action: 'registrar',
                modal: false,
				metaData: {},
			};
		},
		mounted() {
			this.index();
		},
		methods: {
			async index(page) {
				try {
					let params = "includes[]=documents.type";
					if (this.installation_id != null) {
						params += "&installation_id=" + this.installation_id;
					}
					if (this.adr != null) {
						params += "&adr=true" + this.installation_id;
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
            handleAdd(){
                this.modal = true
            },
            async handleChange(event) {
				if (event == this.page) {
					return;
				}

				this.index(event)
			},
		},
	};
</script>
<style></style>
