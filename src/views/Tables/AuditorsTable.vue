<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Auditores</h3>
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

    <div class="table-responsive">
      <base-table thead-classes="thead-light" :data="tableData">
        <template v-slot:columns>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Móvil</th>
          <th>Delegado</th>
          <th>Acciones</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.user.name }}
          </th>
          <td>
            {{ row.item.user.last_name }}
          </td>
          <td>
            {{ row.item.user.email }}
          </td>
          <td>
            {{ row.item.phone_number }}
          </td>
          <td>
            {{ row.item.delegate.user.name }}
          </td>
          <td>
            <a
              href="#"
              @click.prevent="handleView(row.item.id)"
              class="btn btn-sm btn-default"
              >Ver</a
            >
          </td>
        </template>
      </base-table>
      <div v-if="tableData.length >= 1">
        <base-pagination
          :perPage="this.metaData.perPage"
          :value="this.page"
          @changePage="handleChange($event)"
          :total="this.metaData.total"
          align="center"
        ></base-pagination>
      </div>
      <loader v-if="loader"></loader>
    </div>
    <Transition name="fade">
      <modal v-model:show="this.modal" modalClasses="modal-xl"  v-if="this.modal">
        <template v-slot:header>
          <h4 class="modal-title" id="modal-title-default">
            {{disabled ? 'Ver un auditor' : 'Registrar un nuevo auditor'}}
          </h4>
        </template>

        <form-auditor
          :auditor="auditor"
          @notValid="submit = false"
          @closeModal="this.modal = false"
          @resetTable="getAuditors"
          :disabled="disabled"
        >
        </form-auditor>
      </modal>
    </Transition>
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
        auditor: {},
        disabled: false,
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
            `page=${this.page}&includes[]=user&includes[]=delegate.user`
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
      handleAdd() {
        this.disabled = false;
        this.auditor = {};
        this.modal = true;
      },
      async handleView(id) {
        this.loader = true;

        try {
          const response = await service.view(
            id,
            "includes[]=province.city&includes[]=documents.type&includes[]=delegate.user"
          );
          const data = response.data.data;
          this.auditor = {
            name: data.user.name,
            last_name: data.user.last_name,
            email: data.user.email,
            phone_number: data.phone_number,
            dni: data.dni,
            province: data.province,
            documents: data.documents,
            delegate: data.delegate
          };

          this.disabled = true;
          this.modal = true;
        } catch (err) {
          this.$swal("Error", "No se pudieron cargar los datos del delegado");
          console.log(err);
        }
        this.loader = false;
      },
    },
  };
</script>
<style></style>
