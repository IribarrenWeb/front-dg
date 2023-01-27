<template>
    <q-card style="max-width: 1100px;margin: auto;">
        <q-card-section >
            <q-inner-loading :showing="!stripeLoaded" style="z-index: 1000;">
                <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
            <q-form @submit="onSubmit" @reset="onReset" class="row q-col-gutter-md">
                <div class="col-12 col-md-3">
                    <p class="text-gray-700">Información de tarjeta</p>
                </div>
                <div class="col">
                    <q-input v-model="text" outlined type="text" label="Nombre del titular" />
                    <div class="form-control" id="card-element"></div>
                </div>
            </q-form>
        </q-card-section>
        <q-card-actions align="right">
            <q-btn label="Agregar" type="submit" color="primary" />
        </q-card-actions>
    </q-card>
    <div>
    </div>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js'
import { stripeKey } from '../../axios/index'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import { onBeforeMount, ref, watch } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'

export default {
    props: {

    },
    components: {
        StripeElements,
        StripeElement,
    },
    setup(props) {
        const sKey = stripeKey
        const stripe = ref(null);
        const stripeLoaded = ref(false)
        // const elements = stripe.elements();
        const elements = ref(null);
        // const cardElement = elements.create('card');
        const cardElement = ref(null);
        const intent = ref(null)

        function initStripe() {
            elements.value = stripe.value.elements()
            cardElement.value = elements.value.create('card')
            cardElement.value.mount('#card-element');
        }

        async function getIntent() {
            const res = await modelService.api({url:'billing/intent'})
            intent.value = res
        }

        onBeforeMount(async () => {
            stripe.value = await loadStripe(sKey)
            stripeLoaded.value = true
        })

        getIntent()

        const submit = () => {

        }

        watch(() => stripe.value, (v) => {
            if (v) initStripe()
        }, { immediate: true, deep: true })

        return {
            sKey,
            pay,
            intent,
            stripeLoaded,
            stripeKey
        }
    }
}
</script>