<template>
	<div class="card shadow" :class="classes">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h4 class="mb-0">No conformidades</h4>
				</div>
				<div class="col text-right">
					<router-link
						v-if="dash"
						to="/audits/nonconformities"
						class="btn btn-sm btn-default"
						>Ver todas</router-link
					>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Instalación</th>
					<th>Tipo</th>
					<th>Descripción</th>
					<th v-if="!dash">Fecha actuación</th>
					<th>Prioridad</th>
					<th>Plazo</th>
					<th>Estado</th>
					<th v-if="!dash"></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.installation.name }}
					</th>
					<th scope="row">
						{{ row.item?.type.name }}
					</th>
					<td>
						{{ row.item?.description }}
					</td>
					<td v-if="!dash">
						{{ row.item?.action ? row.item?.action.date_end : 'SIN ACTUACIÓN' }}
					</td>
					<td :class="`text-${row.item?.priority.colour}`">
						{{ row.item?.priority.name }}
					</td>
					<td>
						{{ row.item?.priority.term }}MESES
					</td>
					<td>
						<badge
							class="badge-dot mr-4"
							:type="SET_STATUS(row.item?.status)"
						>
							<i :class="`bg-${SET_STATUS(row.item?.status)}`"></i>
							<span class="status">{{ row.item?.status }}</span>
						</badge>
					</td>
					<td v-if="!dash">
						<a href="#" v-if="row.item?.status == 'PENDIENTE' && ROLE == 'business'" @click="modal = true, selected_non = row.item" class="btn btn-sm btn-default"><i class="fa-regular fa-circle-check"></i></a>
						<a href="#" v-if="row.item?.status == 'POR REVISAR' && ROLE != 'business'" @click="modal = true, selected_non = row.item" class="btn btn-sm btn-default"><i class="fa-regular fa-circle-check"></i></a>
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
		<modal
			v-if="this.modal"
			v-model:show="this.modal"
			modalClasses="modal-xl"
			model="actuación de no conformidad"
		>
			<form-action :role="ROLE" @close="modal = false" :nonconformity="selected_non" :show="ROLE != 'business'" @reload="index(page)"></form-action>
		</modal>
	</div>
</template>
<script>
	import service from "../../store/services/model-service";
	import { isEmpty } from "lodash";
    import FormAction from '../../components/forms/FormAction.vue';
    import { mapGetters } from 'vuex';

	export default {
	components: { FormAction },
		name: "non-table",
		props: {
			dash: {
				type: Boolean,
				default: false,
			},
			classes: {
				type: String,
			},
		},
		data() {
			return {
				tableData: [],
				metaData: {},
				page: 1,
                modal: false,
                selected_non: null
			};
		},
		mounted() {
			this.index();
		},
		methods: {
			async index(page = 1) {
                let params = "includes[]=installation&includes[]=audit";
                
                if (this.ROLE != 'business' && !this.dash) {
                    params += '&includes[]=action.responsible'
                }

				if (this.dash) {
					params += "&status=false";
				}

				const resp = await service.getIndex(
					"non",
					page,
					params
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
        computed: {
            ...mapGetters(['SET_STATUS', 'ROLE']),
        }
	};
</script>
<style></style>
