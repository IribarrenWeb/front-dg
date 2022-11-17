<template>
    <div class="row">
        <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading" :rules="[$rules.required()]"
            outlined :model-value="name" @update:model-value="$emit('update:name', $event)" type="text" label="Nombre" />
            <qu-input-validation apiName="name" class="col-md-6 col-12" :loading="loading" :rules="[$rules.required()]"
            outlined :model-value="name" @update:model-value="$emit('update:name',$event)" type="text" label="Apellido" />
    </div>
</template>

<script>
import modelService from '../../../../store/services/model-service';

export default {
    props: {
        name: {
            type: String,
            default: null
        },
        last_name: {
            type: String,
            default: null
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
        loader_id: {
            type: Number || String,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
    },
    setup(props) {
        const loader_selected = ref([])

        async function getLoader(){
            try {
                const res = modelService.apiNoLoading({url:``});
            } catch (err) {
                
            }
        }

        return {

        }
    }
}
</script>