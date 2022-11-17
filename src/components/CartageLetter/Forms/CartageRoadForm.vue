<template>
    <q-stepper style="box-shadow: none;" header-nav v-model="step" vertical color="primary" keep-alive animated>
        <q-step :name="1" title="Datos generales" icon="settings" :done="step > 1">
            <q-form class="row q-py-md" @submit="step += 1">

                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />

                <installation-selector-v-2 :required="true" class="col-md-6 col-12" :model-value="installation_id"
                    @update:model-value="$emit('update:installation_id', $event)" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn color="primary" type="submit" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="2" title="Datos expedidor" caption="Optional" icon="create_new_folder" :done="step > 2">
            <q-form class="row q-py-md" @submit="step += 1">


                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" @click="step += 1" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="3" title="Datos cargador" caption="Optional" icon="create_new_folder" :done="step > 3">
            <q-form class="row q-py-md" @submit="step += 1">
               

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" @click="step += 1" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="4" title="Datos destinatario" caption="Optional" icon="create_new_folder" :done="step > 4">
            <q-form class="row q-py-md" @submit="step += 1">

                

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" @click="step += 1" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="5" title="Datos transportista" icon="add_comment">
            <q-form class="row q-py-md" @submit="$emit('save', true)">
            

                <q-stepper-navigation>
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn type="submit" color="primary" label="Guardar"/>
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
export default {
    components: { QuInputValidation, InstallationSelectorV2 },
    props: {
        description: {
            type: String,
            default: null
        },
        installation_id: {
            type: String || Number,
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
        materials_ids: [],
    },
    setup(props, {emit}) {
        const destinatary_model = ref({})
        const carrier_model = ref({})
        const loader_model = ref({})

        destinatary_model.value = functions.schemas('cartage_destinatary')
        carrier_model.value = functions.schemas('cartage_carrier')
        loader_model.value = functions.schemas('cartage_loader')

        watch(() => destinatary_model.value, (v) => {
            emit('update:destinatary_data',v)
        },{deep:true, immediate: true})

        watch(() => carrier_model.value, (v) => {
            emit('update:carrier_data',v)
        },{deep:true, immediate: true})

        watch(() => loader_model.value, (v) => {
            emit('update:loader_data',v)
        },{deep:true, immediate: true})

        return {
            destinatary_model,
            carrier_model,
            loader_model,
            step: ref(1)
        }
    }
}
</script>