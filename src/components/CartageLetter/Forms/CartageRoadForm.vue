<template>
    <q-stepper style="box-shadow: none;" header-nav v-model="step" vertical color="primary" keep-alive animated>
        <q-step :name="1" title="Datos generales" icon="settings" :done="step > 1">
            <q-form class="row q-py-md" @submit="step += 1">

                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn color="primary" type="submit" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="2" title="Datos expedidor" caption="Optional" icon="create_new_folder" :done="step > 2">
            <q-form class="row q-py-md" @submit="step += 1">

                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn @click="step += 1" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="3" title="Datos cargador" caption="Optional" icon="create_new_folder" :done="step > 3">
            <q-form class="row q-py-md" @submit="step += 1">
                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn @click="step += 1" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="4" title="Datos destinatario" caption="Optional" icon="create_new_folder" :done="step > 4">
            <q-form class="row q-py-md" @submit="step += 1">

                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />

                <q-stepper-navigation class="col-12 flex q-gutter-md">
                    <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                    <q-btn @click="step += 1" color="primary" label="Siguiente" />
                </q-stepper-navigation>
            </q-form>
        </q-step>

        <q-step :name="5" title="Datos transportista" icon="add_comment">
            <div class="row">
                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading"
                    :rules="[$rules.required()]" outlined :model-value="name"
                    @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />
            </div>

            <q-stepper-navigation>
                <q-btn flat @click="step -= 1" color="primary" label="Atras" class="q-ml-sm" />
                <q-btn color="primary" label="Guardar" @click="$emit('save', true)" />
            </q-stepper-navigation>
        </q-step>
    </q-stepper>
</template>
<script>
import { ref } from '@vue/reactivity'
import QuInputValidation from '../../core_components/FormQuasar/QuInputValidation.vue'
export default {
    components: { QuInputValidation },
    props: {
        description: {
            type: String,
            default: null
        },
        installation_id: {
            type: String || Number,
            default: null
        },
        date: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        return {
            step: ref(1)
        }
    }
}
</script>