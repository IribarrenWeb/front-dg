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
					<th>Empresa</th>
					<th>Provincia</th>
					<th>Dirección</th>
					<th>Instalaciones</th>
					<th>Año</th>
					<th>Estado</th>
                    <th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.business.business_name }}
					</th>
					<td>
						{{ row.item.business.province.name }}
					</td>
					<td>
						{{ row.item.business.address }}
					</td>
                    <td>
						{{ row.item.installations_count }}
					</td>
                    <th>
						{{ row.item.period }}
					</th>
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
						<a href="#" class="btn btn-sm btn-default" @click="handleView(row.item)"><i class="fa-regular fa-eye"></i></a>
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
					"includes[]=business.province.city"+
                    "&counts[]=nonconformities"+
                    "&counts[]=installations"+
                    "&counts[]=audits"+
                    "&counts[]=audits_completed"
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
            handleView(item){
                let audits_completed = item.audits_count == item.audits_completed_count;
                let hasPendingCon = item.nonconformities_count == 0;
                if (!audits_completed || !hasPendingCon) {
                    this.$swal('No puedes realizar el informe', 'Aun no puedes realizar el informe ya que los datos estan incompletos o estan pendientes.', 'warning')
                    return;
                }
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
