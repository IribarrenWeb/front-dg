<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Empleados</h3>
        </div>
        <div class="col text-right">
          <a href="#" class="btn btn-sm btn-default">Agregar</a>
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
            <a href="#" class="btn btn-sm btn-default">Ver</a>
          </td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<script>
  export default {
    name: "users-table",
    props: ["tableData"],
    data() {
      return {};
    },
  };
</script>
<style></style>
