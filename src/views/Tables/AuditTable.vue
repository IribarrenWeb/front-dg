<template>
	<div class="card shadow" :class="classes">
		<div class="card-header border-0" :class="classes">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
						{{ title }}
					</h3>
				</div>
				<div class="col text-right">
					<base-button v-if="!$store.state.is_business" type="default" size="sm">Iniciar auditoria</base-button>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table class="table align-items-center table-flush" :class="type === 'dark' ? 'table-dark' : ''"
				:thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'" tbody-classes="list" :data="tableData">
				<template v-slot:columns>
					<th>Empresa</th>
					<th>Instalacion</th>
					<th>Nombre</th>
					<th>Provincia</th>
					<th>Ultima auditoria</th>
					<th>Estado</th>
					<th>Hora y fecha</th>
					<th v-if="ROLE != 'business'"></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						<div class="media align-items-center">
							<a href="#" class="avatar rounded-circle mr-3">
								<img alt="Installation images" :src="baseImage" />
							</a>
							<div class="media-body">
								<span class="name mb-0 text-sm">{{
										row.item?.installation.company.user.full_name
								}}</span>
							</div>
						</div>
					</th>
					<td>
						{{row.item?.installation.name}}
					</td>
					<td class="budget">
						<!-- AUDITORIA2022 -->
						{{ row.item?.name }}
					</td>
					<td>
						{{ row.item?.installation?.province?.name }}
					</td>
					<td>Sin datos</td>
					<td>
						<badge class="badge-dot mr-4" :type="setStatusType(row.item?.status)">
							<i :class="`bg-${setStatusType(row.item?.status)}`"></i>
							<span class="status">{{ row.item?.status }}</span>
						</badge>
					</td>
					<td>
						{{ row.item?.scheduled_date }}
					</td>
					<td v-if="ROLE == 'business' && row.item?.status == 'COMPLETADO'">
						<base-button size="sm">Imprimir</base-button>
					</td>
					<td class="text-right" v-if="ROLE != 'business'">
						<base-dropdown class="dropdown audit-drop" position="right" direction="down">
							<template v-slot:title>
								<a class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false">
									<i class="fas fa-ellipsis-v"></i>
								</a>
							</template>
							<a class="dropdown-item" href="#" v-if="row.item?.status == 'PENDIENTE'"
								@click.prevent="toSchedule(row.item?.id)">{{ row.item?.scheduled_date != null ?
										'Re-agendar' : 'Agendar'
								}}</a>
							<a href="#" class="dropdown-item" @click="handleInit(row.item)"
								v-if="row.item?.status != 'COMPLETADO' && row.item?.scheduled_date != null">
								{{ row.item?.status == "PENDIENTE" ? "Iniciar" : "Completar" }}
							</a>
							<router-link class="dropdown-item" v-if="row.item?.status == 'COMPLETADO'"
								to="/audits/nonconformities">
								No conformidades
							</router-link>
							<a 
								class="dropdown-item" 
								href="#" 
								@click.prevent="handleDelegate(row.item)" 
								v-if="row.item?.status != 'COMPLETADO'"
								:disabled="row.item?.status != 'PENDIENTE'"
							>
								Delegar
							</a>
							<a class="dropdown-item" href="#" @click.prevent="">Historial</a>
							<a class="dropdown-item" v-if="row.item?.status == 'COMPLETADO'"
								:href="url + '/audits/report/' + row.item?.id" target="_blank">Imprimir</a>
							<!-- <a class="dropdown-item" href="#" @click.prevent="">Eliminar</a> -->

						</base-dropdown>
					</td>
				</template>
			</base-table>
			<!-- <loader v-if="loader"></loader> -->

			<base-pagination :perPage="this.metaData.perPage" :value="this.page" @changePage="handleChange($event)"
				:total="this.metaData.total" align="center">
			</base-pagination>

			<modal
				v-model:show="toDelegate"
				model="auditoria"
				action="delegar"
				v-if="toDelegate"
			>
				<div class="mb-4 pb-md-2">
					<base-field label="Auditor actual">
						<input disabled :value="audit?.auditable?.user?.full_name" class="form-control"/>
					</base-field>
					<AsyncSelect :list="true" :roles="[2,3]" @selected="new_auditable = $event" :params="params"></AsyncSelect>
					<div class="mt-2 row">
						<div class="col">
							<base-button size="sm" :block="true" @click="submitDelegate">Aceptar</base-button>
						</div>
						<div class="col">
							<base-button :outiline="true" size="sm" :block="true" @click="toDelegate = false">Cancelar</base-button>
						</div>
					</div>
				</div>
			</modal>
		</div>
	</div>
