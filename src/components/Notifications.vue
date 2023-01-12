<template>
    <div>
        <q-btn-dropdown rounded :menu-offset="[0,15]" dense flat class="custom-drop" @hide="markRead">
            <template v-slot:label>
                <i class="ni ni-bell-55" style="font-size: 1.3rem;"></i>
                <q-badge v-if="unread >= 1" floating color="red" rounded />
            </template>

            <q-list v-if="!$empty(notifications)">
                <q-item v-for="notification in notifications" :key="notification.id" clickable v-close-popup>
                    <q-item-section avatar>
                        <i class="fa-regular fa-circle"></i>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>
                            <q-badge v-if="notification.read_at == null" rounded color="orange" label="Nuevo" />
                            {{notification.data.message}}
                        </q-item-label>
                        <q-item-label caption>
                            <timeago :autoUpdate="true" :datetime="$functions.timeAgo(notification.created_at)" />
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="info" color="red" v-if="notification.read_at == null" />
                    </q-item-section>
                </q-item>
            </q-list>
            <div class="p-2" v-else>
                Sin notificaciones
            </div>
        </q-btn-dropdown>
    </div>
</template>

<script>
import { computed, onMounted, ref, watchEffect } from 'vue';
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
            // console.log(user.value.id);
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
            console.log(pusher_key.value, pusher_cluster.value);
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
            if (unread.value >= 1) {
                try {
                    const res = await modelService.apiNoLoading({ url: 'notifications/read' })
                    store.commit('markRead')
                    console.log(res);
                } catch (err) {
                    console.log(err);
                }
            }
        }

        watchEffect(() => {
            if (user.value?.id && !isConnected.value && echo.value) {
                bindChannels()
                isConnected.value = true
            }
        }, {immediate: true})

        // watch(user, (val) => {
        //     if (!isEmpty(val) && !isConnected.value) {
        //         bindChannels()
        //         isConnected.value = true
        //     } else if (!isEmpty(echo.value)) {
        //         // echo.value.disconnect()
        //     }
        // }, { immediate: true })

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

<style>
.drop-not {
    max-height: 500px;
    overflow-y: auto;
}

.custom-drop .q-btn-dropdown__arrow{
    display: none !important;
}

::-webkit-scrollbar {
    width: 5px;
    height: 10px;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    background-color: white;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: rgb(24, 40, 83);
    border-radius: 10px;
}

.page-link {
    z-index: auto !important;
}

.noty-container {
    min-width: 350px;
}
</style>