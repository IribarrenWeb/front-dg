<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
    </base-header>

    <div class="container-fluid mt--7">
      <!--Tables-->
      <div class="card">
        <business-table></business-table>
      </div>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
import BusinessTable from './Tables/BusinessTable.vue';
  // Charts

  export default {
    components: {BusinessTable},
    data() {
      return {
        users: {},
        meta: {},
      };
    },
    
    async mounted() {
    },
    methods: {
    },
  };
</script>
<style></style>
