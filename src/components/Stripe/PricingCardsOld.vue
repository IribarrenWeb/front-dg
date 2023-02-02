<template>
    <q-card class="shadow-2 q-mx-lg custom-shadow-sm"
        :class="{ 'border border-primary': idx == 2 && plan.stripe_price != actualPlanStripe?.stripe_price, 'border border-success': plan.stripe_price == actualPlanStripe?.stripe_price }"
        v-for="plan, idx in plans" :key="idx">
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
                <q-badge floating color="primary" v-if="idx == 2 && plan.stripe_price != actualPlanStripe?.stripe_price" text-color="white"
                    label="Recomendado" />
                <q-badge floating color="success" v-if="plan.stripe_price == actualPlanStripe?.stripe_price" text-color="white"
                    label="Plan actual" />
                <div v-if="idx >= 1">
                    <!-- Suscribirse -->
                    <q-btn color="primary" v-if="plan.stripe_price != actualPlanStripe?.stripe_price && !actualPlanStripe?.stripe_price"
                        :disable="!plan?.is_active" label="Suscribirse" @click="handleAction('subscribe', plan)"
                        :loading="loading" />

                    <!-- Cancelar suscripcion -->
                    <q-btn color="danger" outline v-else-if="plan.stripe_price == actualPlanStripe?.stripe_price && !actualPlanStripe?.ends_at"
                        :disable="!plan?.is_active" label="Cancelar" @click="handleAction('cancel', plan)"
                        :loading="loading" />

                    <!-- Reanudar suscripcion -->
                    <q-btn color="primary" v-else-if="plan.stripe_price == actualPlanStripe?.stripe_price && actualPlanStripe?.ends_at"
                        :disable="!plan?.is_active" label="Reanudar" @click="handleAction('resume', plan)"
                        :loading="loading" />

                    <!-- Cambiar suscripcion -->
                    <q-btn color="primary" v-else-if="plan.stripe_price != actualPlanStripe?.stripe_price" :disable="!plan?.is_active"
                        label="Cambiar plan" @click="handleAction('change', plan)" :loading="loading" />

                    <q-tooltip v-if="!plan?.is_active">
                        Este plan no esta disponible actualmente
                    </q-tooltip>
                </div>
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
import { computed, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { Dialog, Notify } from 'quasar'
import modelService from '../../store/services/model-service'
export default {
    props: {
        plans: {}
    },
    setup(props) {
        const store = useStore()
        const actualPlan = ref(null)
        const actualPlanStripe = ref(null)
        const loading = ref(false)

        async function getSubscriptions() {
            try {
                loading.value = true
                const res = await modelService.apiNoLoading({ url: `billing/subscription` })
                loading.value = false
                console.log(res.data);
                actualPlanStripe.value = res?.data?.stripe && res?.data?.stripe?.length ? res.data.stripe[0] : null
                actualPlan.value = res?.data?.local ? res.data.local : null
            } catch (error) {
                loading.value = false

            }
        }

        function executeAction(data) {
            const { action, plan, options, notifyErrorMessage, notifySuccessMessage } = data;

            Dialog.create(options).onOk(async () => {
                if (!plan?.is_active) {
                    Notify.create({
                        message: 'Este plan no esta disponible actualmente',
                        color: 'negative'
                    })
                    return
                }

                try {
                    loading.value = true
                    await modelService.apiNoLoading({ url: `billing/subscription/actions/${action}`, data: { plan_id: plan.id, price_id: plan.stripe_price }, method: 'POST' })
                    Notify.create({
                        message: notifySuccessMessage,
                        color: 'positive'
                    })
                    loading.value = false

                    getSubscriptions()

                } catch (error) {
                    loading.value = false

                    const message = error?.response?.message ?? error?.response?.data?.message ?? notifyErrorMessage
                    Notify.create({
                        message,
                        color: 'negative'
                    })
                }
            })
        }
        function handleAction(action, plan) {
            if (!['change', 'subscribe', 'resume', 'cancel'].includes(action)) {
                Notify.create({
                    message: 'Acción no disponible',
                    color: 'negative'
                })
                return
            }

            let options = {}
            let notifyErrorMessage = null
            let notifySuccessMessage = null

            switch (action) {
                case 'subscribe':
                    options = {
                        title: `Suscribirse al plan ${plan.name}`,
                        message: '¿Estas seguro de suscribirte a este plan?',
                        ok: { label: 'Suscribirse', },
                        cancel: { label: 'Cancelar', outline: true }
                    }
                    notifyErrorMessage = 'Ocurrio un error al crear la suscripción'
                    notifySuccessMessage = 'Suscripción creada exitosamente'
                    break;
                case 'resume':
                    options = {
                        title: `Reanudar suscripción al plan ${plan.name}`,
                        message: '¿Estas seguro de reanudar tu suscripción a este plan?',
                        ok: { label: 'Reanudar', },
                        cancel: { label: 'Cancelar', outline: true }
                    }
                    notifyErrorMessage = 'Ocurrio un error al reanudar la suscripción'
                    notifySuccessMessage = 'Se ha reanudado la suscripción exitosamente!'
                    break;
                case 'change':
                    options = {
                        title: `Cambiar al plan ${plan.name}`,
                        message: '¿Estas seguro de cambiarte a este plan?',
                        ok: { label: 'Cambiar', },
                        cancel: { label: 'Cancelar', outline: true }
                    }
                    notifyErrorMessage = 'Ocurrio un error al cambiar la suscripción'
                    notifySuccessMessage = 'Se ha actualizado la suscripción exitosamente!'
                    break;
                case 'cancel':
                    options = {
                        title: `Cancelar el plan ${plan.name}`,
                        message: '¿Estas seguro de cancelar tu suscripción este plan?',
                        ok: { label: 'Cancelar suscripción', },
                        cancel: { label: 'NO cancelar', outline: true }
                    }
                    notifyErrorMessage = 'Ocurrio un error al cancelar la suscripción'
                    notifySuccessMessage = 'Se ha cancelado la suscripción exitosamente!'
                    break;

                default:
                    break;
            }

            executeAction({ options, action, plan, notifyErrorMessage, notifySuccessMessage })
        }

        getSubscriptions()

        return {
            actualPlan,
            loading,
            actualPlanStripe,
            handleAction
        }
    }
}
</script>