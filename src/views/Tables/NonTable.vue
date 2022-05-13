<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">No conformidades</h4>
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
						{{ row.item.inst }}
					</th>
					<th scope="row">
						{{ row.item.type }}
					</th>
					<th scope="row">
						{{ row.item.desc }}
					</th>
					<th scope="row">
						{{ row.item.date }}
					</th>
					<td>
						{{ row.item.priority }}
					</td>
					<td>
						{{ row.item.term }}
					</td>
					<td>
						<badge class="badge-dot mr-4" type="danger">
							<i :class="`bg-danger`"></i>
							<span class="status">{{ row.item.status }}</span>
						</badge>
					</td>
					<td>
						<a href="#" class="btn btn-sm btn-default"><i class="fa-regular fa-eye"></i></a>
					</td>
				</template>
			</base-table>
		</div>
	</div>
</template>
<script>
	export default {
		name: "non-table",
		data() {
			return {
				tableData: [
					{
						inst: "LOGISTICS S.A",
						type: "DOCUMENTAL",
						desc: "FALLA",
						date: "09/12/2020",
						priority: "URGENTE",
						term: "<1MES",
						status: "PENDIENTE",
					},
					{
						inst: "ANBER S.A",
						type: "DOCUMENTAL",
						desc: "FALLA",
						date: "09/12/2020",
						priority: "URGENTE",
						term: "<1MES",
						status: "PENDIENTE",
					},
					{
						inst: "PATROUS CO",
						type: "DOCUMENTAL",
						desc: "FALLA",
						date: "09/12/2020",
						priority: "URGENTE",
						term: "<1MES",
						status: "PENDIENTE",
					},
				],
			};
		},
	};
</script>
<style></style>
