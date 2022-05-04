<template>
  <div class="card mt-3">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h4 class="mb-0">Instalaciones</h4>
        </div>
        <div class="col text-right">
          <a
            href="#"
            @click.prevent="handleAdd()"
            class="btn btn-sm btn-default"
            >Agregar</a
          >
        </div>
      </div>
    </div>
    <div></div>
    <div class="table-responsive">
      <base-table thead-classes="thead-light" :data="tableData">
        <template v-slot:columns>
          <th>Nombre</th>
          <th>Direccion</th>
          <th>Empleados</th>
          <th>Provincia</th>
          <th>Auditor</th>
          <th>Acciones</th>
        </template>

        <template v-slot:default="row">
          <th scope="row" class="text-capitalize">
            {{ row.item.name }}
          </th>
          <td class="text-uppercase">
            {{ row.item.address }}
          </td>
          <td>
            {{ row.item.employees.length }}
          </td>
          <td class="text-uppercase">
            {{ row.item.province.name }}
          </td>
          <td class="text-uppercase">
            <a href="#" @click="showAuditor()">{{ row.item.auditable.user.name }} {{ row.item.auditable.user.last_name }}</a>
          </td>
          <td>
            <a href="#" @click.prevent="this.modal = true" class="btn btn-sm btn-default">Ver</a>
          </td>
        </template>
      </base-table>
      <div>
        <base-pagination
          :perPage="this.metaData.perPage"
          :value="this.page"
          @changePage="handleChange($event)"
          :total="this.metaData.total"
          align="center"
        ></base-pagination>
      </div>
      <loader v-if="loader"></loader>

      <modal
        v-model:show="this.modal"
        modalClasses="modal-xl"
        bodyClasses="pt-0 px-5"
        modalContentClasses="overflow-auto max-h-modal"
        headerClasses="px-4 py-2"
      >
        <template v-slot:header>
        </template>
        <form-installation @close="this.modal = false" @reload="getInstallations()" :business_id="business_id"></form-installation>
      </modal>
    </div>
  </div>
</template>
<script>
import FormInstallation from '../../components/forms/Installation/FormInstallation.vue';
  import service from "../../store/services/installation-service";
  export default {
	components: { FormInstallation },
    name: "business-table",
    props: {
      business_id: {}
    },
    data() {
      return {
        tableData: {},
        modal: false,
        delegate: {},
        loader: false,
        metaData: {},
        page: 1,
      };
    },
    mounted() {
      this.getInstallations()
    },
    methods: {
      handleAdd() {
        this.modal = true;
      },
      async getInstallations() {
        this.loader = true;
        try {
          const response = await service.getByBusiness(this.business_id,this.page);
          console.log(response);
          this.tableData = response.data.data;
          console.log(this.tableData);
          this.metaData = response.data.meta.page;
        } catch (err) {
          console.log(err);
        }
        this.loader = false;
      },
      async handleChange(event) {
        if(event == this.page){
          return
        }
        this.loader = true;
        try {
          const response = await service.getByBusiness(this.business_id,event);
          this.tableData = response.data.data;
          this.metaData = response.data.meta.page;
          this.page = this.metaData.currentPage;
        } catch (err) {
          this.$swal("Error", "No se pudieron cargar los datos de la tabla");
          console.log(err);
        }
        this.loader = false;
      },
    },
  };
</script>
<style>
  .max-h-modal {
    max-height: 850px;
  }
</style>
