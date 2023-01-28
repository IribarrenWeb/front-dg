<template>
    <q-dialog full-height :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
        <q-card style="min-width: 800px;" class="form-control-stripe">
            <q-card-section class="text-uppercase flex justify-between">
                <b>Agregar tarjeta</b>
                <q-btn color="primary" flat icon="fa-solid fa-xmark" v-close-popup />
            </q-card-section>
            <q-separator spaced />
            <q-card-section class="pt-0">
                <q-inner-loading :showing="!stripeLoaded" style="z-index: 1000;">
                    <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
                <q-stepper class="pt-0" bordered v-model="step" ref="stepper" color="primary" animated vertical>
                    <q-step :name="1" title="Dirección de Facturación" icon="fa-regular fa-address-card"
                        :done="step > 1">
                        <q-form @submit="submit" id="address-form" class="q-gutter-md">
                            <!-- <h3>Dirección de Facturación</h3> -->
                            <div id="address-element">
                                <!-- Elements will create form elements here -->
                            </div>
                            <q-btn label="Siguiente" type="submit" color="primary" :loading="loading" />
                        </q-form>
                    </q-step>
                    <q-step :name="2" title="Información de la tarjeta" icon="fa-regular fa-credit-card"
                        :done="step > 2">
                        <!-- <q-input v-model="model.name" outlined type="text" label="Nombre del titular" /> -->
                        <div class="form-control" id="card-element"></div>
                        <q-btn label="Agregar tarjeta" class="q-mt-md" color="primary" :loading="loading"
                            @click="submit" />
                    </q-step>
                    <!-- <template v-slot:navigation>
                        <q-stepper-navigation>
                            <q-btn @click="refs.stepper.next()" color="primary"
                                :label="step === 2 ? 'Finish' : 'Continue'" />
                            <q-btn v-if="step > 1" flat color="primary" @click="refs.stepper.previous()" label="Back"
                                class="q-ml-sm" />
                        </q-stepper-navigation>
                    </template> -->
                </q-stepper>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js'
import { stripeKey } from '../../axios/index'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import { onBeforeMount, ref, watch, watchEffect } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { env } from '../../boot/env'

export default {
    inheritAttrs: true,
    props: {
        modelValue: {}
    },
    components: {
        StripeElements,
        StripeElement,
    },
    setup(props, { emit }) {
        const sKey = stripeKey
        const stripe = ref(null);
        const stripeLoaded = ref(false)
        // const elements = stripe.elements();
        const elements = ref(null);
        // const cardElement = elements.create('card');
        const cardElement = ref(null);
        const addressElement = ref(null);
        const intent = ref(null)
        const model = ref({
            name: null
        })
        const address = ref(null)
        const step = ref(1)
        const loading = ref(false)
        function initStripe() {
            elements.value = stripe.value.elements({
                appearance: {
                    theme: 'stripe',
                    // labels: 'floating',
                    variables: {
                        fontSize: '10px',
                        fontLineHeight: '1.5',
                        borderRadius: '10px',
                    },
                    rules: {
                        '.Block': {
                            backgroundColor: 'primary',
                            boxShadow: 'none',
                            padding: '12px'
                        },
                        '.Input': {
                            padding: '12px'
                        },
                        '.Input': {
                            height: '56px !important',
                            fontSize: '10px'
                        },
                        '.Error': {
                            fontSize: '10px'
                        },
                        '.Label': {
                            fontSize: '10px'
                        },
                    }
                }
            })
            cardElement.value = elements.value.create('card')
            addressElement.value = elements.value.create("address", {
                mode: "billing",
                allowedCountries: ['ES'],
                autocomplete: {
                    mode: "google_maps_api",
                    apiKey: env.googleApiKey,
                },
            })

        }

        function mountElements() {
            setTimeout(() => {
                if (step.value == 1) {
                    addressElement.value.mount("#address-element");
                } else if (step.value == 2) {
                    cardElement.value.mount('#card-element');
                }
            }, 500);
        }

        async function getIntent() {
            const res = await modelService.api({ url: 'billing/intent' })
            intent.value = res?.data
        }

        onBeforeMount(async () => {
            stripe.value = await loadStripe(sKey)
            stripeLoaded.value = true
        })

        getIntent()

        async function submit() {
            console.log('step', step.value);
            if (step.value == 1) {
                const addressElement = elements.value.getElement('address');
                const { complete, value } = await addressElement.getValue();
                if (complete) {
                    address.value = value
                    step.value++
                } else {
                    Notify.create({
                        message: 'Dirección incompleta',
                        color: 'negative'
                    })
                }

            } else if (step.value == 2) {
                console.log('step 2', step.value);
                loading.value = true
                const { setupIntent, error } = await stripe.value.confirmCardSetup(intent.value, {
                    payment_method: {
                        card: cardElement.value,
                        billing_details: address.value
                    }
                })

                if (error) {
                    Notify.create({
                        message: error.message,
                        color: 'negative'
                    })
                    loading.value = false

                } else {
                    try {
                        await modelService.api({ url: 'billing/payment-method', method: 'POST', data: { payment_id: setupIntent.payment_method } })
                        Notify.create({
                            message: 'Metodo de pago agregado exitosamente!',
                            color: 'positive'
                        })
                        loading.value = false

                        emit('created')

                        initStripe()

                    } catch (error) {
                        loading.value = false

                        const message = error?.response?.data?.message ?? error?.response?.message ?? 'Ocurrio un error al guardar el metodo de pago'
                        Notify.create({
                            message,
                            color: 'negative'
                        })
                    }
                }
            }

        }

        watch(() => stripe.value, (v) => {
            if (v) initStripe()
        }, { immediate: true, deep: true })

        watchEffect(() => {
            if (!stripe.value || !elements.value) return

            if (step.value) mountElements()
        })

        return {
            sKey,
            model,
            intent,
            stripeLoaded,
            stripeKey,
            loading,
            step,
            submit,
        }
    }
}
</script>

<style lang="scss">
.form-control-stripe {
    input {
        height: 56px !important;
        color: var(--q-primary) !important;
        max-width: 100%;
    }

    .q-stepper--vertical .q-stepper__dot:after{
        visibility: hidden;
    }

    .q-stepper--vertical .q-stepper__dot:before{
        visibility: hidden;
    }

    .q-stepper {
        border: unset;
        box-shadow: none;
    }

    .q-stepper--vertical .q-stepper__step{
        overflow: visible !important;
    }
}
</style>