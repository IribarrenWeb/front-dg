<template>
    <div class="row col-12">
        <q-toggle size="lg" label="Residuos" color="primary" class="q-mb-md" v-model="is_residue" />
        <qu-select-validation @filter="filterFn" use-chips :rules="[$rules.required()]" apiName="materials_ids"
            class="col-12" v-model="local_material_ids" map-options :options="formatted_options" outlined emit-value
            use-input fill-input :loading="loading" label="Materiales" multiple />
        <q-separator spaced="10px" size="10px" />
        <div class="col-md-12 q-px-md q-mb-md" v-if="materials_selected.length >= 1">
            <h4>Detalles:</h4>
            <q-item v-for="material in materials_selected" :key="material.id" class="border-bottom">
                <q-item-section top>
                    <q-expansion-item expand-separator popup class="text-primary" icon="fa-solid fa-recycle"
                        :label="`${material?.material?.un_code} - ${material?.name}`"
                        :caption="material?.material?.denomination_name ?? 'PQ'">
                        <div class="bg-grey-1 px-3 py-1">
                            <q-item-label caption lines="2">Grupo de embalaje: {{ material?.material?.packing?.code
                            }}</q-item-label>
                            <q-item-label caption lines="2">Cantidaded limitadas: {{ material?.material?.limited_quantities
                            }}</q-item-label>
                            <q-item-label caption lines="2">Clase: {{ material?.material?.class?.code }}</q-item-label>
                            <q-item-label caption lines="2">Contaminante: {{ material?.is_dangerous ? 'Si' : 'No'
                            }}</q-item-label>
                        </div>
                    </q-expansion-item>
                </q-item-section>
                <!-- <q-item-section top avatar>
                        <q-avatar color="primary" text-color="white" icon="fa-solid fa-recycle" />
                    </q-item-section>
                    <q-item-section top>
                        <q-item-label class="truncate-250">
                            {{ material?.material?.un_code }} - {{ material?.name }}
                            <q-tooltip>
                                {{ material?.material?.denomination_name }}
                            </q-tooltip>
                        </q-item-label>
                        <div v-if="!material?.is_chemical">

                        </div>
                    </q-item-section> -->
                <q-item-section>
                    <div class="row">
                        <qu-input-validation class="col-4" :rules="[$rules.required()]" v-model="material.number" dense
                            label="Numero de bultos" type="text" mask="##" />
                        <qu-input-validation class="col-4" :rules="[$rules.required()]" v-model="material.quantity" dense
                            label="Cantidad por bulto" type="text" />
                        <material-packing-selector dense class="col-4" :rules="[$rules.required()]" option-value="label"
                            label="Empaque" v-model="material.packing_name" />
                        <qu-input-validation class="col-6 mt--2" label="Numero de bultos" v-model="material.nep_comment"
                            dense type="text" />
                        <q-checkbox class="col-6 mt--3" dense v-model="material.limited_quantity_reference" label="Cantidades limitadas" />
                    </div>
                </q-item-section>
            </q-item>
        </div>
</div>
</template>

<script>





import { ref } from '@vue/reactivity';
import modelService from '../../../../store/services/model-service';
import { computed, watch } from '@vue/runtime-core';
import QuSelectValidation from '../../../core_components/FormQuasar/QuSelectValidation.vue';
import QuInputValidation from '../../../core_components/FormQuasar/QuInputValidation.vue';
import MaterialPackingSelector from '../../../Materials/Modules/MaterialPackingSelector.vue';

export default {
    components: { QuSelectValidation, QuInputValidation, MaterialPackingSelector },
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
        const residues = computed(() => options.value.filter(m => m.model?.is_residue))
        const not_residues = computed(() => options.value.filter(m => !m.model?.is_residue))
        const formatted_options = computed(() => is_residue.value ? residues.value : not_residues.value)
        const materials_selected = ref([])
        const option_materials = ref([])

        async function getMaterials() {
            try {
                // const includes = JSON.stringify({
                //     ''
                // })
                const res = await modelService.apiNoLoading({ url: `materials?installation_id=${props.installation_id}` });
                console.log(res);
                option_materials.value = res?.data?.data ? res.data.data.map(op => {
                    return {
                        value: op.id,
                        label: `${op?.material?.un_code ?? 'PQ'} - ${op?.name}`,
                        model: op
                    }
                }) : [];
                // option_materials.value = data_options.value
                options.value = option_materials.value
            } catch (err) {
                console.error(err);
            }
        }

        function filterFn(val, update, abort) {
            update(() => {
                const needle = val.toLowerCase()
                if (val) {
                    options.value = option_materials.value.filter(v => v?.label.toLowerCase().indexOf(needle) > -1)
                } else {
                    options.value = option_materials.value
                }
            })
        }

        function resetSelected() {
            local_material_ids.value = []
            materials_selected.value = []
        }

        function setSelected() {
            let materials = []
            local_material_ids.value.forEach(id => {
                let find = options.value.find(m => m?.value == id)
                const model_selected = find && materials_selected.value.length ? materials_selected.value.find(m => m.id == find?.model?.id) : null
                if (find && !model_selected) materials.push({
                    ...find.model,
                    number: 1,
                    quantity: 1,
                    packing_name: 'Saco',
                    nep_comment: 'Comentario',
                    limited_quantity_reference: false,
                })
                else if (model_selected) materials.push(model_selected)
            });

            materials_selected.value = materials
        }

        function formatModel() {
            return materials_selected.value?.length ? materials_selected.value.map(m => ({ installation_material_id: m.id, number_of_packages: m.number, quantity_of_packages: m.quantity, packing_name: m.packing_name, nep_comment: m.nep_comment, limited_quantity_reference: m.limited_quantity_reference })) : []
        }

        getMaterials()

        watch(() => is_residue.value, (v) => {
            resetSelected()
        }, { immediate: true })

        watch(() => local_material_ids.value, (v) => {
            setSelected()
        })
        watch(() => materials_selected.value, (v) => {
            emit('update:materials_ids', formatModel())
        }, { immediate: true, deep: true })

        return {
            options,
            local_material_ids,
            is_residue,
            formatted_options,
            materials_selected,

            filterFn
        }
    }
}
</script>