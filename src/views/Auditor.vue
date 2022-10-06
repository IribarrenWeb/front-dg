<template>
  <div>

    <div class="container-fluid mt--7">
      <!--Tables-->
      <auditors-table></auditors-table>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
import AuditorsTable from '../components/Auditor/AuditorsTable.vue';
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
