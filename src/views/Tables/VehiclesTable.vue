<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
    <div
      class="card-header border-0"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
            Vehiculos
          </h3>
        </div>
        <div class="col text-right">
          <base-button type="default" size="sm" @click="this.modal = true"
            >Agregar</base-button
          >
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
          <th>Matricula</th>
          <th>Flota</th>
          <th>Tara</th>
          <th>MMA</th>
          <th>Tipo</th>
          <th>Kit ADR</th>
          <th>Designacion ADR</th>
          <th>Estado</th>
          <th></th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.registration_number }}
          </th>
          <td class="budget">
            {{ row.item.fleet }}
          </td>
          <td>
            {{ row.item.tara }}
          </td>
          <td>{{ row.item.mma }}</td>
          <td>{{ row.item.type.name }}</td>
          <td>{{ row.item.adr_kit }}</td>
          <td>{{ row.item.adr.code }}</td>
          <td>
            <badge
              class="badge-dot mr-4"
              :type="setStatusType(row.item.status)"
            >
              <i :class="`bg-${setStatusType(row.item.status)}`"></i>
              <span class="status">{{
                row.item.status ? "REVISADO" : "POR REVISAR"
              }}</span>
            </badge>
          </td>
          <td class="text-right">
            <!-- <a class="btn btn-primary btn-sm" href="#" @click.prevent=""
              >Ver</a
            > -->
            <a class="btn btn-danger btn-sm" href="#" @click.prevent="destroy(row.item.id)"
              >Eliminar</a
            >
          </td>
        </template>
      </base-table>

      <base-pagination
        :perPage="this.metaData.perPage"
        :value="this.page"
        @changePage="handleChange($event)"
        :total="this.metaData.total"
        align="center"
      >
      </base-pagination>
    </div>

    <modal
      v-if="this.modal"
      v-model:show="this.modal"
      modalClasses="modal-xl"
      bodyClasses="pt-0 px-5"
      modalContentClasses="overflow-auto max-h-modal"
      headerClasses="px-4 py-2"
    >
      <template v-slot:header> </template>
      <form-vehicle
        @close="this.modal = false"
        @reload="getVehicles(page)"
        :installation_id="installation_id"
      ></form-vehicle>
    </modal>
  </div>
</template>
<script>
  import FormVehicle from "../../components/forms/FormVehicle.vue";
  import service from "../../store/services/model-service";

  export default {
    components: { FormVehicle },
    name: "vehicle-table",
    props: {
      type: {
        type: String,
      },
      title: String,
      installation_id: {
        required: true,
        default: null,
      },
    },
    data() {
      return {
        tableData: [],
        metaData: {},
        loader: false,
        page: 1,
        modal: false,
      };
    },
    mounted() {
      this.getVehicles(this.page);
    },
    methods: {
      async getVehicles(page) {
          let params = "includes[]=adr&includes[]=type";

          if (this.installation_id != null) {
            params += "&installation_id=" + this.installation_id;
          }

          const resp = await service.getIndex('vehicle', page, params);

          if (typeof resp.data.data != "undefined") {
            this.tableData = resp.data.data;
            this.metaData = resp.data.meta.page;
            this.page = this.metaData.currentPage;
          }
      },
      async handleChange(event) {
        if (event == this.page) {
          return;
        }
        this.getVehicles(event, this.installation_id);
      },
      setStatusType(status) {
        let type = "";
        switch (status) {
          case 0:
            type = "danger";
            break;
          case 1:
            type = "success";
            break;
          default:
            break;
        }
        return type;
      },
      async destroy(id) {
        try {
          await service.destroy(id)
          this.$toast.success('Registro eliminado')
          this.getVehicles();
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
</script>
<style></style>
