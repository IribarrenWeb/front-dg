<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
    <div
      class="card-header border-0"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
            {{ title }}
          </h3>
        </div>
        <div class="col text-right">
          <base-button type="default" size="sm">Iniciar auditoria</base-button>
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
          <th>Instalacion</th>
          <th>Nombre</th>
          <th>Provincia</th>
          <th>Ultima auditoria</th>
          <th>Estado</th>
          <th>Hora y fecha</th>
          <th></th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            <div class="media align-items-center">
              <a href="#" class="avatar rounded-circle mr-3">
                <img alt="Installation images" :src="baseImage" />
              </a>
              <div class="media-body">
                <span class="name mb-0 text-sm">{{ row.item.installation.name }}</span>
              </div>
            </div>
          </th>
          <td class="budget">
            AUDITORIA2022
            <!-- {{ row.item.name }} -->
          </td>
          <td>
            {{ row.item.installation.province.name }}
          </td>
          <td>Sin datos</td>
          <td>
            <badge class="badge-dot mr-4" :type="setStatusType(row.item.status)">
              <i :class="`bg-${setStatusType(row.item.status)}`"></i>
              <span class="status">{{ row.item.status }}</span>
            </badge>
          </td>
          <td>
            {{ row.visit_date  }}
          </td>
          <!-- <td>
            <div class="d-flex align-items-center">
              <span class="completion mr-2">{{ row.item.completion }}%</span>
              <div>
                <base-progress
                  :type="row.item.statusType"
                  :show-percentage="false"
                  class="pt-0"
                  :value="row.item.completion"
                />
              </div>
            </div>
          </td> -->
          <td class="text-right">
            <base-dropdown class="dropdown audit-drop" position="right" direction="down">
              <template v-slot:title>
                <a
                  class="btn btn-sm btn-icon-only text-light"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="fas fa-ellipsis-v"></i>
                </a>
              </template>
              <a class="dropdown-item" href="#" @click.prevent="">Archivar</a>
              <a class="dropdown-item" href="#" @click.prevent="">Agendar</a>
              <a class="dropdown-item" href="#" @click.prevent="">Eliminar</a>
              <a class="dropdown-item" href="#" @click.prevent="">Historial</a>
              <router-link class="dropdown-item" v-if="row.item.status != 'COMPLETADO'" :to="`/audit-init/${row.item.id}`">
                {{row.item.status == 'PENDIENTE' ? 'Iniciar' : 'Completar'}}
              </router-link>
              <a class="dropdown-item" href="#" @click.prevent="">No conformidades</a>
              <a class="dropdown-item" href="#" @click.prevent="">Delegar</a>
            </base-dropdown>
          </td>
        </template>
      </base-table>
      <!-- <loader v-if="loader"></loader> -->

      <base-pagination 
          :perPage="this.metaData.perPage"
          :value="this.page"
          @changePage="handleChange($event)"
          :total="this.metaData.total"
          align="center">
      </base-pagination>
    </div>
  </div>
</template>
<script>
import service from '../../store/services/model-service';
export default {
  name: "audits-table",
  props: {
    type: {
      type: String,
    },
    title: String,
  },
  data() {
    return {
      tableData: [],
      metaData: {},
      baseImage: process.env.VUE_APP_API_URL + 'img/dg_logo.png',
      loader: false,
      page: 1
    };
  },
  mounted() {
    this.getAudits(this.page)
  },
  methods: {
    async getAudits(page){
      const resp = await service.getIndex('audit', page,'includes[]=installation.province');
      if (typeof resp.data.data != 'undefined') {
        this.tableData = resp.data.data;
        this.metaData = resp.data.meta.page;
        this.page = this.metaData.currentPage;
      }
    },
    setStatusType(status){
      let type = '';
      switch (status) {
        case 'PENDIENTE':
          type = 'danger';
          break;
        case 'INCOMPLETO':
          type = 'warning';
          break;
        case 'COMPLETADO':
          type = 'success';
          break;
      
        default:
          break;
      }
      return type;
    },
    async handleChange(event) {
      if(event == this.page){
        return
      }
      this.getAudits(event)
    },
  },
};
</script>
<style></style>
