<template>
    <q-file outlined :error="!isValid" bottom-slots @focus="clearError">
        <template v-slot:error>
            <server-error-handler :name="apiName" />
        </template>
        <template v-slot:prepend>
            <slot name="prepend">
                <q-icon name="attach_file" />
            </slot>
        </template>
    </q-file>
</template>

<script>
import { computed } from '@vue/runtime-core'
import ServerErrorHandler from '../ServerErrorHandler.vue'
import { useStore } from 'vuex'
export default {
    components: { ServerErrorHandler },
    inheritAttrs: true,
    props: {
        // modelValue: {},
        apiName: String,
    },
    setup(props) {
        const store = useStore();
        const apiErrors = computed(() => store.state.apiErrors)
        const isValid = computed(() => apiErrors.value && props.apiName in apiErrors.value ? false : true)

        function clearError() {
            if (!isValid.value) {
                store.commit('clearError', props.apiName)
            }
        }
        return {
            isValid,
            apiErrors,
            clearError
        }

    }
}
</script>