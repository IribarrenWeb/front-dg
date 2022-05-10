<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row" v-if="role == 'admin'">
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Delegados"
            type="gradient-info"
            sub-title="350"
            icon="ni ni-active-40"
            class="mb-4 mb-xl-0"
          ></stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Auditores"
            type="gradient-info"
            sub-title="265"
            icon="ni ni-chart-pie-35"
            class="mb-4 mb-xl-0"
          ></stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Epresas"
            type="gradient-info"
            sub-title="924"
            icon="ni ni-money-coins"
            class="mb-4 mb-xl-0"
          >
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Instalaciones"
            type="gradient-info"
            sub-title="44"
            icon="ni ni-chart-bar-32"
            class="mb-4 mb-xl-0"
          >
          </stats-card>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--5">
      <div>
        <visits-table></visits-table>
      </div>
      <div class="my-md-4">
        <informs-table></informs-table>
      </div>
      <div>
        <non-table></non-table>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import InformsTable from './Tables/InformsTable.vue';
import NonTable from './Tables/NonTable.vue';
import VisitsTable from './Tables/VisitsTable.vue';
  export default {
	components: { VisitsTable, InformsTable, NonTable },
    data() {
      return {
      };
    },
    async mounted() {
    },
    computed: {
      ...mapGetters({
        role: 'ROLE'
      })
    },
    methods: {},
  };
</script>
<style></style>
