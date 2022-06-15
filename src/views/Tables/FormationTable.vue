<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Formaciones</h4>
				</div>
				<div v-if="!this.$store.state.is_auditor" class="col text-right">
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
						{{ row.item?.name }}
					</th>
					<td>
						{{ row.item?.type.name }}
					</td>
                    <td>
						{{ row.item?.duration }}
					</td>
					<td>
						{{ row.item?.responsible.user.name }} {{ row.item?.responsible.user.last_name }}
					</td>
					<td>
						<a v-if="!this.$store.state.is_auditor" href="#" class="btn btn-sm btn-default" @click="handleAssign(row.item?.id)">Asignar</a>
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
                <form-formation v-if="!assign" @reload="index" @close="handleClose"></form-formation>
                <form-formation-assign v-else @reload="handleReload" @close="handleClose" :formation_id="formation_id"></form-formation-assign>
			</modal>
		</div>
	</div>
</template>
<script>
import FormFormation from '../../components/forms/FormFormation.vue';
import FormFormationAssign from '../../components/forms/FormFormationAssign.vue';
	import service from "../../store/services/model-service";
	export default {
	components: { FormFormation, FormFormationAssign },
		name: "formation-table",
		data() {
			return {
				tableData: [],
				metaData: {},
				modal: false,
				action: "Registrar",
				page: 1,
				formation_id: null,
                assign: false
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
				this.index(event);
			},
            handleAdd() {
				this.modal = true;
			},
            handleAssign(id){
                this.formation_id = id;
                this.assign = true;
                this.action = 'Asignar';
                this.modal = true;
            },
            handleClose() {
                this.action = 'registrar';
                this.modal = false;
                this.assign = false;
            },
            handleReload(){
                console.log('hola recargandoooooo');
                this.$emit('reloadTraining')
            },
            
        }
	};
</script>
<style></style>
