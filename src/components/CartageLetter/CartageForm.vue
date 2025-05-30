<template>
    <div>
        <q-form ref="form_ref" @submit="onSubmit" class="q-px-md">
            <div>
                <h3>Agregar carta de porte</h3>
            </div>
            <q-separator spaced="15px" />
            <div v-if="['aereas', 'maritimas'].includes(tab)">
                <cartage-regular-form :loading="loading" v-model:date="model.date" v-model:name="model.name"
                    v-model:document="model.document" v-model:description="model.description"
                    v-model:installation_id="model.installation_id" />
            </div>
            <div v-else>
                <cartage-road-form :cloneId="cloneId" :cloneMode="cloneId ? true : false" @save="form_ref.submit()"
                    :loading="loading" v-model:date="model.date" v-model:name="model.name"
                    v-model:description="model.description" v-model:installation_id="model.installation_id"
                    v-model:same_loader="model.same_loader" v-model:cartage_loader_id="model.cartage_loader_id"
                    v-model:cartage_destinatary_id="model.cartage_destinatary_id"
                    v-model:cartage_carrier_id="model.cartage_carrier_id" v-model:materials_ids="model.materials_ids"
                    v-model:destinatary_data="model.destinatary_data" v-model:carrier_data="model.carrier_data"
                    v-model:loader_data="model.loader_data" />
            </div>
            <div class="q-gutter-md flex justify-end q-mt-md">
                <q-btn label="Cancelar" :loading="loading" outline v-if="modalMode" type="reset" color="primary"
                    @click="$emit('close', true)" />
                <q-btn label="Guardar" v-if="tab != 'carretera'" :loading="loading" type="submit" color="primary" />
            </div>
        </q-form>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import functions from '../../utils/functions'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { moment } from '../../boot/plugins'
import CartageRegularForm from './Forms/CartageRegularForm.vue'
import { computed, watch } from '@vue/runtime-core'
import CartageRoadForm from './Forms/CartageRoadForm.vue'

export default {
    components: { CartageRegularForm, CartageRoadForm },
    props: {
        modalMode: {
            type: Boolean,
            default: false
        },
        tab: String,
        cloneId: {
            type: Number,
            default: null
        }
    },
    setup(props, { emit }) {
        const model = ref({})
        const loading = ref(false)
        const form_ref = ref(null)
        const schema_name = computed(() => props.tab == 'carretera' ? 'cartage_road' : 'cartage')
        async function onSubmit() {
            loading.value = true
            try {
                const type = props.tab ? props.tab?.replace('s', '') : null
                let data = {}
                if (type == 'carretera') {
                    data = {
                        ...model.value,
                        type: type
                    }
                } else {
                    data = new FormData()
                    data.append('name', model.value.name)
                    data.append('description', model.value.description)
                    data.append('date', moment(model.value.date).format('YYYY-MM-DD'))
                    data.append('installation_id', model.value.installation_id)
                    data.append('document', model.value.document)
                    data.append('type', type)
                }

                if (props.cloneId) {
                    await modelService.apiNoLoading({ url: `cartage-letter/clone/${props.cloneId}`, method: 'POST', data: data })
                } else {
                    await modelService.apiNoLoading({ url: 'cartage-letter', method: 'POST', data: data })
                }
                if (props.modalMode) {
                    emit('saved', true);
                }
            } catch (error) {
                Notify.create({
                    message: 'No se pudo registrar la carta de porte',
                    color: 'negative'
                })
            }
            loading.value = false
        }

        model.value = functions.schemas(schema_name.value)

        watch(() => schema_name.value, (v) => model.value = functions.schemas(v))

        return {
            model,
            loading,
            form_ref,
            onSubmit
        }
    }
}
</script>