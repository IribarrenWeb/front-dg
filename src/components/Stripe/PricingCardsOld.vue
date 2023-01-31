<template>
    <q-card class="shadow-2 q-mx-lg custom-shadow-sm" :class="{ 'border border-primary': idx == 2 && plan.id != actualPlan, 'border border-success': plan.id == actualPlan }" v-for="plan, idx in plans"
        :key="idx">
        <q-card-section>
            <div class="flex items-center q-mx-md">
                <q-icon color="primary" name="fa-solid fa-infinity" class="q-mr-md" size="40px" v-if="idx == 0" />
                <q-icon color="primary" name="fa-regular fa-handshake" class="q-mr-md" size="40px" v-if="idx == 1" />
                <q-icon color="primary" name="fa-regular fa-square-plus" class="q-mr-md" size="40px" v-if="idx == 2" />
                <q-icon color="primary" name="fa-solid fa-bolt" class="q-mr-md" size="40px" v-if="idx == 3" />
                <div>
                    <div class="text-h6 text-blue-10 text-uppercase">{{ plan.name }}</div>
                    <div class="text-subtitle2">
                        <span class="h3">{{ plan.price }}</span>
                        <q-icon size="10px" class="q-ml-sm" name="fa-solid fa-euro-sign" />
                        / año
                    </div>
                </div>
                <q-space />
                <q-badge floating color="primary" v-if="idx == 2 && plan.id != actualPlan" text-color="white" label="Recomendado" />
                <q-badge floating color="success" v-if="plan.id == actualPlan" text-color="white" label="Plan actual" />
                <q-btn color="primary" v-if="plan.id != actualPlan" label="Suscribirse" @click="onClick" />
                <!-- <q-btn color="primary" v-else disable label="Suscrito" @click="onClick" /> -->
            </div>

            <q-separator spaced />
            <q-expansion-item group="somegroup" label="Beneficios" default-opened header-class="text-primary">
                <q-card>
                    <q-card-section>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos
                        corrupti
                        commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto
                        suscipit iste
                        eveniet doloribus ullam aliquid.
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-card-section>
    </q-card>
</template>
<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    props: {
        plans: {}
    },
    setup(props) {
        const store = useStore()
        const actualPlan = computed(() => store.state?.profile?.me?.subscription_plan_id)

        return {
            actualPlan
        }
    }
}
</script>