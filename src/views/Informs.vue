<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <informs-table title="Informes"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InformsTable from './Tables/InformsTable.vue';
export default {
  name: "tables",
  components: {
    InformsTable
  },
};
</script>
<style></style>
