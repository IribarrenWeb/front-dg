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
                    <q-btn color="primary" icon="add" outline label="Agregar tarjeta" @click="addPayment = true" />
                </div>
                <create-card-element v-if="addPayment && tab == 'cards'" v-model="addPayment" @created="addPayment = false, getPaymentMethods()" />
                <q-separator spaced="20px" />
                <payment-method-list-module :forCard="true" :defaultPayment="defaultPayment" :paymentMethods="paymentMethods"  @delete="deletePaymentMethod" @updateDefault="updateDefault"/>
            </q-tab-panel>
            <q-tab-panel name="banks">
                <div class="text-h6 flex justify-between">
                    Cuentas bancarias
                    <q-btn color="primary" icon="add" outline label="Agregar SEPA" @click="addPayment = true" />
                </div>
                <create-bank-element v-if="addPayment && tab == 'banks'" v-model="addPayment" @created="addPayment = false, getPaymentMethods()" />
                <q-separator spaced="20px" />
                <payment-method-list-module :paymentMethods="paymentMethods" :defaultPayment="defaultPayment" @delete="deletePaymentMethod" @updateDefault="updateDefault"/>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import CreateCardElement from './CreateCardElement.vue'
import modelService from '../../store/services/model-service'
import { Notify, Dialog } from 'quasar'
import CreateBankElement from './CreateBankElement.vue'
import PaymentMethodListModule from './Modules/PaymentMethodListModule.vue'
import { computed, watch } from '@vue/runtime-core'
export default {
    components: { CreateCardElement, CreateBankElement, PaymentMethodListModule },
    name: 'payment-methods',
    props: {

    },
    setup(props) {
        const tab = ref('cards')
        const addPayment = ref(false)
        const paymentMethods = ref([])
        const loading = ref(false)
        const defaultPayment = ref(null)
        const type = computed(() => tab.value == 'banks' ? 'sepa_debit' : 'card')

        async function getPaymentMethods() {
            try {
                const res = await modelService.api({ url: `billing/payment-method?type=${type.value}` })
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

        watch(() => type.value, (v) => getPaymentMethods())

        return {
            tab,
            addPayment,
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