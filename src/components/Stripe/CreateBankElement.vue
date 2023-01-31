<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
        <q-card style="min-width: 800px;" class="form-control-stripe">
            <q-card-section class="text-uppercase flex justify-between">
                <b>Agregar ENTIDAD BANCARIA (SEPA)</b>
                <q-btn color="primary" flat icon="fa-solid fa-xmark" v-close-popup />
            </q-card-section>
            <q-separator spaced />
            <q-card-section class="pt-0">
                <q-inner-loading :showing="!stripeLoaded" style="z-index: 1000;">
                    <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
                <q-form @submit="submit" ref="formRef" class="row">

                    <base-field label="Nombre titular" class="col-6">
                        <q-input v-model="model.name" type="text" dense outlined />
                    </base-field>
                    <base-field label="Email" class="col-6">
                        <q-input v-model="model.email" type="email" dense outlined />
                    </base-field>
                    <base-field label="Iban" class="col-12">
                        <div id="iban-element" class="form-control">
                            <!-- A Stripe Element will be inserted here. -->
                        </div>
                    </base-field>

                    <p class="p-2 border border-primary bg-grey-2 mt-4 rounded text-muted text-justify col-12"
                        style="font-size: 10px; line-height: 20px;">
                        Al proporcionar su información de pago y confirmar este pago, usted
                        autorizar (A) LANA AIR&SEA SLU y Stripe, nuestro proveedor de servicios de pago
                        y/o PPRO, su proveedor de servicios local, para enviar instrucciones a su
                        banco para debitar su cuenta y (B) su banco para debitar su cuenta en
                        de acuerdo con esas instrucciones. Como parte de sus derechos, usted está
                        derecho a un reembolso de su banco bajo los términos y condiciones de
                        su acuerdo con su banco. Se debe reclamar un reembolso dentro de las 8 semanas
                        a partir de la fecha en que se debitó su cuenta. Sus derechos
                        se explican en un extracto que puede obtener de su banco. Usted
                        acepta recibir notificaciones de futuros débitos hasta 2 días antes
                        ocurren.
                    </p>
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="primary" @click="$emit('update:model-value', false)" flat
                    class="q-ml-sm" />
                <q-btn label="Agregar SEPA" v-if="$refs?.formRef" type="submit" @click="$refs?.formRef?.submit()"
                    color="primary" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js'
import { stripeKey } from '../../axios/index'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import { computed, onBeforeMount, ref, watch, watchEffect } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { useStore } from 'vuex'

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
        const store = useStore()
        const user = computed(() => store.state?.profile?.me)
        const stripe = ref(null);
        const stripeLoaded = ref(false)
        // const elements = stripe.elements();
        const elements = ref(null);
        // const cardElement = elements.create('card');
        const ibanElement = ref(null);
        const intent = ref(null)
        const model = ref({
            name: null,
            email: null
        })
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

            const options = {
                // style,
                supportedCountries: ['SEPA'],
                // Elements can use a placeholder as an example IBAN that reflects
                // the IBAN format of your customer's country. If you know your
                // customer's country, we recommend passing it to the Element as the
                // placeholderCountry.
                placeholderCountry: 'ES',
            };

            ibanElement.value = elements.value.create('iban', options)

        }

        function mountElements() {
            setTimeout(() => {
                ibanElement.value.mount("#iban-element");
            }, 500);
        }

        async function getIntent() {
            const res = await modelService.api({ url: 'billing/intent?type=sepa_debit' })
            intent.value = res?.data
        }

        onBeforeMount(async () => {
            stripe.value = await loadStripe(sKey)
            stripeLoaded.value = true
        })

        getIntent()

        async function submit() {

            loading.value = true
            const { setupIntent, error } = await stripe.value.confirmSepaDebitSetup(intent.value, {
                payment_method: {
                    sepa_debit: ibanElement.value,
                    billing_details: model.value
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

        watch(() => stripe.value, (v) => {
            if (v) initStripe()
        }, { immediate: true, deep: true })

        watchEffect(() => {
            if (!stripe.value || !elements.value) return
            mountElements()
        })

        watch(() => user.value, (v) => {
            if (v) {
                model.value.name = v?.full_name
                model.value.email = v?.email
            }
        }, { immediate: true })

        return {
            sKey,
            model,
            intent,
            stripeLoaded,
            stripeKey,
            loading,
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

    .q-stepper--vertical .q-stepper__dot:after {
        visibility: hidden;
    }

    .q-stepper--vertical .q-stepper__dot:before {
        visibility: hidden;
    }

    .q-stepper {
        border: unset;
        box-shadow: none;
    }

    .q-stepper--vertical .q-stepper__step {
        overflow: visible !important;
    }
}
</style>