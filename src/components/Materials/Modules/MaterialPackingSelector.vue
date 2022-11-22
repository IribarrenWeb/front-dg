<template>
    <qu-select-validation :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)" emit-value map-options :options="options" outline/>
</template>
<script>
import { ref } from '@vue/reactivity';
import modelService from '../../../store/services/model-service';
import QuSelectValidation from '../../core_components/FormQuasar/QuSelectValidation.vue';

export default {
    inheritAttrs: true,
	components: { QuSelectValidation },
    props: {
        modelValue: {
            type: [String, Number, Object],
            description: "Input value",
            default: '',
        },

    },
    setup(props) {
        const options = ref([])
        const loading = ref(false)

        async function getPakings() {
            try {
                loading.value = true
                let data = []
                const res = await modelService.apiNoLoading({ url: 'material-packing' })
                data = res?.data?.data.map(m => {
                    return {
                        label: `${m.name}`,
                        value: m.id,
                        packing: m
                    }
                })
                loading.value = false

                options.value = data
            } catch (err) {
                loading.value = false
            }
        }

        getPakings();

        return {
            options,
            loading,

            getPakings
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