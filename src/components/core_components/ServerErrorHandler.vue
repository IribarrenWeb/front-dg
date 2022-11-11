<template>
    <div class="text-danger invalid-feedback mt--1" style="display: block" v-if="errors">
        <span v-if="!multiple">
            {{ errors[0] }}
        </span>
        <ul v-else>
            <li v-for="error in errors" :key="error.id">
                {{ error }}
            </li>
        </ul>
    </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    props: {
        name: String,
        multiple: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const store = useStore()
        const apiErrors = computed(() => store.state.apiErrors)
        const errors = computed(() => apiErrors.value && props.name in apiErrors.value ? apiErrors.value[props.name] : [])
        return {
            apiErrors,
            errors
        }
    }
}
</script>