<template>
    <div>
        <base-dropdown dorpClasses="customDrop" @change="markRead" menuClasses="drop-not" ref="drop" class="nav-item"
            position="right">
            <template v-slot:title>
                <a class="nav-link nav-link-icon position-relative h2" @click="markRead"
                    :class="{ 'text-white': !dark }" href="#" role="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i class="ni ni-bell-55"></i>
                    <span v-if="unread >= 1"
                        class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    </span>
                </a>
            </template>

            <ul v-if="!$empty(notifications)" class="list-group list-group-flush noty-container">
                <li v-for="notification in notifications" :key="notification.id"
                    class="dropdown-item list-group-item d-flex">
                    <div class="">
                        <i class="fa-regular fa-circle"></i>
                    </div>
                    <div class="pl-1">
                        <div class="w-100">
                            <span class="badge bg-danger mx-1 text-white" v-if="notification.read_at == null">Nuevo</span>
                            <span class=" font-weight-bold text-wrap" style="width: 6rem;">{{
                                    notification.data.message
                            }}</span>
                        </div>
                        <div class="h6 text-muted d-inline">
                            <timeago :autoUpdate="true" :datetime="$functions.timeAgo(notification.created_at)" />
                        </div>
                    </div>
                </li>
            </ul>
            <div class="p-2" v-else>
                Sin notificaciones
            </div>

        </base-dropdown>
    </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import Echo from 'laravel-echo'
import { useStore } from 'vuex';
import { filter, isEmpty } from 'lodash';
import modelService from '../store/services/model-service';
import { baseUrl } from '../axios/index'
import Pusher from 'pusher-js'

window.Pusher = Pusher;

export default {
    props: {
        dark: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const store = useStore();
        const drop = ref();
        const pusher_key = computed(() => window.location.host.includes('localhost') || window.location.host.includes('dev') ? import.meta.env.VITE_PUSHER_APP_KEY_DEV : import.meta.env.VITE_PUSHER_APP_KEY_PROD)
        const pusher_cluster = computed(() => window.location.host.includes('localhost') || window.location.host.includes('dev') ? import.meta.env.VITE_PUSHER_APP_CLUSTER_DEV : import.meta.env.VITE_PUSHER_APP_CLUSTER_PROD)
        const audio = new Audio(baseUrl + 'uploads/notification.mp3')
        const notifications = computed(() => {
            return store.state.notifications
        });
        
        const unread = computed(() => {
            return (filter(notifications.value, function (d) { return d.read_at == null; })).length
        })
        const isConnected = ref(false)
        const token = computed(() => {
            return localStorage.getItem(import.meta.env.VITE_USER_TOKEN_NAME);
        })
        const user = computed(() => {
            return store.getters['profile/me']
        })
        const echo = ref(null)

        function bindChannels() {
            console.log('BIND');
            console.log(user.value.id);
            echo.value.private('users.' + user.value.id)
                .notification((object) => {
                    audio.play();
                    store.commit('pushNotification', object)
                })
            console.log('bind channel');
            isConnected.value = true
            console.log('BINDED');
        }

        function connect() {
            console.log();
            console.log(pusher_key.value,pusher_cluster.value);
            echo.value = new Echo({
                broadcaster: 'pusher',
                key: pusher_key.value,
                cluster: pusher_cluster.value,
                encrypted: true,
                authEndpoint: baseUrl + 'broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: 'Bearer ' + token.value
                    }
                },
                transports: ['websocket', 'polling', 'flashsocket']
            })
        }

        onMounted(() => {
            connect()
        })

        async function markRead(evt) {
            if (!evt && unread.value >= 1) {
                try {
                    const res = await modelService.api({url: 'notifications/read'})
                    store.commit('markRead')
                    console.log(res);
                } catch (err) {
                    console.log(err);
                }
            }
        }

        watch(user, (val) => {
            if (!isEmpty(val) && !isConnected.value) {
                bindChannels()
                isConnected.value = true
            } else if (!isEmpty(echo.value)) {
                // echo.value.disconnect()
            }
        },{immediate: true})

        return {
            connect,
            bindChannels,
            notifications,
            drop,
            markRead,
            unread
        }
    }
}
</script>

<style lang="scss">
.drop-not {
    max-height: 500px;
    overflow-y: auto;
}

/* width */
::-webkit-scrollbar {
    width: 5px;
    height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    background-color: white;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: rgb(24, 40, 83);
    border-radius: 10px;
}

.page-link{
    z-index: auto !important;
}
.noty-container{
    min-width: 350px;
}
</style>