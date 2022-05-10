<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <!--Tables-->
      <auditors-table></auditors-table>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
import AuditorsTable from './Tables/AuditorsTable.vue';
  // Charts

  export default {
    components: {AuditorsTable},
    data() {
      return {
      };
    },
    methods: {
    },
  };
</script>
<style></style>
