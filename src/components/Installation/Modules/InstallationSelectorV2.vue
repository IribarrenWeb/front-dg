<template>
    <div>
        <qu-select-validation :disable="disabled" :apiName="apiName" :rules="[required ? $rules.required() : null]" :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)" emit-value  map-options :options="options" label="Instalación" outlined />
    </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import modelService from '../../../store/services/model-service';
import { watch } from '@vue/runtime-core';
import QuSelectValidation from '../../core_components/FormQuasar/QuSelectValidation.vue';

export default {
	components: { QuSelectValidation },
    props: {
        modelValue: {
            type: [String, Number, Object],
            description: "Input value",
            default: '',
        },
        business_id: {
            type: Number || String,
            default: null
        },
        apiName: {
            type: String,
            default: 'installation_id'
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const options = ref([])
        const loading = ref(false)

        async function get() {
            try {
                loading.value = true
                let url_base = `installations`

                if (props.business_id) {
                    url_base += `?business_id=${props.business_id}`
                }
                const res = await modelService.apiNoLoading({ url: url_base })
                options.value = res?.data?.data.map(i => {
                    return {
                        label: `${i.name}`,
                        value: i.id,
                        model: i
                    }
                })
                loading.value = false
            } catch (err) {
                loading.value = false
            }
        }

        get()

        watch(() => props.business_id, (v) => {
            if (v) {
                get()
            }
        })

        return {
            options,
            loading,

            get
        }
    }
}
</script>
<style lang="scss">
.truncate {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 250px;
    overflow: hidden;
}
</style>