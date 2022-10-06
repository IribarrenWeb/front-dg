<template>
  <div>
    

    <div class="container-fluid mt--7">
      <!--Tables-->
        <div>
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
import FormationTable from '../components/Formation/FormationTable.vue';
import TrainingTable from '../components/Training/TrainingTable.vue';
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
