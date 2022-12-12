<template>
    <q-dialog>
        <q-card style="min-width: 500px;">
            <q-card-section>
                Agregar a carpeta
            </q-card-section>
            <q-separator spaced/>
            <q-card-section>
                <q-select emit-value map-options outlined v-model="folder_id" :options="folders" label="Carpetas" />                
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" :loading="loading" v-close-popup />
                <q-btn flat label="Guardar" color="primary" :loading="loading" @click="saveChanges" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import { Dialog, Notify } from 'quasar'

export default {
    inheritAttrs: true,
    props: {
        document_id: {
            type: Number || String
        }
    },
    setup(props, { emit }) {
        const loading = ref(false)
        const folders = ref([])
        const addFolder = ref(false)
        const folder_id = ref(null)

        async function getFolders() {
            loading.value = true
            try {
                const res = await modelService.apiNoLoading({ url: `document-folder` })
                folders.value = res.data?.data?.length ? res.data.data.map(f => {
                    return {
                        label:f.name,
                        value:f.id,
                        model:f
                    }
                }) : []

            } catch (err) {
                loading.value = false
                Notify.create({
                    message: 'No se pudo obtener los registros',
                    color: 'negative'
                })
            }
            loading.value = false
        }

        async function saveChanges() {
            loading.value = true
            try {
                await modelService.apiNoLoading({ url: 'admin-docs/add-folder/'+props.document_id, method: 'POST', data: {document_folder_id:folder_id.value} })
                getFolders()
                emit('update:model-value',false)
                emit('update',true)
            } catch (err) {
                loading.value = false
                Notify.create({
                    message: 'No se pudo guardar los cambios',
                    color: 'negative'
                })
                reset()
            }
            loading.value = false
        }

        async function destroy(id) {

            Dialog.create({
                title: 'Esta seguro de eliminar el registro',
                ok: {
                    label: 'Eliminar',
                },
                cancel: {
                    label: 'Cancelar'
                }
            })
                .onOk(async () => {
                    loading.value = true
                    try {
                        let url = `${endpoint.value}/${id}`
                        await modelService.apiNoLoading({ url: url, method: 'DELETE' })
                        // reset()
                        getRecords()
                    } catch (err) {
                        loading.value = false
                        console.log(err?.response, err);
                        const message = err?.response?.data?.message ?? 'No se pudo eliminar el registro'
                        Notify.create({
                            message: message,
                            color: 'negative'
                        })
                    }
                    loading.value = false
                })

        }

        getFolders()

        return {
            loading,
            folders,
            folder_id,
            addFolder,

            saveChanges,
            destroy
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