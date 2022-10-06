<template>
    <div class="row border border-light rounded p-2 my-2">
        <div class="col-12">
            <h4>{{title}}</h4>
        </div>
        <div class="col">
            <div class="row">
                <div class="col-12 col-md-4">
                    <base-field label="Calle">
                        <input class="form-control" type="text" ref="street" :value="address"
                            @input="$emit('update:address', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-6 col-md-2">
                    <base-field label="Número">
                        <input class="form-control" type="text" :value="street_number"
                            @input="$emit('update:street_number', $event.target.street_number)" />
                    </base-field>
                </div>
                <div class="col-6 col-md-2">
                    <base-field label="Código postal">
                        <input class="form-control" type="text" :value="code"
                            @input="$emit('update:code', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-12 col-md-4">
                    <base-field label="Municipio">
                        <input class="form-control" type="text" :value="city"
                            @input="$emit('update:city', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-12 col-md-4">
                    <base-field label="Provincia">
                        <input class="form-control" type="text" :value="province"
                            @input="$emit('update:province', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-12 col-md-4">
                    <base-field label="Comunidad Autónoma">
                        <input class="form-control" type="text" :value="comunity"
                            @input="$emit('update:comunity', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-12 col-md-4">
                    <base-field label="País">
                        <input class="form-control" type="text" :value="country"
                            @input="$emit('update:country', $event.target.value)" />
                    </base-field>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';


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
        }
    },
    setup(props, { emit }) {
        const street = ref()
        let autocomplete = null

        onMounted(() => {
            // eslint-disable-next-line no-undef
            autocomplete = new google.maps.places.Autocomplete(street.value, {
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
        })

        onUnmounted(() => {
            if (autocomplete) {
                // eslint-disable-next-line no-undef
                google.maps.event.clearInstanceListeners(autocomplete)
            }
        })

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