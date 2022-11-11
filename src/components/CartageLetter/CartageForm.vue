<template>
    <div>
        <q-form @submit="onSubmit" class="q-px-md">
            <div>
                <h3>Agregar carta de porte</h3>
            </div>
            <q-separator spaced="15px" />
            <div class="row">
                <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading" :rules="[$rules.required()]" outlined
                    v-model="model.name" type="text" label="Nombre" />

                <qu-input-validation apiName="description" class="col-md-6 col-12" :loading="loading" :rules="[$rules.required()]"
                    outlined v-model="model.description" type="text" label="Descripción" />

                <qu-input-date-validation apiName="date" class="col-md-6 col-12" :loading="loading" outlined v-model="model.date"
                    mask="####-##-##" label="Fecha" :rules="[$rules.required]">
                    <q-date today-btn v-model="model.date" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                    </q-date>
                </qu-input-date-validation>
                <!-- <q-input class="col-md-6 col-12" :loading="loading" outlined v-model="model.date" mask="##/##/####"
                    label="Fecha" :rules="[$rules.required]">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                                <q-date v-model="model.date" mask="DD/MM/YYYY">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                    <template v-slot:error>
                        <server-error-handler name="date" />
                    </template>
                </q-input> -->

                <installation-selector-v-2 class="col-md-6 col-12" v-model="model.installation_id" />

                <q-file class="col-md-6 col-12" label="Documento (carta de porte)" :rules="[$rules.required]"
                    :loading="loading" v-model="model.document" outlined accept=".pdf">
                    <template v-slot:prepend>
                        <q-icon name="attach_file" />
                    </template>
                </q-file>
                <!-- <q-input class="col-md-6 col-12" outlined v-model="model.installation_id" type="text"
                    label="Instalación" /> -->
            </div>
            <div class="q-gutter-md flex justify-end">
                <q-btn label="Cancelar" :loading="loading" outline v-if="modalMode" type="reset" color="primary"
                    @click="$emit('close', true)" />
                <q-btn label="Guardar" :loading="loading" type="submit" color="primary" />
            </div>
        </q-form>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import functions from '../../utils/functions'
import InstallationSelectorV2 from '../Installation/Modules/InstallationSelectorV2.vue'
import ServerErrorHandler from '../core_components/ServerErrorHandler.vue'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import QuInputValidation from '../core_components/FormQuasar/QuInputValidation.vue'
import QuInputDateValidation from '../core_components/FormQuasar/QuInputDateValidation.vue'
import { moment } from '../../boot/plugins'

export default {
    components: { InstallationSelectorV2, ServerErrorHandler, QuInputValidation, QuInputDateValidation },
    props: {
        modalMode: {
            type: Boolean,
            default: false
        },
        tab: String
    },
    setup(props, { emit }) {
        const model = ref({})
        const loading = ref(false)

        async function onSubmit() {
            loading.value = true
            try {
                const data = new FormData()
                const type = props.tab ? props.tab?.replace('s','') : null
                data.append('name', model.value.name)
                data.append('description', model.value.description)
                data.append('date', moment(model.value.date).format('YYYY-MM-DD'))
                data.append('installation_id', model.value.installation_id)
                data.append('document', model.value.document)
                data.append('type', type)

                const res = await modelService.apiNoLoading({ url: 'cartage-letter', method: 'POST', data: data })
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

        model.value = functions.schemas('cartage')

        return {
            model,
            loading,
            onSubmit
        }
    }
}
</script>