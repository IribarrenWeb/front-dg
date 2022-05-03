<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Empresas</h3>
        </div>
        <div class="col text-right">
          <a
            href="#"
            @click.prevent="handleAdd()"
            class="btn btn-sm btn-primary"
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
          <th>Propietario</th>
          <th>Instalaciones</th>
          <th>Telefono</th>
          <th>Nif</th>
          <th>Acciones</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.business_name }}
          </th>
          <td class="text-uppercase">
            {{ row.item.user.name }} {{ row.item.user.last_name }}
          </td>
          <td>
            {{ row.item.installations.length }}
          </td>
          <td>
            {{ row.item.business_phone }}
          </td>
          <td>
            {{ row.item.business_nif }}
          </td>
          <td>
            <a href="#" @click.prevent="" class="btn btn-sm btn-primary">Ver</a>
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
        bodyClasses="pt-0"
        modalContentClasses="overflow-auto max-h-modal"
      >
        <template v-slot:header> </template>
        <form-business @close="this.modal = false" @reload="getBusiness()"/>
      </modal>
    </div>
  </div>
</template>
<script>
  import FormBusiness from "../../components/forms/Business/FormBusiness.vue";
  import service from "../../store/services/business-service";

  export default {
    components: { FormBusiness },
    name: "business-table",
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
      this.getBusiness()
    },
    methods: {
      handleAdd() {
        this.modal = true;
      },
      handleView(id) {
        console.log(id);
      },
      async getBusiness() {
        this.loader = true;
        try {
          const response = await service.getIndex(
            `page=${this.page}&includes[]=user&includes[]=installations`
          );
          this.tableData = response.data.data;
          this.metaData = response.data.meta.page;
        } catch (err) {
          console.log(err);
        }
        this.loader = false;
      },
      async handleChange(event) {
        this.loader = true;
        try {
          const response = await service.getIndex(
            `page=${event}&includes[]=user&includes[]=installations`
          );
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
