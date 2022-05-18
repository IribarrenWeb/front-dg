<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <!--Tables-->
      <formation-table></formation-table>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
import FormationTable from './Tables/FormationTable.vue';
  // Charts

  export default {
    components: {FormationTable},
    data() {
      return {
      };
    },
    methods: {
    },
  };
</script>
<style></style>
