<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Auditores</h3>
        </div>
        <div class="col text-right">
          <a href="#" class="btn btn-sm btn-primary">Agregar</a>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light" :data="tableData">
        <template v-slot:columns>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Telefono</th>
          <th>Acciones</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.name }}
          </th>
          <td>
            {{ row.item.last_name }}
          </td>
          <td>
            {{ row.item.email }}
          </td>
          <td>
            {{ row.item.phone_number }}
          </td>
          <td>
            <a href="#" class="btn btn-sm btn-primary">Ver</a>
          </td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<script>
  import service from "../../store/services/auditors-service";
  export default {
    name: "users-table",
    data() {
      return {
        tableData: {},
        metaData: {},
        page: 1,
        modal: false,
        submit: false,
        loader: false,
      };
    },
    mounted() {
      this.getAuditors();
    },
    methods: {
      async getAuditors() {
        this.loader = true;
        try {
          const response = await service.getIndex(
            `page=${this.page}&includes[]=user`
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
            `page=${event}&includes[]=user`
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
<style></style>
