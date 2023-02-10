<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Formaciones</h3>
				</div>
				<slot name="button"></slot>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Nombre</th>
					<th>Modalidad</th>
					<th>Responsable</th>
					<th>Fecha de culminación</th>
					<th>Certificado</th>
				</template>

				<template v-slot:default="row">
					<!-- <th scope="row">
						<a :href="row.item.link" target="_blank">{{
							row.item?.doc_name
						}}</a>
					</th> -->
					<td>
						{{ row.item?.formation?.name }}
					</td>
					<td>
						{{ row.item?.formation?.type.name }}
					</td>
					<td>
						{{ row.item?.formation?.facilitable?.user?.full_name }}
					</td>
					<td>{{ row.item?.date }}</td>
					<td>
						<!-- <a :href="row.item?.link_certificate + '/' + id" target="_blank"> -->
						<a @click.prevent="$store.dispatch('generatePdf',`${row.item?.link_certificate}/${id}`)">
							CERTIFICADO
						</a>
					</td>
				</template>
			</base-table>
			<!-- <div v-if="tableData.length >= 1">
				<base-pagination
					:perPage="this.metaData.perPage"
					:value="this.page"
					@changePage="handleChange($event)"
					:total="this.metaData.total"
					align="center"
				></base-pagination>
			</div> -->
			<!-- <loader v-if="loader"></loader> -->
		</div>
	</div>
</template>
<script>
	// import service from "../../store/services/model-service";
	export default {
		name: "documents-table",
		props: ["reload", "tableData", "id"],
		data() {
			return {
				metaData: {},
				page: 1,
				submit: false,
				loader: false,
				action: "Registrar",
			};
		},
		mounted() {
			// this.getDocuments(this.page);
		},
		methods: {
			// async getDocuments(page = 1) {
			// 	try {
			// 		const response = await service.getIndex("documents", page,'includes[]=type&includes[]=business.user');
			// 		// this.tableData = response.data.data;
			// 		this.metaData = response.data.meta.page;
			// 		this.page = this.metaData.currentPage;
			// 	} catch (err) {
			// 		console.log(err);
			// 	}
			// },
			// async handleChange(event) {
			// 	if (event != this.page) {
			// 		this.getDocuments(event);
			// 	}
			// },
		},
		watch: {
			// modal(newVal) {
			// 	if (!newVal) {
			// 		this.action = "Registrar";
			// 	}
			// },
			// reload(val) {
			// 	if (val) {
			// 		this.getDocuments(this.page);
			// 		this.$emit("reloaded");
			// 	}
			// },
		},
	};
</script>
<style></style>
