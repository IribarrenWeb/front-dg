<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Informes anuales</h4>
				</div>
				<div class="col text-right">
					<!-- <a href="#" class="btn btn-sm btn-default">Agregar</a> -->
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Instalación</th>
					<th>Consejero ADR</th>
					<th>Provincia</th>
					<th>Dirección</th>
					<th>Fecha auditoria</th>
					<th>Estado</th>
                    <th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.installation.name }}
					</th>
					<td>
						{{ row.item.installation.auditable.user.name }} {{ row.item.installation.auditable.user.last_name }}
					</td>
					<td>
						{{ row.item.installation.province.name }}
					</td>
					<td>
						{{ row.item.installation.address }}
					</td>
                    <td>
						{{ row.item.audit.date_end }}
					</td>
                    <td>
						<badge
							class="badge-dot mr-4"
							:type="setStatusType(row.item.status)"
						>
							<i :class="`bg-${setStatusType(row.item.status)}`"></i>
							<span class="status">{{ row.item.status }}</span>
						</badge>
					</td>
					<td>
						<a href="#" class="btn btn-sm btn-default"><i class="fa-regular fa-eye"></i></a>
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
		name: "informs-table",
        props: {
            dash: {
                type:Boolean,
                default: false
            },
        },
		data() {
			return {
				tableData: [],
                metaData: {},
				page: 1,
			};
		},
        mounted() {
            this.index();
        },
        methods: {
            async index(page = 1){
                const resp = await service.getIndex(
					"report",
					page,
					"includes[]=installation.province.city"+
                    "&includes[]=installation.auditable.user"+
                    "&includes[]=audit",
				);
				if (!isEmpty(resp.data.data)) {
					this.tableData = resp.data.data;
					this.metaData = resp.data.meta.page;
					this.page = page;
				}
            },
            async handleChange(event) {
				if (event == this.page) {
					return;
				}
				this.index(event);
			},
            setStatusType(status) {
				let type = "";
				switch (status) {
					case "PENDIENTE":
						type = "danger";
						break;
					case "POR REVISAR":
						type = "warning";
						break;
					case "COMPLETADO":
						type = "success";
						break;

					default:
						break;
				}
				return type;
			},
        },
	};
</script>
<style></style>
