<template>
    <q-dialog :model-value="show" @update:model-value="$emit('update:show',$event)">
        <q-card>
            <q-form @submit="uploadDocument" class="q-gutter-md">
                <q-card-section class="row items-center">
                    <span class="q-ml-sm h3">Cargar documento</span>
                    <qu-file-validation :loading="loading" apiName="document" class="col-12" label="Documento (carta de porte)"
                        :rules="[$rules.required]"  v-model="document_road" outlined accept=".pdf" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" type="reset" color="primary" :loading="loading" v-close-popup />
                    <q-btn flat label="Cargar" type="submit" color="primary" :loading="loading" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>
<script>
import { Notify } from 'quasar'
import QuFileValidation from '../../core_components/FormQuasar/QuFileValidation.vue'
import modelService from '../../../store/services/model-service'
import { ref } from '@vue/reactivity'
export default {
    inheritAttrs: true,
    components: { QuFileValidation },
    props: {
        show: {},
        cartage_id: {
            type: Number
        },
    },
    setup(props, {emit}) {
        const loading = ref(false)
        const document_road = ref({})

        async function uploadDocument() {
            loading.value = true
            try {
                const data = new FormData();
                data.append('document', document_road.value)

                await modelService.apiNoLoading({ url: `cartage-letter/${props.cartage_id}`, method: 'put', data, multipart: true })
                emit('reload',true)
                emit('update:show',false)
            } catch (err) {
                console.log(err.response);
                const message = err?.response?.data?.message ?? err?.response?.message
                Notify.create({
                    message: message ?? 'No se pudo obtener la carta de porte',
                    color: 'negative'
                })
                // emit('update:model-value', false)
            }
            loading.value = false
        }

        return {
            loading,
            document_road,
            uploadDocument,
        }
    }
}
</script>