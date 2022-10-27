<template>
    <div>
        <base-field label="Instalacion">
            <q-select outlined :loading="loading" dense :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)"
                emit-value map-options :options="options" clearable>
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                            Sin resultados
                        </q-item-section>
                    </q-item>
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                        <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
        </base-field>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import modelService from '../../../store/services/model-service';
import { watch } from '@vue/runtime-core';

export default {
    props: {
        modelValue: {
            type: [String, Number, Object],
            description: "Input value",
            default: '',
        },
        business_id: {
            type: Number || String,
        }
    },
    setup(props) {
        const options = ref([])
        const loading = ref(false)

        async function get() {
            try {
                loading.value = true
                const res = await modelService.apiNoLoading({ url: `installations?business_id=${props.business_id}` })
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