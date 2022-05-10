<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Delegados</h3>
        </div>
        <div class="col text-right">
          <a
            href="#"
            class="btn btn-sm btn-default"
            @click.prevent="handleAdd()"
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
            <a
              href="#"
              class="btn btn-sm btn-default"
              @click.prevent="handleView(row.item.id)"
              >Ver</a
            >
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
    </div>

    <Transition name="fade">
      <modal v-model:show="this.modal" model="delegado" :action="action" @close="action = 'Registrar'" modalClasses="modal-xl" v-if="this.modal">
        <form-delegate
          :delegate="delegate"
          @notValid="submit = false"
          @closeModal="this.modal = false"
          @resetTable="getDelegates"
          :disabled="disabled"
        >
        </form-delegate>

        <template v-slot:footer>
          <!-- <base-button type="default" @click="submit = true">Save changes</base-button>
          <base-button type="link" class="ml-auto" @click="this.modal = false"
            >Close
          </base-button> -->
        </template>
      </modal>
    </Transition>
  </div>
</template>

<script>
  import service from "../../store/services/model-service";

  export default {
    name: "delegate-table",
    data() {
      return {
        tableData: {},
        metaData: {},
        page: 1,
        modal: false,
        submit: false,
        delegate: {},
        disabled: false,
        action: 'Registrar'
      };
    },
    mounted() {
      this.getDelegates();
    },
    methods: {
      async getDelegates() {
          const response = await service.getIndex(
            'delegate',
            this.page,
            `&includes[]=user`
          );
          this.tableData = response.data.data;
          this.metaData = response.data.meta.page;
      },
      async handleChange(event) {

          const response = await service.getIndex(
            'delegate',
            event,
            `&includes[]=user`
          );
          this.tableData = response.data.data;
          this.metaData = response.data.meta.page;
          this.page = this.metaData.currentPage;
      },
      async handleView(id) {
        try {
          const response = await service.show('delegate',id,'includes[]=province.city&includes[]=documents.type');
          const data = response.data.data;
          this.delegate = {
            name: data.user.name,
            last_name: data.user.last_name,
            email: data.user.email,
            phone_number: data.phone_number,
            dni: data.dni,
            province: data.province,
            documents: data.documents
          }

          this.action = 'Editar';
          this.disabled = true
          this.modal = true
        } catch (err) {
          console.log(err);
        }
      },
      handleAdd(){
        this.disabled = false
        this.delegate = {}
        this.modal = true
      }
    },
    watch: {
      modal(newVal){
        if (newVal == false) {
          this.action = 'Registrar'
        }
      }
    }
  };
</script>
<style></style>
