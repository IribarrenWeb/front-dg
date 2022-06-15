<template>
    <div>
        <base-dropdown class="nav-item" position="right">
            <template v-slot:title>
                <a class="nav-link nav-link-icon" :class="{'text-white':!dark}" href="#" role="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i class="ni ni-bell-55"></i>
                </a>
            </template>
            
            <div v-if="notifications.length >= 1">
                <a class="dropdown-item" href="#" v-for="notification in notifications" :key="notification.id">Action</a>
            </div>
            <div class="p-2" v-else>
                Sin notificaciones
            </div>
        </base-dropdown>
    </div>
</template>

<script>
import { ref } from 'vue';
import service from '../store/services/model-service';

export default {
    props:{
        dark: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const notifications = ref([]);

        async function getNotifications(){
            try {
                const res = await service.api('notifications');
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }

        getNotifications();

        return {
            notifications
        }
    }
}
</script>