<template>
    <q-layout view="lhh lpR lfr" :class="{'mobile-custom':mobile}">

        <q-header elevated class="bg-primary text-white bg-gradient-default pt-2"
            style="height: 300px;z-index: 0;top: 60px;">
            <div class="flex">
                <q-toolbar class="col" :class="{'col-3':mobile}">
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                    <q-toolbar-title v-if="!mobile">
                        DGSOFTWARE
                    </q-toolbar-title>
                </q-toolbar>
                <div class="col flex justify-end items-center">
                    <Notifications :dark="false"></Notifications>
                    <dashboard-navbar-v-2 :me="me"></dashboard-navbar-v-2>
                </div>
            </div>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered class="tete" :style="{top: !mobile ? '60px' : 0}">
            <div class="flex justify-center q-mt-xl">
                <q-img :src="logo" spinner-color="primary" fit="contain" spinner-size="10px" height="100px" width="100px"/>
            </div>
            <menu-aside />
        </q-drawer>

        <q-page-container style="margin-top: -3rem !important;">
            <router-view />
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
import { computed, ref } from 'vue'
import { baseUrl } from '../axios/index';
import Notifications from '../components/Notifications.vue';
import DashboardNavbarV2 from './DashboardNavbarV2.vue';
import { useStore } from 'vuex';
import MenuAside from './Modules/Menu.vue';

export default {
    components: { Notifications, DashboardNavbarV2, MenuAside },
    setup() {
        const leftDrawerOpen = ref(false)
        const logo = ref(baseUrl + 'img/dg_logo.png')
        const store = useStore()
        const me = computed(() => store.state.profile.me ?? {})
        const mobile = computed(() => window.innerWidth <= 1018)
        async function loadUser() {
            await store.dispatch("profile/me");
            await store.dispatch("getNotifications");
        }

        loadUser()

        return {
            leftDrawerOpen,
            logo,
            me,
            mobile,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            }
        }
    }
}
</script>
<style lang="scss">
    aside.q-drawer{
        position: fixed;
        // top: 60px;
    }
    .mobile-custom aside.q-drawer{
        top: 0;
    }
</style>