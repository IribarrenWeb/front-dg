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
      <modal
        v-model:show="this.modal"
        model="auditor"
        :action="action"
        modalClasses="modal-xl"
        @close="action = 'Registrar'"
        v-if="this.modal"
      >
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
  import service from "../../store/services/model-service";
  export default {
    name: "auditors-table",
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
        action: "Registrar",
      };
    },
    mounted() {
      this.getAuditors(this.page);
    },
    methods: {
      async getAuditors(page = 1) {
        try {
          const response = await service.getIndex(
            "auditor",
            page,
            `&includes[]=user&includes[]=delegate.user`
          );
          this.tableData = response.data.data;
          this.metaData = response.data.meta.page;
          this.page = this.metaData.currentPage;
        } catch (err) {
          console.log(err);
        }
      },
      async handleChange(event) {
        this.getAuditors(event);
      },
      handleAdd() {
        this.disabled = false;
        this.auditor = {};
        this.modal = true;
      },
      async handleView(id) {
        const response = await service.show(
          "auditor",
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
          delegate: data.delegate,
        };
        this.action = "editar";
        this.disabled = true;
        this.modal = true;
      },
    },
    watch: {
      modal(newVal){
        if (!newVal) {
          this.action = 'Registrar'
        }
      }
    }
  };
</script>
<style></style>
