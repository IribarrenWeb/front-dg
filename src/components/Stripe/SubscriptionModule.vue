<template>
    <div>
        <q-card class="my-card" v-for="plan, idx in plans" :key="idx">
            <img src="https://cdn.quasar.dev/img/mountains.jpg">
            <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">by John Doe</div>
            </q-card-section>
            <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
export default {
    props:{

    },
    setup(props) {
        const plans = ref([])
        async function getPlans(){
            plans.value = modelService.api({url: `billing/plans`})
        }

        getPlans()

        return {
            plans
        }
    }
}
</script>
