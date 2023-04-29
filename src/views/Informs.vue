<template>
  <div>
    

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <AnnualReportTable title="Informes"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AnnualReportTable from '../components/AnnualReport/AnnualReportTable.vue';
export default {
  name: "tables",
  components: {
    AnnualReportTable
  },
};
</script>
<style></style>
