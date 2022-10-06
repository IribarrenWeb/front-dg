<template>
  <div>
    

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
import InformsTable from '../components/AnnualReport/InformsTable.vue';
export default {
  name: "tables",
  components: {
    InformsTable
  },
};
</script>
<style></style>
