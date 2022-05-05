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
      <loader v-if="loader"></loader>
    </div>

    <Transition name="fade">
      <modal v-model:show="this.modal" modalClasses="modal-xl" v-if="this.modal">
        <template v-slot:header>
          <h4 class="modal-title" id="modal-title-default">
            {{disabled ? 'Ver un delegado' : 'Registrar un nuevo delegado'}}
          </h4>
        </template>

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
  import Loader from "../../components/Loader.vue";
  import service from "../../store/services/delegate-service";

  export default {
    components: { Loader },
    data() {
      return {
        tableData: {},
        metaData: {},
        page: 1,
        modal: false,
        submit: false,
        loader: false,
        delegate: {},
        disabled: false
      };
    },
    mounted() {
      this.getDelegates();
    },
    methods: {
      async getDelegates() {
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
      async handleView(id) {
        this.loader = true;

        try {
          const response = await service.view(id, 'includes[]=province.city&includes[]=documents.type');
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

          console.log(this.delegate);
          this.disabled = true
          this.modal = true
        } catch (err) {
          this.$swal("Error", "No se pudieron cargar los datos del delegado");
          console.log(err);
        }
        this.loader = false;
      },
      handleAdd(){
        this.disabled = false
        this.delegate = {}
        this.modal = true
      }
    },
  };
</script>
<style></style>
