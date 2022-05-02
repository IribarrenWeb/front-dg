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

      <modal v-model:show="this.modal" modalClasses="modal-xl" bodyClasses="pt-0" modalContentClasses="overflow-auto max-h-modal">
        <template v-slot:header>
          <h4 class="modal-title text-center" id="modal-title-default">
            Agregar una empresa
          </h4>
        </template>
        <form-business @close="this.modal=false"/>
      </modal>
    </div>
  </div>
</template>
<script>
import FormBusiness from '../../components/forms/Business/FormBusiness.vue';
  export default {
	components: { FormBusiness },
    name: "business-table",
    data() {
      return {
        tableData: {},
        modal: false,
      };
    },
    methods: {
      handleAdd() {
        this.modal = true;
      },
      handleView(id) {
        console.log(id);
      },
    },
  };
</script>
<style>
  .max-h-modal{
    max-height: 850px;
  }
</style>
