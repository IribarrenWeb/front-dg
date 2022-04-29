<template>
  <div>
    <base-header type="gradient-blue" class="py-5">
      <div class="row">
      </div>
    </base-header>

    <div class="container-fluid mt-5">
      <!--Tables-->
      <div class="mt-5">
        <ul class="nav nav-tabs">
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
        </ul>
        
        <router-view class="mt-5"></router-view>
      </div>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
  // Charts

  // import service from "../store/services/admin-service";
  //   import SocialTrafficTable from "./Dashboard/SocialTrafficTable";

  export default {
    components: {},
    data() {
      return {
        users: {},
        meta: {},
      };
    },
    async mounted() {
      this.$router.push("/users/auditors");
    },
    methods: {
    },
  };
</script>
<style></style>
