<template>
    <div class="row col-12">
        <q-toggle size="lg" label="Residuos" color="primary" class="q-mb-md" v-model="is_residue" />
        <qu-select-validation use-chips :rules="[$rules.required()]" apiName="materials_ids"
            class="col-12" v-model="local_material_ids" map-options :options="formatted_options" outlined
            emit-value use-input fill-input :loading="loading" label="Materiales" multiple />
        <q-separator spaced="10px" size="10px"/>
        <div class="col-md-12 q-px-md q-mb-md" v-if="materials_selected.length >= 1">
            <h4>Detalles:</h4>
            <q-item v-for="material in materials_selected" :key="material.id">
                <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="fa-solid fa-recycle" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="truncate-250">
                        {{ material?.material?.un_code }} - {{ material?.name }}
                        <q-tooltip>
                            {{ material?.material?.denomination_name }}
                        </q-tooltip>
                    </q-item-label>
                    <q-item-label caption lines="2">Grupo de embalaje: {{material?.material?.packing?.code}}</q-item-label>
                </q-item-section>
            </q-item>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import modelService from '../../../../store/services/model-service';
import AddressSelectV2 from '../../../core_components/AddressSelectV2.vue';
import { computed, watch } from '@vue/runtime-core';
import QuSelectValidation from '../../../core_components/FormQuasar/QuSelectValidation.vue';
import { find, keys } from 'lodash';

export default {
    components: { QuSelectValidation },
    props: {
        formRef: {},
        materials_ids: {
            type: Array,
            default: () => {
                return []
            }
        },
        installation_id: {
            type: Number
        },
        loading: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {
        const is_residue = ref(false)
        const local_material_ids = ref([])
        const options = ref([])
        const residues = computed(() => options.value.filter(m => m?.is_residue))
        const not_residues = computed(() => options.value.filter(m => !m?.is_residue))
        const formatted_options = computed(() => is_residue.value ? residues.value : not_residues.value)
        const materials_selected = ref([])

        async function getMaterials() {
            try {
                // const includes = JSON.stringify({
                //     ''
                // })
                const res = await modelService.apiNoLoading({ url: `materials?installation_id=${props.installation_id}` });
                console.log(res);
                options.value = res?.data?.data ? res.data.data.map(op => {
                    return {
                        value: op.id,
                        label: `${op.material.un_code} - ${op?.name}`,
                        model: op
                    }
                }) : [];
                options.value = data_options.value
            } catch (err) {

            }
        }

        async function setModel(val) {
            
        }

        function resetSelected() {
            local_material_ids.value = []
            materials_selected.value = []
        }

        function setSelected() {
            let materials = []
            local_material_ids.value.forEach(id => {
                let find = options.value.find(m=>m?.value == id)
                
                if (find) materials.push(find.model)          
            });

            materials_selected.value = materials
        }

        getMaterials()

        watch(() => is_residue.value, (v) => {
            resetSelected()
        }, { immediate: true })

        watch(() => local_material_ids.value, (v) => {
            emit('update:materials_ids',v)
            console.log('aqui',v?.length);
            if(v?.length >= 1) setSelected()

        }, { immediate: true })

        return {
            options,
            local_material_ids,
            is_residue,
            formatted_options,
            materials_selected
        }
    }
}
</script>