<template>
    <q-dialog>
        <q-card style="min-width: 1000px;">
            <q-form @submit="onSubmit">
                <q-card-section>
                    <div class="q-px-md">
                        <span class="h3">Carta de porte
                            <!-- <span class="text-uppercase q-mr-sm">{{ cartage?.name }}</span> -->
                            <q-chip :label="cartage?.status ?? 'Revision'" />
                        </span>
                    </div>
                </q-card-section>
                <q-separator spaced />
                <q-card-section>
                    <span class="h4 q-px-md">Datos de carta de porte</span>
                    <q-space />
                    <div class="row q-mt-sm">
                        <qu-input-validation :loading="loading" :model-value="cartage?.name" label="Nombre" readonly
                            class="col-md-4 col-6" />
                        <qu-input-validation :loading="loading" :model-value="cartage?.description" label="Descripción"
                            readonly class="col-md-4 col-6" />
                        <qu-input-validation :loading="loading"
                            :model-value="$moment(cartage?.date).format('DD/MM/YYYY')" label="Fecha" readonly
                            class="col-md-4 col-6" />
                        <qu-input-validation :loading="loading" :model-value="cartage?.installation?.name"
                            label="Instalación" readonly class="col-md-4 col-6" />
                        <qu-input-validation v-if="role != 'business'" :loading="loading"
                            :model-value="cartage?.business?.user?.full_name" label="Empresa" readonly
                            class="col-md-4 col-6" />

                        <div class="col-md-4 col-6" v-if="cartage?.document">
                            <q-item clickable v-if="!toChange" style="max-width: 500px; margin-left: auto;">
                                <q-item-section top avatar>
                                    <q-icon size="2rem" color="primary" name="fa-regular fa-file-pdf" />
                                </q-item-section>
                                <q-item-section @click="$open(cartage?.document?.public_url)">
                                    <q-item-label>{{ cartage?.document.name_document }}</q-item-label>
                                    <q-item-label caption lines="2" v-if="cartage?.document?.size">{{
                                            cartage?.document.size /
                                            1000
                                    }}
                                        KB</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn :loading="loading" v-if="cartage.status == 'RECHAZADA' && role === 'business'" color="primary"
                                        icon="fa-regular fa-pen-to-square" flat @click="toChange = true" />
                                </q-item-section>
                            </q-item>
                            <q-file v-else label="Documento (carta de porte)" :rules="[$rules.required]"
                                :loading="loading" v-model="model.document" outlined accept=".pdf">
                                <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                </template>
                                <template v-slot:after>
                                    <q-btn round dense v-if="model.document" @click="changeDoc" flat icon="upload" />
                                    <q-btn round dense @click="model.document = false, toChange = false" flat
                                        icon="fa-solid fa-xmark" />
                                </template>
                            </q-file>
                        </div>
                    </div>
                </q-card-section>
                <q-separator spaced />
                <q-card-section>
                    <div class="q-px-md">
                        <span class="h4">Observaciones</span>
                        <div v-if="role != 'business' && cartage?.status == 'EN REVISION'">
                            <q-editor class="q-mt-sm" v-model="model.observation" min-height="5rem" />
                        </div>
                        <div v-else>
                            <div class="q-pa-sm border"
                                v-if="cartage?.status == 'APROBADA' || cartage?.status == 'RECHAZADA' || (cartage?.status == 'RECHAZADA' && role != 'business')"
                                style="max-height: 450px; overflow-y: scroll;">
                                <p v-html="cartage?.review?.observation"></p>
                            </div>
                            <div v-else class="q-mt-md">
                                <small class="text-grey-8">
                                    Aun en revisión...
                                </small>
                            </div>
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <div class="q-px-md q-gutter-md">
                        <q-btn :loading="loading" padding="10px 20px" flat label="Cancelar" type="reset" color="primary"
                            v-close-popup />
                        <q-btn :loading="loading" v-if="role !== 'business' && cartage?.status == 'EN REVISION'"
                            padding="10px 20px" outline @click="action(0)" label="Rechazar" color="primary" />
                        <q-btn :loading="loading" v-if="role !== 'business' && cartage?.status == 'EN REVISION'"
                            padding="10px 20px" label="Aceptar" @click="action(1)" color="primary" />
                        <q-btn :loading="loading" v-if="role == 'business' && cartage?.status == 'RECHAZADA'"
                            padding="10px 20px" label="Reeviar" @click="action(1)" color="primary" />
                    </div>
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import QuInputValidation from '../core_components/FormQuasar/QuInputValidation.vue'
import { Notify } from 'quasar'
import { computed, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    components: { QuInputValidation },
    inheritAttrs: true,
    props: {
        cartage_review_id: {
            type: Number || String,
            default: null
        }
    },
    setup(props, { emit }) {
        const model = ref({
            observation: '',
            document: ''
        })
        const loading = ref(false)
        const cartage = ref({})
        const store = useStore();
        const role = computed(() => {
            return store.getters.ROLE;
        });

        const toChange = ref(false);

        async function getCartage() {
            if (!props.cartage_review_id) return
            loading.value = true
            try {
                const includes = JSON.stringify([
                    'installation',
                    'document',
                    'business.user',
                    'review'
                ])
                const res = await modelService.apiNoLoading({ url: `cartage-letter/${props.cartage_review_id}?includes=${includes}` })
                cartage.value = res.data.data
            } catch (err) {
                console.log(err.response);
                const message = err?.response?.data?.message ?? err?.response?.message
                Notify.create({
                    message: message ?? 'No se pudo obtener la carta de porte',
                    color: 'negative'
                })
                emit('update:model-value', false)
            }
            loading.value = false
        }

        async function action(accept = false) {
            if (!cartage.value?.review?.id) {
                Notify.create({
                    message: 'No se puede actualizar la carta de porte: Falta review_id.',
                    color: 'negative'
                })
                return
            }
            loading.value = true
            try {
                await modelService.apiNoLoading({ url: `cartage-review/${cartage.value.review.id}`, method: 'put', data: { status: accept ? 1 : 0, observation: model.value?.observation } })
                Notify.create({
                    message: 'Carta de porte actualizada.',
                    color: 'positive'
                })
                emit('reload', true)
                emit('update:model-value', false)
            } catch (err) {
                const message = err?.response?.data?.message ?? err?.response?.message
                Notify.create({
                    message: message ?? 'Ocurrio un error al actualizar la carta de porte',
                    color: 'negative'
                })
            }
            loading.value = false
        }

        async function changeDoc() {
            loading.value = true
            try {
                const data = new FormData();
                data.append('document',model.value.document)
                
                const res = await modelService.apiNoLoading({ url: `cartage-letter/${props.cartage_review_id}`, method: 'put', data, multipart: true })
                cartage.value = res.data.data
                model.value.document = null
                toChange.value = false
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

        watch(() => props.cartage_review_id, (v) => {
            if (v) getCartage();
        }, { immediate: true })

        return {
            model,
            loading,
            cartage,
            role,
            toChange,

            action,
            changeDoc
        }
    }
}
</script>