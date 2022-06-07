<template>
  <div>
    

    <div class="container-fluid mt--7">
      <!--Tables-->
        <div v-if="ROLE == 'delegate'">
            <formation-table @reloadTraining="handleReload"></formation-table>
        </div>
        <div class="mt-3">
            <training-table :reload="reload" @reloaded="reload = false"></training-table>
        </div>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import FormationTable from './Tables/FormationTable.vue';
import TrainingTable from './Tables/TrainingTable.vue';
  // Charts

  export default {
    components: {FormationTable, TrainingTable},
    data() {
      return {
          reload: false
      };
    },
    methods: {
        handleReload(){
            this.reload = true
        }
    },
    computed: {
        ...mapGetters(['ROLE'])
    }
  };
</script>
<style></style>
