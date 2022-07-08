<template>
    <div class="">
        <base-select v-model="model" @updated="$emit('updated',parseInt($event))" defaultOption="Delegado...">
            <option :value="delegate.id" v-for="delegate, idx in delegates" :key="idx">{{delegate?.user?.full_name}}</option>
        </base-select>
    </div>
</template>
<script>
import { ref } from 'vue'
import service from '../../store/services/model-service'
export default {
    inheritAttrs: true,
    setup() {
        const delegates = ref({})
        const model = ref(0)

        async function getDelegates(){
            const res = await service.getIndex('delegate', null,'includes[]=user');
            console.log(res);
            delegates.value = res.data.data
        }

        getDelegates();

        return {
            delegates,
            model
        }
    }
}
</script>