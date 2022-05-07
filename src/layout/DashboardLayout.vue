<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="DG"
      title="DG SOFTWARE"
      v-if="!$route.meta.audit"
    >
      <template v-slot:links>
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'ni ni-tv-2 text-default',
            path: '/dashboard',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Empresas',
            icon: 'ni ni-planet text-default',
            path: '/business',
          }"
        />
        <!-- <sidebar-item
          :link="{
            name: 'Informes',
            icon: 'ni ni-pin-3 text-default',
            path: '/maps',
          }"
        /> -->
        <sidebar-item
          :link="{
            name: 'Usuarios',
            icon: 'ni ni-single-02 text-default',
            path: '/users',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Auditorias',
            icon: 'ni ni-bullet-list-67 text-default',
            path: '/audits',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar :me="me"></dashboard-navbar>

      <div @click="toggleSidebar">
        <router-view v-slot="{ Component }">
          <Transition name="fade">
            <div>
              <component :is="Component"></component>
              <loader></loader>
            </div>
          </Transition>
        </router-view>
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
        sidebarBackground: "orange", //vue|blue|orange|green|red|default,
        me: {},
      };
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      handleHide(evnt) {
        console.log(evnt);
      }
    },
    async mounted() {
      console.log(this.$route.meta);
      await this.$store.dispatch("profile/me");
      this.me = await this.$store.getters["profile/me"];
    },
  };
</script>
<style lang="scss"></style>
