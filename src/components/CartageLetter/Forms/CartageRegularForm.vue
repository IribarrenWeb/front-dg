<template>
    <div class="row">
        <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading" :rules="[$rules.required()]"
            outlined :model-value="name" @update:model-value="$emit('update:name',$event)" type="text" label="Nombre" />

        <qu-input-date-validation apiName="date" class="col-md-6 col-12" :loading="loading" outlined
            :model-value="date" @update:model-value="$emit('update:date',$event)" mask="####-##-##" label="Fecha" :rules="[$rules.required]">
            <q-date today-btn :model-value="date" @update:model-value="$emit('update:date',$event)" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
            </q-date>
        </qu-input-date-validation>

        <installation-selector-v-2 class="col-md-6 col-12" :model-value="installation_id" @update:model-value="$emit('update:val',$event)" />

        <q-file class="col-md-6 col-12" label="Documento (carta de porte)" :rules="[$rules.required]" :loading="loading"
            :model-value="document" @update:model-value="$emit('update:document',$event)" outlined accept=".pdf">
            <template v-slot:prepend>
                <q-icon name="attach_file" />
            </template>
        </q-file>

        <qu-input-validation type="textarea" apiName="description" class="col-12" :loading="loading"
            :rules="[$rules.required()]" outlined :model-value="description" @update:model-value="$emit('update:description',$event)" label="Descripción" />
    </div>
</template>
<script>
import QuInputDateValidation from '../../core_components/FormQuasar/QuInputDateValidation.vue'
import QuInputValidation from '../../core_components/FormQuasar/QuInputValidation.vue'
import InstallationSelectorV2 from '../../Installation/Modules/InstallationSelectorV2.vue'
export default {
	components: { InstallationSelectorV2, QuInputValidation, QuInputDateValidation },
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
        document: {},
        loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        
    }
}
</script>