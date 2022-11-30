<template>
    <div class="row">
        <div v-if="selectMode" class="col-12 q-mb-md">
            <q-toggle size="lg" label="Usar datos de expedidor" :model-value="same_loader"
                @update:model-value="$emit('update:same_loader', $event)" color="primary" />
        </div>

        <qu-select-validation v-if="selectMode" :rules="[!isDisabled ? $rules.required() : true]" :readonly="same_loader" :filled="isDisabled" apiName="business_name"
            class="col-md-6 col-12" :model-value="business_name" map-options :options="options" @filter="filterFn" outlined
            emit-value use-input fill-input :loading="loading" @input-value="setModel" label="Razón Social" hide-selected />

        <qu-input-validation v-else :readonly="isDisabled" :filled="isDisabled" apiName="business_name" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="business_name"
            @update:model-value="$emit('update:business_name', $event)" type="text" label="Razón Social" />

        <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="nif" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="nif"
            @update:model-value="$emit('update:nif', $event)" type="text" label="NIF" />
        <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="phone_number" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="phone_number"
            @update:model-value="$emit('update:phone_number', $event)" type="text" label="Numero de telefono" />

        <address-select-v-2 :readonly="isDisabled" v-model:filled="isDisabled"
            v-model:address="address_model.address" v-model:city="address_model.city" v-model:code="address_model.code"
            v-model:comunity="address_model.comunity" v-model:country="address_model.country"
            v-model:street_number="address_model.street_number" v-model:province="address_model.province" />
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import modelService from '../../../../store/services/model-service';
import functions from '../../../../utils/functions';
import QuInputValidation from '../../../core_components/FormQuasar/QuInputValidation.vue';
import AddressSelectV2 from '../../../core_components/AddressSelectV2.vue';
import { computed, onActivated, watch } from '@vue/runtime-core';
import QuSelectValidation from '../../../core_components/FormQuasar/QuSelectValidation.vue';
import { keys } from 'lodash';

export default {
    components: { AddressSelectV2, QuInputValidation, QuSelectValidation },
    props: {
        formRef: {},
        selectMode: {
            type: Boolean,
            default: true,
        },
        business_name: {
            type: String,
            default: null
        },
        same_loader: {
            type: Boolean,
            default: false
        },
        address: {
            type: Object || Array,
            default: null
        },
        nif: {
            type: String,
            default: ''
        },
        phone_number: {
            type: String,
            default: ''
        },
        cartage_loader_id: {
            type: Number || String,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {
        const loader_selected = ref(null)
        const address_model = ref({})
        const data_options = ref([])
        const options = ref([])
        // const name_value = ref([])
        const isDisabled = computed(() => props.same_loader || loader_selected.value ? true : false)

        async function getLoaders() {
            try {
                const res = await modelService.apiNoLoading({ url: `cartage-loader` });
                console.log(res);
                data_options.value = res?.data?.data ? res.data.data.map(op => {
                    return {
                        value: op,
                        label: op.business_name ?? '',
                        id: op.id
                    }
                }) : [];
                options.value = data_options.value
            } catch (err) {

            }
        }

        async function setModel(val) {
            const needle = val ? val?.toLowerCase() : '';
            console.log(needle);
            const index = data_options.value.findIndex(op => op.label.toLowerCase() == needle)
            if (index >= 0) loader_selected.value = data_options.value[index]
            else {
                emit('update:business_name', val)
                // name_value.value = val
                loader_selected.value = null
            }
        }

        function resetSelected() {
            const k = ['nif','phone_number','address']
            console.log(k, loader_selected.value);
            k.forEach(k => {
                emit('update:' + k, null)
            });
        }
        async function filterFn(val, update, abort) {
            update(() => {
                const needle = val.toLocaleLowerCase()
                options.value = data_options.value?.length ? data_options.value.filter(v => v.label.toLowerCase().includes(needle)) : []
            })
        }

        function setSelected() {
            const k = keys(loader_selected.value?.value)
            console.log(k, loader_selected.value);
            k.forEach(k => {
                if (k == 'address' && loader_selected.value?.value.address) {
                    setAddress(loader_selected.value?.value?.address)
                    // const k_ad = keys(loader_selected.value?.value.address)
                    // k_ad.forEach(ad_k => {
                    //     address_model.value[ad_k] = loader_selected.value.value.address[ad_k]
                    // });
                }
                emit('update:' + k, loader_selected.value?.value[k])
            });
        }

        getLoaders()

        address_model.value = functions.schemas('address')

        function setAddress(model) {
            const k_ad = keys(address_model.value)
            k_ad.forEach(ad_k => {
                if (ad_k in model) {
                    address_model.value[ad_k] = model[ad_k]
                }
            });
        }

        watch(() => address_model.value, (v) => {
            emit('update:address', v)
        }, { deep: true, immediate: true })

        watch(() => props.same_loader, (v) => {

            if(v) {
                resetSelected()
                emit('update:cartage_loader_id', null)
            }

        }, { deep: true, immediate: true })

        watch(() => loader_selected.value, (v) => {
            if (!props.selectMode) return

            if (v) setSelected()
            else resetSelected()

            emit('update:cartage_loader_id', v?.id ?? null)
        }, { deep: true, immediate: true })

        onActivated(() => {
            // if (props.formRef) {
            // }
        })

        watch(() => props.formRef, (v) => {
            if (v) {
                v.reset()
            }
        }, {immediate: true})

        watch(() => props.selectMode, (v) => {
            if (v) {
                getLoaders()
            }
        }, { immediate: true })

        watch(() => props.address, (v) => {
            if (v && !props.selectMode) {
                setAddress(v)
            }
        }, { immediate: true })
        
        return {
            address_model,
            loader_selected,
            options,
            isDisabled,
            // name_value,
            setModel,
            filterFn
        }
    }
}
</script>