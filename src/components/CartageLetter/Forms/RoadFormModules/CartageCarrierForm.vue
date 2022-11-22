<template>
    <div class="row">
        <qu-select-validation :rules="[!isDisabled ? $rules.required() : true]" :filled="isDisabled" apiName="carrier_data.business_name"
            class="col-md-6 col-12" :model-value="business_name" map-options :options="options" @filter="filterFn" outlined
            emit-value use-input fill-input :loading="loading" @input-value="setModel" label="Razón Social" hide-selected />

        <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="carrier_data.nif" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="nif"
            @update:model-value="$emit('update:nif', $event)" type="text" label="NIF" />

        <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="carrier_data.phone_number" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="phone_number"
            @update:model-value="$emit('update:phone_number', $event)" type="text" label="Numero de telefono" />

        <!-- <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="driver_name" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="driver_name"
            @update:model-value="$emit('update:driver_name', $event)" type="text" label="Nombre Conductor" />

        <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="driver_dni" class="col-md-6 col-12"
            :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined :model-value="driver_dni"
            @update:model-value="$emit('update:driver_dni', $event)" type="text" label="DNI conductor" />

        <qu-input-validation :readonly="isDisabled" :filled="isDisabled" apiName="driver_registration_number"
            class="col-md-6 col-12" :loading="loading" :rules="[!isDisabled ? $rules.required() : true]" outlined
            :model-value="driver_registration_number"
            @update:model-value="$emit('update:driver_registration_number', $event)" type="text"
            label="Placa conductor" /> -->


        <address-select-v-2 :readonly="isDisabled" v-model:filled="isDisabled" v-model:address="address_model.address"
            v-model:city="address_model.city" v-model:code="address_model.code"
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
        driver_name: {
            type: String,
            default: ''
        },
        driver_dni: {
            type: [String, Number],
            default: ''
        },
        driver_registration_number: {
            type: [String, Number],
            default: ''
        },
        cartage_carrier_id: {
            type: Number || String,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {
        const delivery_selected = ref(null)
        const address_model = ref({})
        const data_options = ref([])
        const options = ref([])
        // const name_value = ref([])
        const isDisabled = computed(() => delivery_selected.value ? true : false)

        async function getLoaders() {
            try {
                const res = await modelService.apiNoLoading({ url: `cartage-carrier` });
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
            if (index >= 0) delivery_selected.value = data_options.value[index]
            else {
                emit('update:business_name', val)
                // name_value.value = val
                delivery_selected.value = null
            }
        }

        function resetSelected() {
            const k = ['nif', 'phone_number', 'address']
            console.log(k, delivery_selected.value);
            k.forEach(k => {
                emit('update:' + k, null)
            });
        }
        async function filterFn(val, update, abort) {
            update(() => {
                const needle = val.toLocaleLowerCase()
                options.value = data_options.value.filter(v => v.label.toLowerCase().includes(needle))
            })
        }

        function setSelected() {
            const k = keys(delivery_selected.value?.value)
            console.log(k, delivery_selected.value);
            k.forEach(k => {
                if (k == 'address' && delivery_selected.value?.value?.address) {
                    const k_ad = keys(delivery_selected.value?.value?.address)
                    k_ad.forEach(ad_k => {
                        address_model.value[ad_k] = delivery_selected.value.value?.address[ad_k]
                    });
                }
                emit('update:' + k, delivery_selected.value?.value[k])
            });
        }

        getLoaders()

        address_model.value = functions.schemas('address')

        watch(() => address_model.value, (v) => {
            emit('update:address', v)
        }, { deep: true, immediate: true })

        watch(() => props.same_loader, (v) => {

            if (v) {
                resetSelected()
                emit('update:cartage_carrier_id', null)
            }

        }, { deep: true, immediate: true })

        watch(() => delivery_selected.value, (v) => {

            if (v) setSelected()
            else resetSelected()

            emit('update:cartage_carrier_id', v?.id)
        }, { deep: true, immediate: true })

        onActivated(() => {
            // if (props.formRef) {
            //     props.formRef.resetValidation()
            // }
        })

        watch(() => props.formRef, (v) => {
            if (v) {
                v.reset()
            }
        }, { immediate: true })

        return {
            address_model,
            delivery_selected,
            options,
            isDisabled,
            // name_value,
            setModel,
            filterFn
        }
    }
}
</script>