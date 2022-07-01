<template>
    <div>
        <multiselect :disabled="disabled" v-model="content" v-if="typeof options == 'object'" :searchable="true" @select="handleSelect" label="label" :options="options"
            trackBy="label" :close-on-select="true" @search-change="getUsers" openDirection="bottom"></multiselect>
    </div>

</template>
<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.css">
</style>

<script>
import Multiselect from 'vue-multiselect'
import { debounce, map } from 'lodash'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import dataService from '../store/services/data-service'
export default {
    props: {
        params: {
            type: String,
            required: false
        },
        list: {
            type: Boolean,
            default: true
        },
        placeHolder: {
            type: String,
            default: 'Selecciona...'
        },
        minSearch: {
            type: Number,
            default: 2
        },
        roles: {
            type: Array,
            default: () => {
                return [2]
            }
        },
        wait: {
            type: Number,
            default: 500
        },
        value: {},
        disabled: {
            type: Boolean,
            default: false
        },
        materials: {
            type: Boolean,
            default: false
        },
    },
    emits: ['input', 'selected', 'updated'],
    components: {
        Multiselect
    },
    setup(props, { emit }) {
        const options = ref([])
        const store = useStore()
        const content = ref(props.value)
        
        const getUsers = debounce(async function search(query = null) {
            if (query?.length >= props.minSearch || props.list) {
                try {
                    if (props.materials) {
                        const res = await dataService.getAdrMaterials(`un_code=${query}`);
                        const data = res.data.data;
                        options.value = map(data, (material) => {
                            return {
                                value: material,
                                label: `${material.un_code} - ${material.denomination_name}`,
                            };
                        });
                    }else{
                        const res = await store.dispatch('users', { query: query ?? '', roles: props.roles, params: props.params })
                        options.value = res
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }, props.wait)

        onMounted(() => {
            if (props.list) {
                getUsers(null)
            }
            options.value = []
        })

        function handleSelect(evt) {
            console.log(evt);
            emit('selected', evt?.value)
            emit('input', evt?.value)
            emit('updated', evt?.value)
        }

        console.log(options.value);
        return {
            handleSelect,
            getUsers,
            content,
            options
        }
    }
}
</script>
