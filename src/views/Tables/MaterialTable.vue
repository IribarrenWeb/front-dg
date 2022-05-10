<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
    <div
      class="card-header border-0"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
            {{title}}
          </h3>
        </div>
        <div class="col text-right">
          <base-button type="default" size="sm" @click="this.modal = true">Agregar</base-button>
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
          <th>Instalacion</th>
          <th>Operaciones</th>
          <th>UN</th>
          <th>Nombre</th>
          <th>Clase</th>
          <th>Grupo de embalaje</th>
          <th></th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.installation.name }}
          </th>
          <td class="budget">
            <span v-for="operation in row.item.installation.operations" :key="operation.key">
              {{operation.name}},
            </span>
          </td>
          <td>
            {{ row.item.material.un_code }}
          </td>
          <td>{{ row.item.name }}</td>
          <td>{{ row.item.material.class.code }}</td>
          <td>{{ row.item.material.packing.code }}</td>
          <td class="text-right">
              <a class="btn btn-primary btn-sm" href="#" @click.prevent="">Ver</a>
              <a class="btn btn-danger btn-sm" href="#" @click.prevent="">Eliminar</a>
          </td>
        </template>
      </base-table>

      <base-pagination 
          :perPage="this.metaData.perPage"
          :value="this.page"
          @changePage="handleChange($event)"
          :total="this.metaData.total"
          align="center">
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
      <template v-slot:header>
      </template>
      <form-material @close="this.modal = false" @reload="getMaterials(page,installation_id)" :installation_id="installation_id" :residue="residue"></form-material>
    </modal>
  </div>
</template>
<script>
import service from '../../store/services/model-service';

export default {
  name: "material-table",
  props: {
    type: {
      type: String,
    },
    installation_id: {
      required: true,
      default: null
    },
    residue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Mercancías"
    }
  },
  data() {
    return {
      tableData: [],
      metaData: {},
      page: 1,
      modal: false
    };
  },
  mounted() {
    this.getMaterials(this.page, this.installation_id)
  },
  methods: {
    async getMaterials(page, id = null){
        let params = 'includes[]=installation.operations&includes[]=material.class&includes[]=deposit&includes[]=material.packing';

        if (id != null) {
          params += '&installation_id=' + id;
        }

        if (this.residue == false) {
          params += '&is_residue=false'  
        }else{
          params += '&is_residue=true'
        }
        
        const resp = await service.getIndex('material', page,params);
        
        if (typeof resp.data.data != 'undefined') {
          this.tableData = resp.data.data;
          this.metaData = resp.data.meta.page;
          this.page = this.metaData.currentPage;
        }
    },
    async handleChange(event) {
      if(event == this.page){
        return
      }
      this.getMaterials(event, this.installation_id)
    },
  },
};
</script>
<style></style>
