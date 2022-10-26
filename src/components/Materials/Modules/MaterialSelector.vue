<template>
    <div>
        <div v-if="valueSelect">
            <q-item>
                <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="fa-solid fa-recycle" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="truncate-250">
                        {{ valueSelect?.un_code }} - {{ valueSelect?.denomination_name }}
                        <q-tooltip>
                            {{ valueSelect?.denomination_name }}
                        </q-tooltip>
                    </q-item-label>
                    <q-item-label caption lines="2">Grupo de embalaje: {{valueSelect?.packing?.code}}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-btn color="primary" flat icon="fa-regular fa-pen-to-square" @click="$emit('edit', true)">
                        <q-tooltip>
                            Cambiar
                        </q-tooltip>
                    </q-btn>
                </q-item-section>
            </q-item>
        </div>
        <q-select v-else outlined :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)"
            emit-value stack-label input-debounce="800" label="Mercancia ADR" :options="options" @filter="get" use-input
            clearable>
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        Sin resultados
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:selected>
                <q-chip v-if="modelValue" square color="primary" text-color="grey-3"
                    class="q-my-none q-ml-xs q-mr-none">
                    {{ modelValue?.un_code }} -
                    {{ modelValue.denomination_name }}
                </q-chip>
            </template>
            <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                    <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.packing }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import modelService from '../../../store/services/model-service';

export default {
    props: {
        modelValue: {
            type: [String, Number, Object],
            description: "Input value",
            default: '',
        },
        valueSelect: {
            type: Object,
            default: null
        }
    },
    setup(props) {
        const options = ref([])
        const loading = ref(false)

        async function get(val, update, abort) {
            try {
                loading.value = true
                let data = []
                if (val !== '' && val) {
                    const needle = val.toLowerCase()
                    const res = await modelService.apiNoLoading({ url: 'adr-materials?includes[]=packing&query=' + needle })
                    data = res?.data?.data.map(m => {
                        return {
                            label: `${m.un_code} - ${m.denomination_name}`,
                            value: m,
                            packing: m?.packing?.code
                        }
                    })
                }
                loading.value = false

                update(() => {
                    options.value = data
                })
            } catch (err) {
                loading.value = false
                abort()
            }
        }

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