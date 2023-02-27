<template>
    <q-dialog>
        <q-card style="min-width: 300px;">
            <q-card-section>
                <q-input v-model="name" outlined type="text" label="Nombre carpeta" />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" :loading="loading" v-close-popup />
                <q-btn flat label="Guardar" color="primary" :loading="loading" @click="save" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import {  Notify } from 'quasar'
import { watch } from 'vue'

export default {
    inheritAttrs: true,
    props: {
        folderData: {
            type: Number,
            default: null
        }
    },
    setup(props, { emit }) {
        const loading = ref(false)
        const name = ref(null)

        async function save() {
            loading.value = true
            try {
                if (props.folderData?.id) {
                    await modelService.apiNoLoading({ url: 'document-folder/'+props.folderData.id, method: 'PUT', data: {name:name.value} })
                }else{
                    await modelService.apiNoLoading({ url: 'document-folder', method: 'POST', data: {name:name.value} })
                }
                emit('update:model-value',false)
                emit('created',true)
                Notify.create({
                    message: 'Carpeta guardada',
                    color: 'positive'
                })
            } catch (err) {
                loading.value = false
                Notify.create({
                    message: 'No se pudo guardar la carpeta',
                    color: 'negative'
                })
                reset()
            }
            loading.value = false
        }

        watch(() => props.folderData, (v) => {
            if(v) name.value = v.name
            else name.value = null
        }, {immediate: true})

        return {
            loading,
            name,

            save,
        }
    }
}
</script>

<style lang="scss">
.record-table {
    box-shadow: none !important;

    .q-table {
        box-shadow: none !important;

    }
}
</style>