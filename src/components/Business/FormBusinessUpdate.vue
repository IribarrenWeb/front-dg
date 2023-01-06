<template>
    <div>
        <form-business v-if="!businessData" @saved="$emit('saved',1)" @closed="$emit('close',1)"/>
        <show-business v-else :business="businessData" @close="$emit('close',1)" @reload="$emit('saved',1)" />
    </div>
</template>
<script>
import FormBusiness from './FormBusiness.vue'
import ShowBusiness from './ShowBusiness.vue'
export default {
	components: { ShowBusiness, FormBusiness },
    props: {
        businessData: {
            type: [Object, Number, String],
            default: null
        }
    },
    setup(props) {
        
        return {

        }
    }
}
</script>