<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Asignaciones</h4>
				</div>
				<div class="col text-right">
					<!-- <a href="#" class="btn btn-sm btn-default" @click.prevent="handleAdd">Agregar</a> -->
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Formación</th>
					<th>Responsable</th>
					<th>Empresa</th>
					<th>Instalación</th>
					<th>Empleados</th>
					<th>Fecha</th>
					<th>Estatus</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row" class="text-uppercase">
						{{ row.item?.formation.name }}
					</th>
                    <th scope="row" class="text-uppercase">
						{{ row.item?.formation.facilitable.user.full_name }}
					</th>
					<td class="text-uppercase">
						{{ row.item?.installation.company.name }}
					</td>
                    <td class="text-uppercase">
						{{ row.item?.installation.name }}
					</td>
                    <td>
                        {{ row.item?.employees_count }}
                    </td>
                    <td>
                        {{ row.item?.date }}
                    </td>
					<td>
                        <badge
							class="badge-dot mr-4"
							:type="row.item?.status ? 'success' : 'danger'"
						>
							<i :class="`bg-danger`"></i>
							<span class="status">{{ row.item?.status ? 'COMPLETADO' : 'PENDIENTE' }}</span>
						</badge>
					</td>
                    <td>
                        <base-button type="primary" @click="toSchedule(row.item?.id)" size="sm">Re-agendar</base-button>
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
		</div>
	</div>
</template>
<script>
	import service from "../../store/services/model-service";
	export default {
        props: {
            reload: {
                type: Boolean,
                defaul: false
            }
        },
		name: "training-table",
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
					"training",
					page,
					"includes[]=installation.company&counts[]=employees&includes[]=formation.facilitable.user"
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
            handleAssign(){
                this.modal = true;
            },
            handleClose() {
                this.modal = false;
            },
            async toSchedule(id){
                await this.$store.dispatch('toSchedule', {model:'trainings',id: id, name: 'formacion'})
                this.index()
            }
        },
        watch: {
            reload(newVal){
                if (newVal == true) {
                    console.log(newVal);
                    this.index()
                    this.$emit('reloaded')
                }
            },
        }
	};
</script>
<style></style>
