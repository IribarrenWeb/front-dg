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
                            <span class="badge bg-secondary ml-1" v-if="notification.read_at == null">Nuevo</span>
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
window.Pusher = require('pusher-js');

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
        const audio = new Audio(process.env.VUE_APP_API_URL + 'uploads/notification.mp3')
        const notifications = computed(() => {
            return store.state.notifications
        });
        
        const unread = computed(() => {
            return (filter(notifications.value, function (d) { return d.read_at == null; })).length
        })
        const isConnected = ref(false)
        const token = computed(() => {
            return localStorage.getItem(process.env.VUE_APP_USER_TOKEN_NAME);
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
            echo.value = new Echo({
                broadcaster: 'pusher',
                key: '623ae106fb74e000882f',
                cluster: 'us2',
                encrypted: true,
                authEndpoint: process.env.VUE_APP_API_URL + 'broadcasting/auth',
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
                    const res = await modelService.api('notifications/read', 'GET')
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
                echo.value.disconnect()
            }
        })

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
    min-width: 200px;
}
</style>