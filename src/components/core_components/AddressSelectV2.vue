<template>
    <div class="row">
        <div class="col-12 col-md-4">
            <q-input :readonly="readonly" :filled="filled" :model-value="address" label="Calle"
                @update:model-value="$emit('update:address', $event)" type="text" ref="street" outlined />
        </div>
        <div class="col-6 col-md-2">
            <q-input :readonly="readonly" :filled="filled" :model-value="street_number" label="Número"
                @update:model-value="$emit('update:street_number', $event)" type="text" outlined />
        </div>
        <div class="col-6 col-md-2">
            <q-input :readonly="readonly" :filled="filled" :model-value="code" label="Código postal"
                @update:model-value="$emit('update:code', $event)" type="text" outlined />
        </div>
        <div class="col-12 col-md-4">
            <q-input :readonly="readonly" :filled="filled" :model-value="city" label="Municipio"
                @update:model-value="$emit('update:city', $event)" type="text" outlined />
        </div>
        <div class="col-12 col-md-4">
            <q-input :readonly="readonly" :filled="filled" :model-value="province" label="Provincia"
                @update:model-value="$emit('update:province', $event)" type="text" outlined />
        </div>
        <div class="col-12 col-md-4">
            <q-input :readonly="readonly" :filled="filled" :model-value="comunity" label="Comunidad Autónoma"
                @update:model-value="$emit('update:comunity', $event)" type="text" outlined />
        </div>
        <div class="col-12 col-md-4">
            <q-input :readonly="readonly" :filled="filled" :model-value="country" label="País"
                @update:model-value="$emit('update:country', $event)" type="text" outlined />
        </div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue';


export default {
    components: {
    },
    props: {
        address: {
            type: String,
            default: ''
        },
        code: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        province: {
            type: String,
            default: ''
        },
        comunity: {
            type: String,
            default: ''
        },
        street_number: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: 'Dirección'
        },
        filled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const street = ref()
        let autocomplete = null

        onMounted(() => {
            // eslint-disable-next-line no-undef

        })

        onUnmounted(() => {
            if (autocomplete) {
                // eslint-disable-next-line no-undef
                google.maps.event.clearInstanceListeners(autocomplete)
            }
        })

        function init(){
            const input = street.value.getNativeElement();
            autocomplete = new google.maps.places.Autocomplete(input, {
                types: ['address'],
                fields: ['address_components'],
                componentRestrictions: { country: 'es' }
            })

            // eslint-disable-next-line no-undef
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                console.log(autocomplete.getPlace());
                const mapping = {
                    route: "update:address",
                    locality: "update:city",
                    postal_code: "update:code",
                    country: "update:country",
                    street_number: "update:street_number",
                    administrative_area_level_2: "update:province",
                    administrative_area_level_1: "update:comunity",
                }

                for (const type in mapping) {
                    emit(mapping[type], '')
                }
                let place = {
                    address_components: [],
                    ...autocomplete.getPlace()
                }

                place.address_components.forEach(element => {
                    element.types.forEach((type) => {
                        // eslint-disable-next-line no-prototype-builtins
                        if (mapping.hasOwnProperty(type)) {
                            console.log('hellow');
                            emit(mapping[type], element.long_name)
                        }
                    })
                });
            })
        }

        watch(() => street.value, (v) => {
            if (v) {
                init()
            }
        },{immediate: true})

        return {
            street
        }
    }
}
</script>
<style>
.pac-container {
    z-index: 10000 !important;
}
</style>