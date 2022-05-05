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
          <th>Provincia</th>
          <th>Instalaciones</th>
          <th></th>
          <th>Acciones</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.business_name }}
          </th>
          <td class="text-uppercase">
            BARCELONA
          </td>
          <td>
            {{ row.item.installations.length }}
          </td>
          <td>
            <span v-for="installation in row.item.installations" :key="installation.key">
              {{installation.name}},
            </span>
          </td>
          <td>
            <router-link :to="`/business/${row.item.id}`" class="btn btn-sm btn-default">Ver</router-link>
            <a href="#" @click.prevent="destroy(row.item.id)" class="btn btn-sm btn-danger">Eliminar</a>
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
      this.getBusiness(this.page)
    },
    methods: {
      handleAdd() {
        this.modal = true;
      },
      handleView(id) {
        this.$router.push('/business/' + id)
      },
      async getBusiness(page) {
        this.loader = true;
        try {
          const response = await service.getIndex(
            `page=${page}&includes[]=user&includes[]=installations`
          );
          this.tableData = response.data.data;
          this.metaData = response.data.meta.page;
          this.page = this.metaData.currentPage;
          this.loader = false;
        } catch (err) {
          this.$swal('Error', 'Error al cargar el listado', 'error')
          this.loader = false;
        }
      },
      async handleChange(event) {
        if (this.page == event) {
          return 
        }
        this.getBusiness(event)
      },
       async destroy(id) {
        this.loader = true
        try {
          const response = await service.destroy(id)
          console.log(response);
          this.$toast.success('Registro eliminado')
          this.getBusiness();
          this.loader = false
        } catch (err) {
          console.log(err.response);
          this.loader = false 
          this.$swal('Error', 'Ocurrio un error al intentar eliminar el registro', 'error')         
        }
      },
    },
  };
</script>
<style>
  .max-h-modal {
    max-height: 850px;
  }
</style>
