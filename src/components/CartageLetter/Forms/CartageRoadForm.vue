<template>
    <q-stepper style="box-shadow: none;" v-model="step" vertical color="primary" keep-alive animated>
        <q-step :name="1" title="Datos generales" icon="settings" :done="step > 1">
            <q-form class="row q-py-md" @submit="step += 1">

                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre Carta de Porte" />


                <installation-selector-v-2 :required="true" class="col-md-6 col-12" :model-value="installation_id"
                    @update:model-value="$emit('update:installation_id', $event)" />

                <qu-input-validation type="textarea" apiName="description" class="col-12" :loading="loading"
                    outlined :model-value="description"
                    @update:model-value="$emit('update:description', $event)" label="Descripción general" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn color="primary" type="submit" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="2" title="Datos cargador" caption="Optional" icon="create_new_folder" :done="step > 2">
            <q-form ref="loader_form" class="row q-py-md" @submit="step += 1">

                <cartage-loader-form :form-ref="loader_form" v-model:address="loader_model.address"
                    v-model:business_name="loader_model.business_name"
                    v-model:nif="loader_model.nif" v-model:phone_number="loader_model.phone_number" :loading="loading"
                    @update:loading="$emit('update:loading', $event)" :cartage_loader_id="cartage_loader_id"
                    @update:cartage_loader_id="$emit('update:cartage_loader_id', $event)" :same_loader="same_loader"
                    @update:same_loader="$emit('update:same_loader', $event)" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="3" title="Datos destinatario" icon="create_new_folder" :done="step > 3">
            <q-form ref="destinatary_form" class="row q-py-md" @submit="step += 1">

                <cartage-destinatary-form :form-ref="destinatary_form" v-model:address="destinatary_model.address"
                    v-model:loading="loading"
                    v-model:business_name="destinatary_model.business_name" v-model:nif="destinatary_model.nif"
                    v-model:phone_number="destinatary_model.phone_number"
                    :cartage_destinatary_id="cartage_destinatary_id"
                    @update:cartage_destinatary_id="$emit('update:cartage_destinatary_id', $event)" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="4" title="Datos transportista" icon="add_comment" :done="step > 4">
            <q-form ref="carrier_form" class="row q-py-md" @submit="step += 1">

                <cartage-carrier-form :form-ref="carrier_form" v-model:address="carrier_model.address"
                    v-model:loading="loading"
                    v-model:business_name="carrier_model.business_name" v-model:nif="carrier_model.nif"
                    v-model:phone_number="carrier_model.phone_number" :cartage_carrier_id="cartage_carrier_id"
                    @update:cartage_carrier_id="$emit('update:cartage_carrier_id', $event)" />

                <q-stepper-navigation>
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="5" title="Mercancías peligrosas" icon="add_comment">
            <q-form ref="carrier_form" class="row q-py-md" @submit="$emit('save', true)">

                <cartage-materials :cloneId="cloneId" :installation_id="installation_id" :materials_ids="materials_ids"
                    @update:materials_ids="$emit('update:materials_ids', $event)" />

                <q-stepper-navigation>
                    <q-btn flat @click="step -= 1" color="primary" v-if="!cloneMode" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" color="primary" :label="cloneMode ? 'Clonar' : 'Guardar'" :disable="materials_ids.length <= 0" />
                </q-stepper-navigation>
            </q-form>
        </q-step>
    </q-stepper>
</template>
<script>
import { ref } from '@vue/reactivity'
import QuInputValidation from '../../core_components/FormQuasar/QuInputValidation.vue'
import { watch } from '@vue/runtime-core'
import InstallationSelectorV2 from '../../Installation/Modules/InstallationSelectorV2.vue'
import functions from '../../../utils/functions'
import CartageLoaderForm from './RoadFormModules/CartageLoaderForm.vue'
import CartageCarrierForm from './RoadFormModules/CartageCarrierForm.vue'
import CartageDestinataryForm from './RoadFormModules/CartageDestinataryForm.vue'
import CartageMaterials from './RoadFormModules/CartageMaterials.vue'
export default {
    components: { QuInputValidation, InstallationSelectorV2, CartageLoaderForm, CartageCarrierForm, CartageDestinataryForm, CartageMaterials },
    props: {
        description: {
            type: String,
            default: null
        },
        installation_id: {
            type: [String, Number],
            default: null
        },
        name: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        },
        same_loader: {
            type: Boolean,
            default: false
        },
        cartage_loader_id: {
            type: Number || String,
        },
        cartage_destinatary_id: {
            type: Number || String,
        },
        cartage_carrier_id: {
            type: Number || String,
        },
        destinatary_data: {},
        carrier_data: {},
        loader_data: {},
        materials_ids: {
            type: Array
        },
        cloneMode: {
            type: Boolean,
            default: false
        },
        cloneId: {
            type: Number,
            default: null
        }
    },
    setup(props, { emit }) {
        const destinatary_model = ref({})
        const carrier_model = ref({})
        const loader_model = ref({})
        const step = ref(1)

        destinatary_model.value = functions.schemas('cartage_destinatary')
        carrier_model.value = functions.schemas('cartage_carrier')
        loader_model.value = functions.schemas('cartage_loader')

        watch(() => destinatary_model.value, (v) => {
            emit('update:destinatary_data', v)
        }, { deep: true, immediate: true })

        watch(() => carrier_model.value, (v) => {
            emit('update:carrier_data', v)
        }, { deep: true, immediate: true })

        watch(() => loader_model.value, (v) => {
            emit('update:loader_data', v)
        }, { deep: true, immediate: true })
        
        if (props.cloneMode) {
            step.value = 5
        }

        return {
            destinatary_model,
            carrier_model,
            loader_model,
            step,
            loader_form: ref(null),
            carrier_form: ref(null),
            destinatary_form: ref(null),
        }
    }
}
</script>