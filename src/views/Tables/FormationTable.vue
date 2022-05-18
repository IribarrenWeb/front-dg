<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Formaciones</h4>
				</div>
				<div class="col text-right">
					<a href="#" class="btn btn-sm btn-default" @click.prevent="handleAdd">Agregar</a>
				</div>
			</div>
		</div>

		<div class="table-responsive">
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
						{{ row.item.name }}
					</th>
					<td>
						{{ row.item.type.name }}
					</td>
                    <td>
						{{ row.item.duration }}
					</td>
					<td>
						{{ row.item.responsible.user.name }} {{ row.item.responsible.user.last_name }}
					</td>
					<td>
						<!-- <a href="#" class="btn btn-sm btn-default"><i class="fa-regular fa-eye"></i></a> -->
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
				@close="action = 'registrar'"
				modalClasses="modal-xl"
				model="formación"
			>
                <form-formation @reload="index" @close="this.modal = false"></form-formation>
			</modal>
		</div>
	</div>
</template>
<script>
import FormFormation from '../../components/forms/FormFormation.vue';
	import service from "../../store/services/model-service";
	export default {
	components: { FormFormation },
		name: "formation-table",
		data() {
			return {
				tableData: [],
				metaData: {},
				modal: false,
				action: "Registrar",
				page: 1,
				formation_id: {},
			};
		},
        mounted() {
			this.index(this.page);
        },
        methods: {
            async index(page = 1) {
				const resp = await service.getIndex(
					"formation",
					page,
					"includes[]=type&includes[]=responsible.user"
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
				this.getAudits(event);
			},
            handleAdd() {
				this.modal = true;
			},
        }
	};
</script>
<style></style>
