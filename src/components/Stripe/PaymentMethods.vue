<template>
    <div>
        <q-tabs v-model="tab" class="text-primary" align="justify">
            <q-tab name="cards" icon="fa-regular fa-credit-card" label="Tarjetas" />
            <q-tab name="banks" icon="fa-solid fa-building-columns" label="Bancarios" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated keep-alive swipeable class="p-0 p-md-4">
            <q-tab-panel name="cards">
                <div class="text-h6 flex justify-between">
                    Tarjetas
                    <q-btn color="primary" icon="add" outline label="Agregar tarjeta" @click="addCard = true" />
                </div>
                <create-card-element v-if="addCard" v-model="addCard" @created="addCard = false, getPaymentMethods()" />
                <q-separator spaced="20px" />
                <q-list bordered>
                    <q-item clickable v-ripple v-for="payment, idx in paymentMethods" :key="idx">
                        <q-item-section avatar>
                            <q-icon color="primary" :name="`fa-brands fa-cc-${payment.card.brand}`" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>xxxx-{{ payment.card.last4 }}</q-item-label>
                            <q-item-label caption>Titular: {{ payment.billing_details?.name }}</q-item-label>
                            <q-item-label caption>Expira {{ payment.card?.exp_month }}/{{
                                payment.card?.exp_year
                            }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <div class="flex q-gutter-md">
                                <q-btn v-if="payment.id != defaultPayment.id" flat dense color="primary" icon="fa-regular fa-star"
                                    @click="updateDefault(payment.id)">
                                    <q-tooltip>
                                        Establecer como predeterminado
                                    </q-tooltip>
                                </q-btn>
                                <q-badge v-else color="grey-5" text-color="grey-8" rounded label="Predeterminado" />
                                <q-btn flat dense color="primary" icon="fa-solid fa-trash-can" :loading="loading"
                                    @click="deletePaymentMethod(payment.id)">
                                    <q-tooltip>
                                        Eliminar metodo de pago
                                    </q-tooltip>
                                </q-btn>
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="!paymentMethods?.length">
                        <q-item-section>
                            <q-item-label>Sin metodos de pago registrados</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-tab-panel>
            <q-tab-panel name="banks">
                <div class="text-h6">Cuentas bancarias</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import CreateCardElement from './CreateCardElement.vue'
import modelService from '../../store/services/model-service'
import { Notify, Dialog } from 'quasar'
export default {
    components: { CreateCardElement },
    name: 'payment-methods',
    props: {

    },
    setup(props) {
        const tab = ref('cards')
        const addCard = ref(false)
        const paymentMethods = ref([])
        const loading = ref(false)
        const defaultPayment = ref(null)

        async function getPaymentMethods() {
            try {
                const res = await modelService.api({ url: 'billing/payment-method' })
                paymentMethods.value = res?.data.payment_methods ?? []
                defaultPayment.value = res?.data.default ?? []
            } catch (error) {
                Notify.create({
                    message: 'Ocurrio un error al obtener los metodos de pago',
                    color: 'negative'
                })
            }
        }

        function deletePaymentMethod(payment_id) {
            Dialog.create({
                title: 'Eliminar metodo de pago',
                message: '¿Esta seguro de eliminar este metodo de pago?',
                ok: {
                    label: 'Eliminar',
                    outline: true
                },
                cancel: {
                    label: 'Cancelar'
                }
            }).onOk(async () => {
                try {
                    loading.value = true
                    await modelService.api({ url: `billing/payment-method/${payment_id}`, method: 'DELETE' })
                    getPaymentMethods()
                    loading.value = false
                } catch (error) {
                    loading.value = false
                    Notify.create({
                        message: 'Ocurrio un error al eliminar el metodo de pago',
                        color: 'negative'
                    })
                }
            })
        }

        function updateDefault(payment_id) {
            Dialog.create({
                title: 'Establecer como predeterminado',
                message: '¿Esta seguro de establecer este metodo de pago como predeterminado?',
                ok: {
                    label: 'Aceptar',
                    outline: true
                },
                cancel: {
                    label: 'Cancelar'
                }
            }).onOk(async () => {
                try {
                    loading.value = true
                    await modelService.apiNoLoading({ url: `billing/payment-method/default/${payment_id}`, method: 'PUT' })
                    getPaymentMethods()
                    loading.value = false
                } catch (error) {
                    loading.value = false
                    const message = error?.response?.message ?? error?.response?.data?.message ?? 'Ocurrio un error al establecer este metodo de pago como predeterminado'
                    Notify.create({
                        message,
                        color: 'negative'
                    })
                }
            })
        }

        getPaymentMethods()

        return {
            tab,
            addCard,
            loading,
            paymentMethods,
            defaultPayment,
            updateDefault,
            deletePaymentMethod,
            getPaymentMethods,
        }
    }
}
</script>