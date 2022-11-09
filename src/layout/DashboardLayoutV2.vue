<template>
    <q-layout view="lhh lpR lfr" :class="{'mobile-custom':mobile}">

        <q-header elevated class="header-custom bg-primary text-white bg-gradient-default pt-2"
            :class="{'audit': inAudit}">
            <div class="flex">
                <q-toolbar class="col" :class="{'col-3':mobile}">
                    <div class="q-ml-md">
                        <q-btn dense flat round icon="menu" color="grey-3" v-if="!inAudit" @click="toggleLeftDrawer" />
                        <q-btn flat icon="arrow_back_ios" color="grey-3" v-else to="/audits">REGRESAR</q-btn>
                    </div>
                    <q-toolbar-title v-if="!mobile && !inAudit" class="text-uppercase">
                        {{$route.name}}
                    </q-toolbar-title>
                </q-toolbar>
                <div class="col flex justify-end items-center">
                    <Notifications :dark="false"></Notifications>
                    <dashboard-navbar-v-2 class="q-mx-md" :me="me"></dashboard-navbar-v-2>
                </div>
            </div>
        </q-header>

        <q-drawer :show-if-above="!inAudit" v-model="leftDrawerOpen" side="left" bordered class="tete"
            :style="{top: !mobile ? '60px' : 0}">
            <div class="flex justify-center q-mt-xl">
                <q-img :src="logo" spinner-color="primary" fit="contain" spinner-size="10px" height="100px"
                    width="100px" />
            </div>
            <menu-aside />
        </q-drawer>

        <q-page-container style="margin-top: -3rem !important;">
            <router-view v-slot="{ Component }">
                <component :is="Component"></component>
                <transition :duration="{ enter: 300, leave: 500 }" appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <loader ></loader>
                </transition>
            </router-view>
        </q-page-container>

        <q-footer class="text-grey-7 transparent mt-4">
            <q-toolbar>
                <q-toolbar-title>
                    <div>DGSOFTWARE</div>
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { baseUrl } from '../axios/index';
import Notifications from '../components/Notifications.vue';
import DashboardNavbarV2 from './DashboardNavbarV2.vue';
import { useStore } from 'vuex';
import MenuAside from './Modules/Menu.vue';
import { useRoute } from 'vue-router';

export default {
    components: { Notifications, DashboardNavbarV2, MenuAside },
    setup() {
        const leftDrawerOpen = ref(false)
        const logo = ref(baseUrl + 'img/dg_logo.png')
        const store = useStore()
        const route = useRoute()
        const me = computed(() => store.state.profile.me ?? {})
        const mobile = computed(() => window.innerWidth <= 1018)
        async function loadUser() {
            await store.dispatch("profile/me");
            await store.dispatch("getNotifications");
        }
        const inAudit = computed(() => route.path.includes('/audit-init'))

        loadUser()

        watch(inAudit, (v) => leftDrawerOpen.value = !v, { immediate: true })

        return {
            leftDrawerOpen,
            logo,
            me,
            inAudit,
            route,
            mobile,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            }
        }
    }
}
</script>
<style lang="scss">
aside.q-drawer {
    position: fixed;
    // top: 60px;
}

.mobile-custom aside.q-drawer {
    top: 0;
}

.header-custom {
    height: 300px;
    z-index: 0 !important;
    top: 60px !important;

    &.audit {
        height: 100px;
    }
}
</style>