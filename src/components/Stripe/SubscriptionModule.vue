<template>
    <div class="q-py-lg row rounded">
        <div class="col-12 col-md-2">
            <p class="text-gray-700 h3 text-md-right">Planes disponibles</p>
        </div>
        <q-separator class="d-none d-md-block" spaced="30px" vertical />
        <div class="col q-px-lg q-gutter-md">
            <!-- <pricing-cards :plans="plans"/> -->
            <pricing-cards-old :plans="plans" />
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import PricingCards from './PricingCards.vue'
import PricingCardsOld from './PricingCardsOld.vue'
export default {
    inheritAttrs: true,
    components: { PricingCards, PricingCardsOld },
    props: {

    },
    setup(props) {
        const plans = ref([])
        async function getPlans() {
            const res = await modelService.api({ url: `subscription` })
            plans.value = res?.data?.data ?? []
        }

        getPlans()

        return {
            plans
        }
    }
}
</script>
