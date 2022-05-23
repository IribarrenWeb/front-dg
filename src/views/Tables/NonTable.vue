<template>
	<div class="card shadow" :class="classes">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">No conformidades</h4>
				</div>
				<div class="col text-right">
                    <router-link v-if="dash" to="/audits/nonconformities" class="btn btn-sm btn-default">Ver todas</router-link>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Instalación</th>
					<th>Tipo</th>
					<th>Descripción</th>
					<th>Fecha actuación</th>
					<th>Prioridad</th>
					<th>Plazo</th>
					<th>Estado</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.installation.name }}
					</th>
					<th scope="row">
						{{ row.item.type.name }}
					</th>
					<th scope="row">
						{{ row.item.description }}
					</th>
					<th scope="row">
						<!-- {{ row.item.date }} -->
					</th>
					<td :class="`text-${row.item.priority.colour}`">
						{{ row.item.priority.name }}
					</td>
					<td>
						{{ row.item.priority.term }}
					</td>
					<td>
						<badge class="badge-dot mr-4" :type="row.item.status != 1 ? 'danger' : 'success'">
							<i :class="`bg-danger`"></i>
							<span class="status">{{ row.item.status ? 'Completado' : 'Pendiente' }}</span>
						</badge>
					</td>
					<td v-if="!dash">
						<!-- <a href="#" class="btn btn-sm btn-default"><i class="fa-regular fa-eye"></i></a> -->
					</td>
				</template>
			</base-table>
            <base-pagination
                v-if="!dash"
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
    import {isEmpty} from 'lodash';

	export default {
		name: "non-table",
        props: {
            dash: {
                type: Boolean,
                default: false
            },
            classes: {
                type: String
            }
        },
		data() {
			return {
				tableData: [],
				metaData: {},
				page: 1,
			};
		},
        mounted(){
            this.index()
        },
        methods: {
            async index(page = 1) {
				const resp = await service.getIndex(
					"non",
					page,
					"includes[]=installation"
				);
				if (!isEmpty(resp.data.data)) {
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
        },
	};
</script>
<style></style>
