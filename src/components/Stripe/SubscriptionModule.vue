<template>
    <div class="q-py-lg row rounded">
        <div class="col-12 col-md-2">
            <p class="text-gray-700 h3 text-md-right" v-if="!viewOnly">Planes disponibles</p>
            <p class="text-gray-700 h3 text-md-right" v-else>Plan actual</p>
        </div>
        <q-separator class="d-none d-md-block" spaced="30px" vertical />
        <div class="col q-px-lg q-gutter-md">
            <!-- <pricing-cards :plans="plans"/> -->
            <pricing-cards-old :viewOnly="viewOnly" :plans="plans" />
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import PricingCards from './PricingCards.vue'
import PricingCardsOld from './PricingCardsOld.vue'
import { useStore } from 'vuex'
export default {
    inheritAttrs: true,
    components: { PricingCards, PricingCardsOld },
    props: {
        viewOnly: {
            type: Boolean,
            default: false
        },
        planId: {}
    },
    setup(props) {
        const store = useStore()
        const plans = ref([])
        async function getPlans() {
            let url = `subscription`
            if (props.planId && store.state.is_superadmin) {
                const wheres = JSON.stringify({
                    id: props.planId
                })
                url += `?wheres=${wheres}`
            }
            const res = await modelService.api({ url })
            plans.value = res?.data?.data ?? []
        }

        getPlans()

        return {
            plans
        }
    }
}
</script>
