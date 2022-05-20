<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="DG"
      :sidebarClasses="$route.meta.audit ? 'd-lg-none' : ''"
      title="DG SOFTWARE"
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
            icon: 'ni ni-shop text-default',
            path: '/business',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Auditorias',
            icon: 'ni ni-bullet-list-67 text-default',
            path: '/audits',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Informes',
            icon: 'ni ni-book-bookmark text-default',
            path: '/informs',
          }"
        />
        <sidebar-item
          v-if="role == 'admin'"
          :link="{
            name: 'Delegados',
            icon: 'ni ni-single-02 text-default',
            path: '/delegates',
          }"
        />
        <sidebar-item
          v-if="role == 'admin' || role == 'delegate'"
          :link="{
            name: 'Auditores',
            icon: 'ni ni-hat-3 text-default',
            path: '/auditors',
          }"
        />
        <sidebar-item
          v-if="role == 'delegate' || role == 'auditor'"
          :link="{
            name: 'Formaciones',
            icon: 'ni ni-spaceship text-default',
            path: '/formations',
          }"
        />
      <sidebar-item
          v-if="role != 'business'"
          :link="{
            name: 'Visitas',
            icon: 'ni ni-spaceship text-default',
            path: '/visits',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :class="{'m-lg-0':$route.meta.audit}" :data="sidebarBackground">
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
  import {mapGetters} from "vuex";
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
    computed: {
      ...mapGetters({
        role: 'ROLE'
      })
    }
  };
</script>
<style lang="scss"></style>
