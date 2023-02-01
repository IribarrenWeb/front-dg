<template>
    <q-dialog v-model="confirm" persistent>
        <q-card style="width: 500px;">
            <q-card-section class="flex justify-between">
                <div>
                    {{ planData?.name }}
                    <span> | Conectar con stripe</span>
                </div>
                <q-btn color="primary" flat dense icon="fa-solid fa-xmark" v-close-popup/>
            </q-card-section>
            <q-separator spaced />
            <q-card-section class="">
                <q-form
                    @submit="updatePlan"
                    ref="formRef"
                    class="px-2"
                >
                    <q-input v-model="model.stripe_price" :rules="[val => val?.length >= 10 || 'Clave requerida']" outlined type="text" label="Stripe price" />
                    <q-input v-model="model.stripe_product" :rules="[val => val?.length >= 10 || 'Clave requerida']" outlined type="text" label="Stripe product" />
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancelar" color="primary" v-close-popup />
                <q-btn outline label="Guardar claves" :loading="loading" color="primary" @click="formRef?.submit()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
import { ref } from '@vue/reactivity'
import modelService from '../../../store/services/model-service'
import { watch } from '@vue/runtime-core'
import { Notify } from 'quasar'
export default {
    inheritAttrs: true,
    props: {
        planId: {},
        planData: {}
    },
    setup(props, { emit }) {
        const model = ref({
            stripe_price: null,
            stripe_product: null
        })
        const loading = ref(false)
        const formRef = ref(null)

        async function updatePlan() {
            try {
                loading.value = true
                await modelService.apiNoLoading({url:`subscription/${props.planId}`, method: 'PUT', data: model.value})
                loading.value = false
                Notify.create({
                    message: 'Plan conectado exitosamente',
                    color: 'positive'
                })
                
                emit('saved')
                emit('update:model-value',false);

            } catch (error) {
                loading.value = false
                const message = error?.response?.messae ?? error?.response?.data?.message ?? 'Ocurrio un error al actualizar las keys del plan'
                Notify.create({
                    message,
                    color: 'negative'
                })
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
            loading,
            updatePlan
        }
    }
}
</script>