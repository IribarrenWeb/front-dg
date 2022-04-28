<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Argon"
      title="Argon"
    >
      <template v-slot:links>
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'ni ni-tv-2 text-blue',
            path: '/dashboard',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Empresas',
            icon: 'ni ni-planet text-blue',
            path: '/icons',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Informes',
            icon: 'ni ni-pin-3 text-blue',
            path: '/maps',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Usuarios',
            icon: 'ni ni-single-02 text-blue',
            path: '/users',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Auditorias',
            icon: 'ni ni-bullet-list-67 text-blue',
            path: '/tables',
          }"
        />
        <!-- <sidebar-item
          :link="{
            name: 'Login',
            icon: 'ni ni-key-25 text-info',
            path: '/login',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Register',
            icon: 'ni ni-circle-08 text-pink',
            path: '/register',
          }"
        /> -->
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar :me="me"></dashboard-navbar>

      <div @click="toggleSidebar">
        <!-- your content here -->
        <router-view></router-view>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
  },
  data() {
    return {
      sidebarBackground: "orange", //vue|blue|orange|green|red|primary,
      me: {}
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('profile/me')
    this.me = await this.$store.getters['profile/me']
  }
};
</script>
<style lang="scss"></style>
