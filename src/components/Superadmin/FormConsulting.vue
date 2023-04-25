<template>
    <div>
        <div class="full-width flex q-mb-md" v-if="!profileMode">
            <div>
            </div>
            <q-space />
            <q-btn color="primary" flat icon="fa-solid fa-xmark" @click="$emit('cancel', true)" />
        </div>
        <q-tabs v-if="consultingId && !profileMode" v-model="tab" class="nav-pills-tabs" active-class="active-tab">
            <q-tab class="nav-link" name="data" label="Datos generales" />
            <q-tab class="nav-link" name="sub" label="Subscripción" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="data">
                <h3 v-if="!consultingId">{{ consultingId ? 'Editar' : 'Registrar' }} consultoria</h3>
                <q-separator v-if="!profileMode" spaced="20px" />
                <q-form @submit.prevent="submit" class="q-col-gutter-md">

                    <form-block title="Datos de consultoria">
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="consultancy_name" v-model="model.consultancy_name"
                                :rules="[val => val?.length || 'El nombre es requerido']" outlined type="text"
                                label="Nombre" />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="consultancy_email" v-model="model.consultancy_email"
                                :rules="[val => val?.length || 'El email es requerido']" outlined type="text"
                                label="Email" />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="cif_nif" v-model="model.cif_nif" mask="XXXXXXXXX"
                                :rules="[val => val?.length || 'El DNI es requerido']" outlined type="text"
                                label="CIF/DNI" />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="consultancy_phone" v-model="model.consultancy_phone"
                                mask="XXXXXXXXX" :rules="[val => val?.length || 'El movil es requerido']" outlined
                                type="text" label="Movil" />
                        </div>
                    </form-block>

                    <form-block title="Datos representante legal">
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="name" v-model="model.name"
                                :rules="[val => val?.length || 'El nombre es requerido']" outlined type="text"
                                label="Nombre" />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="email" v-model="model.email"
                                :rules="[val => val?.length || 'El email es requerido']" outlined type="text"
                                label="Email" />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="dni" v-model="model.dni" mask="XXXXXXXXX"
                                :rules="[val => val?.length || 'El DNI es requerido']" outlined type="text" label="DNI" />
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <qu-input-validation apiName="phone_number" v-model="model.phone_number" mask="XXXXXXXXX"
                                :rules="[val => val?.length || 'El movil es requerido']" outlined type="text"
                                label="Movil" />
                        </div>
                    </form-block>


                    <form-block title="Dirección">
                        <address-select-v-2 v-model:address="model.address.address" v-model:city="model.address.city"
                            v-model:code="model.address.code" v-model:comunity="model.address.comunity"
                            v-model:province="model.address.province" v-model:country="model.address.country"
                            v-model:street_number="model.address.street_number" />
                    </form-block>

                    <div class="col-12 flex items-center justify-end q-gutter-md">
                        <q-btn label="Cancelar" type="reset" color="primary" @click="$emit('cancel', true)" flat
                            class="q-ml-sm" v-if="!profileMode" />

                        <q-btn label="Guardar" :loading="loading" type="submit" color="primary" />
                    </div>
                </q-form>
            </q-tab-panel>
            <q-tab-panel name="sub">
                <subscription-module :planId="consultancy_data?.user?.subscription_plan_id" viewOnly />
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { useStore } from 'vuex'
import AddressSelectV2 from '../core_components/AddressSelectV2.vue'
import FormBlock from '../Utils/FormBlock.vue'
import functions from '../../utils/functions'
import QuInputValidation from '../core_components/FormQuasar/QuInputValidation.vue'
import SubscriptionModule from '../Stripe/SubscriptionModule.vue'
export default {
    components: { AddressSelectV2, FormBlock, QuInputValidation, SubscriptionModule },
    props: {
        consultingId: {
            type: Number,
            default: null
        },
        profileMode: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const tab = ref('data')
        const store = useStore();
        const role = computed(() => store.getters.ROLE)
        const originalModel = ref(null)
        const model = ref({
            name: null,
            email: null,
            consultancy_name: null,
            cif_nif: null,
            consultancy_phone: null,
            consultancy_email: null,
            dni: null,
            phone_number: null,
            firm_date: null,
            address: {
                code: null,
                city: null,
                address: null,
                street_number: null,
                comunity: null,
                country: null,
                province: null,
            }
        })
        const loading = ref(false)
        const consultancy_data = ref(null)

        async function submit() {
            try {
                loading.value = true
                let action = 'registrada';
                if (consultancy_data.value) {
                    const data = functions.difference(originalModel.value, model.value)
                    if (data) {
                        await modelService.apiNoLoading({ url: `consulting/${props.consultingId}`, method: 'PUT', data: data })
                        emit('updated', true);
                    }
                    action = 'actualizada'
                } else {
                    await modelService.apiNoLoading({ url: `consulting`, method: 'POST', data: model.value })
                    emit('saved', true);
                }
                loading.value = false

                Notify.create({
                    message: 'Consultoria ' + action,
                    color: 'positive'
                })
            } catch (error) {
                console.error(error);
                const serverMessage = error?.request?.response ? JSON.parse(error?.request?.response) : null
                const message = serverMessage?.message ?? 'Ocurrio un error al registrar la consultoria';
                loading.value = false
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
        }

        async function getConsulting() {
            try {
                loading.value = true
                const res = await modelService.apiNoLoading({ url: `consulting/${props.consultingId}` })
                loading.value = false
                consultancy_data.value = res?.data?.data
            } catch (error) {
                const serverMessage = error?.request?.response ? JSON.parse(error?.request?.response) : null
                const message = serverMessage?.message ?? 'Ocurrio un error al obtener la consultoria';
                loading.value = false
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
        }

        watch(() => props.consultingId, (v) => {
            if (v) getConsulting()
        }, { immediate: true })

        watch(() => consultancy_data.value, (v) => {
            if (v?.id) {
                model.value = {
                    name: v?.user?.name,
                    email: v?.user?.email,
                    address: functions.assignSchema('address', v?.address),
                    consultancy_name: v?.consultancy_name,
                    cif_nif: v?.cif_nif,
                    consultancy_phone: v?.consultancy_phone,
                    consultancy_email: v?.consultancy_email,
                    dni: v?.dni,
                    phone_number: v?.phone_number,
                    firm_date: v?.firm_date
                }

                originalModel.value = JSON.parse(JSON.stringify(model.value))
            }
        }, { immediate: true })


        return {
            loading,
            model,
            tab,
            consultancy_data,
            submit,
        }
    }
}
</script>