</template>
<script>
// import { axios } from '@/axios';

import { mapGetters } from "vuex";
import service from "../../store/services/model-service";
import AsyncSelect from "../../components/AsyncSelect.vue";
export default {
    name: "audits-table",
    props: {
        type: {
            type: String,
        },
        title: String,
        classes: {
            type: String,
        },
    },
    data() {
        return {
            tableData: [],
            metaData: {},
            baseImage: process.env.VUE_APP_API_URL + "img/dg_logo.png",
            loader: false,
            page: 1,
            url: this.$store.state.api_url,
            toDelegate: false,
			new_auditable: null,
			audit: null
        };
    },
    mounted() {
        this.getAudits(this.page);
    },
    computed: {
        ...mapGetters(["CURRENT_DATE", "ROLE"]),
		params(){
			let params = null;
			if (this.audit) {
				params = '&delegate_id=' + this.audit.installation.company?.administrable_id;
			}
			return params
		}
    },
    methods: {
        async getAudits(page = 1) {
            const resp = await service.getIndex("audit", page, "includes[]=installation.province" +
                "&includes[]=auditable.user" +
                "&includes[]=installation.company.user" +
                "&order_by=scheduled_date" +
                "&order_direction=asc");
            if (typeof resp.data.data != "undefined") {
                this.tableData = resp.data.data;
                this.metaData = resp.data.meta.page;
                this.page = this.metaData.currentPage;
            }
        },
        handleInit(item) {
            const link = `/audit-init/${item.id}`;
            if (item.can_init == null || item.can_init == false) {
                let msg = "Esta auditoria no se puede iniciar ya que no esta programada";
                if (item.can_init == false) {
                    msg = "Esta auditoria esta programada para la fecha: <b>" + item.scheduled_date + "</b>";
                }
                this.$swal("Auditoria no programada", msg, "warning");
            }
            else if (item.auditable == null) {
                this.$swal("Instalación sin auditor", `La instalación <b>${item.installation.name}</b> no cuenta con un auditor.`, "warning");
            }
            else {
                this.$router.push(link);
            }
        },
        setStatusType(status) {
            let type = "";
            switch (status) {
                case "PENDIENTE":
                    type = "danger";
                    break;
                case "INCOMPLETO":
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
        async handleChange(event) {
            if (event == this.page) {
                return;
            }
            this.getAudits(event);
        },
		handleDelegate(audit){
			this.audit = audit
			this.toDelegate = true
		},
        async toSchedule(id) {
            await this.$store.dispatch("toSchedule", {
                model: "audits",
                id: id,
                name: "auditoria",
            });
            console.log("asdasdasd");
            this.getAudits();
        },
		async submitDelegate(){
			if (this.new_auditable) {
				try {
					await service.update('audit',this.audit.id,{
						auditable_id: this.new_auditable.id
					})
					this.getAudits();
					this.toDelegate = false;
					this.$toast.success('Auditoria delegada con exito');
				} catch (err) {
					console.log(err);
				}
			}else{
				this.$toast.warning('Tienen que seleccionar un auditor.')
			}
		}
    },
    components: { AsyncSelect },
};
</script>
<style>
</style>
