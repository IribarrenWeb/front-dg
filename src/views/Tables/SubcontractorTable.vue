<template>
	<div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
		<div
			class="card-header border-0"
			:class="type === 'dark' ? 'bg-transparent' : ''"
		>
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						Subcontratistas
					</h3>
				</div>
				<div class="col text-right">
					<base-button type="default" size="sm" @click="this.modal = true"
						>Agregar</base-button
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table
				class="table align-items-center table-flush"
				:class="type === 'dark' ? 'table-dark' : ''"
				:thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
				tbody-classes="list"
				:data="tableData"
			>
				<template v-slot:columns>
					<th>Servicio(s)</th>
					<th>Nombre</th>
					<th>DNI</th>
					<th>Email</th>
					<th>Móvil</th>
					<th>Fecha</th>
					<th></th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item.service }}
					</th>
					<td class="budget">{{ row.item.name }} {{ row.item.last_name }}</td>
					<td>
						{{ row.item.phone_number }}
					</td>
					<td>{{ row.item.email }}</td>
					<td>{{ row.item.documents[0].document_date }}</td>
					<td>
						<a href="#" @click.prevent="getDocument(row.item.documents[0].id)">
							DOCUMENTACION
						</a>
					</td>
					<td class="text-right">
						<a
							class="btn btn-danger btn-sm"
							href="#"
							@click.prevent="destroy(row.item.id)"
							>Eliminar</a
						>
					</td>
				</template>
			</base-table>
			<loader v-if="loader"></loader>

			<base-pagination
				:perPage="this.metaData.perPage"
				:value="this.page"
				@changePage="handleChange($event)"
				:total="this.metaData.total"
				align="center"
			>
			</base-pagination>
		</div>

		<modal
			v-if="this.modal"
			v-model:show="this.modal"
			modalClasses="modal-xl"
			model="subcontratistas"
		>
			<form-subcontractor
				@close="this.modal = false"
				@reload="getSubcontractors(page)"
				:installation_id="installation_id"
			></form-subcontractor>
		</modal>
	</div>
</template>
<script>
	import FormSubcontractor from "../../components/forms/FormSubcontractor.vue";
	import service from "../../store/services/model-service";
	import utils from "@/mixins/utils-mixin";

	export default {
		components: { FormSubcontractor },
		mixins: [utils],
		name: "subcontractor-table",
		props: {
			type: {
				type: String,
			},
			title: String,
			installation_id: {
				required: true,
				default: null,
			},
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				loader: false,
				page: 1,
				modal: false,
			};
		},
		mounted() {
			this.getSubcontractors(this.page);
		},
		methods: {
			async getSubcontractors(page) {
				let params = "includes[]=documents";

				if (this.installation_id != null) {
					params += "&installation_id=" + this.installation_id;
				}

				const resp = await service.getIndex("subcontractor", page, params);

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
				this.getSubcontractors(event, this.installation_id);
			},
			async destroy(id) {
				try {
					await service.destroy("subcontractor", id).then(() => {
						this.getSubcontractors();
					});
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>
<style></style>
