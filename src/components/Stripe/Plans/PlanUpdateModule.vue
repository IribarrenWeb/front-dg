<template>
    <q-dialog v-model="confirm" persistent>
        <q-card style="width: 500px;">
            <q-card-section class="flex justify-between">
                Conectar con stripe
                <q-btn color="primary" flat dense icon="fa-solid fa-xmark" v-close-popup/>
            </q-card-section>
            <q-separator spaced />
            <q-card-section class="">
                <q-form
                    @submit="updatePlan"
                    ref="form"
                    class="px-2"
                >
                    <q-input v-model="model.stripe_price" outlined type="text" label="Stripe price" />
                    <q-input v-model="model.stripe_product" outlined type="text" label="Stripe product" />
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancelar" color="primary" v-close-popup />
                <q-btn outline label="Guardar claves" color="primary" @click="formRef?.submit()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
import { ref } from '@vue/reactivity'
import modelService from '../../../store/services/model-service'
import { watch } from '@vue/runtime-core'
export default {
    inheritAttrs: true,
    props: {
        planId: {},
        planData: {}
    },
    setup(props) {
        const model = ref({
            stripe_price: null,
            stripe_product: null
        })
        const formRef = ref(null)

        async function updatePlan() {
            try {
                const res = modelService.apiNoLoading({})
            } catch (error) {

            }
        }

        watch(() => props.planData, (v) => {
            if (!v) return

            model.value.stripe_price = v?.stripe_price
            model.value.stripe_product = v?.stripe_product
        }, { immediate: true, deep: true })
        return {
            model,
            formRef,
            updatePlan
        }
    }
}
</script>