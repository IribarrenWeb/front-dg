<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">Proximas visitas</h4>
				</div>
				<div class="col text-right">
					<!-- <a href="#" class="btn btn-sm btn-default">Agregar</a> -->
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Tipo</th>
					<th>Instalación</th>
					<th>Provincia</th>
					<th>Consejero ADR</th>
					<th>Fecha</th>
					<th>Hora</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.type }}
					</th>
					<th scope="row">
						{{ row.item.inst }}
					</th>
					<td>
						{{ row.item.province }}
					</td>
					<td>
						{{ row.item.cons }}
					</td>
					<td>
						{{ row.item.date }}
					</td>
					<td>
						{{ row.item.hour }}
					</td>
					<td>
						<a href="#" class="btn btn-sm btn-default">Ver</a>
					</td>
				</template>
			</base-table>
		</div>
	</div>
</template>
<script>
	export default {
		name: "visits-table",
		data() {
			return {
				tableData: [
					{
						type: "Auditoria",
						inst: "LOGISTICS S.A",
						province: "",
						cons: "ALBERTO LOPEZ",
						date: "8/12/2020",
						hour: "7:00 am",
					},
					{
						type: "Auditoria",
						inst: "LOGISTICS S.A",
						province: "",
						cons: "ALBERTO LOPEZ",
						date: "8/12/2020",
						hour: "7:00 am",
					},
					{
						type: "Auditoria",
						inst: "LOGISTICS S.A",
						province: "",
						cons: "ALBERTO LOPEZ",
						date: "8/12/2020",
						hour: "7:00 am",
					},
				],
			};
		},
	};
</script>
<style></style>
