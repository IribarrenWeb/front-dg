<template>
  <div>
    

    <div class="container-fluid mt--7">
      <!--Tables-->
      <div class="">
        <!-- <ul class="nav nav-tabs">
          <li class="nav-item">
            <router-link
              to="/users/delegates"
              class="nav-link"
              active-class="active"
            >
              Delegados
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/users/auditors" class="nav-link" active-class="active">
              Auditores
            </router-link>
          </li>
        </ul> -->
        
        <router-view></router-view>
      </div>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
  // Charts

  export default {
    components: {},
    data() {
      return {
        users: {},
        meta: {},
      };
    },
    
    async mounted() {
      this.$router.push("/users/delegates");
    },
    methods: {
    },
  };
</script>
<style></style>
