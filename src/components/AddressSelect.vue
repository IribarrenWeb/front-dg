<template>
    <div class="row border border-light rounded p-2 my-2">
        <div class="col-12">
            <h4>Dirección</h4>
        </div>
        <div class="col">
            <div class="row">
                <div class="col-6">
                    <base-field label="Calle">
                        <input class="form-control" type="text" ref="street" :value="address"
                            @input="$emit('update:address', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-6">
                    <base-field label="Codigo postal">
                        <input class="form-control" type="text" :value="code"
                            @input="$emit('update:code', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-6">
                    <base-field label="Ciudad">
                        <input class="form-control" type="text" :value="city"
                            @input="$emit('update:city', $event.target.value)" />
                    </base-field>
                </div>
                <div class="col-6">
                    <base-field label="Pais">
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