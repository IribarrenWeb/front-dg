<template>
    <div>
        <q-list bordered v-if="forCard">
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
                        <q-btn v-if="payment.id != defaultPayment.id" flat dense color="primary"
                            icon="fa-regular fa-star" @click="$emit('updateDefault',payment.id)">
                            <q-tooltip>
                                Establecer como predeterminado
                            </q-tooltip>
                        </q-btn>
                        <q-badge v-else color="grey-5" text-color="grey-8" rounded label="Predeterminado" />
                        <q-btn flat dense color="primary" icon="fa-solid fa-trash-can" :loading="loading"
                            @click="$emit('delete',payment.id)">
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

        <q-list bordered v-else>
            <q-item clickable v-ripple v-for="payment, idx in paymentMethods" :key="idx">
                <q-item-section avatar>
                    <q-icon color="primary" :name="`fa-solid fa-building-columns`" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>xxxx-{{ payment.sepa_debit.last4 }}</q-item-label>
                    <q-item-label caption>Titular: {{ payment.billing_details?.name }}</q-item-label>
                    <q-item-label caption>Codigo de banco {{ payment.sepa_debit?.bank_code }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <div class="flex q-gutter-md">
                        <q-btn v-if="payment.id != defaultPayment.id" flat dense color="primary"
                            icon="fa-regular fa-star" @click="$emit('updateDefault',payment.id)">
                            <q-tooltip>
                                Establecer como predeterminado
                            </q-tooltip>
                        </q-btn>
                        <q-badge v-else color="grey-5" text-color="grey-8" rounded label="Predeterminado" />
                        <q-btn flat dense color="primary" icon="fa-solid fa-trash-can" :loading="loading"
                            @click="$emit('delete',payment.id)">
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
    </div>
</template>
<script>
export default {
    props: {
        forCard: {
            type: Boolean,
            default: false
        },
        paymentMethods: {},
        defaultPayment: {},
        loading: {}
    }, setup(props) {
        return {

        }
    }
}
</script>