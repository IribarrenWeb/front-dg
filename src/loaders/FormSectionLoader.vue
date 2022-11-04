<template>
    <div class="q-pa-md">
        <div class="q-gutter-md row justify-center border rounded border-light px-4 py-2 my-3" v-for="item, idx in repeat" :key="idx">
            <div style="margin-left: -15px; margin-right: -15px;" v-for="n, idx in limit" :key="idx" class="col-md-6 px-4 py-2">
                <q-skeleton height="45px" />
            </div>
        </div>
        <div class="flex items-center justify-end q-gutter-md q-mt-md">
            <q-skeleton  height="50px" width="100px" />
            <q-skeleton height="50px" width="100px" />
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
export default {
    name: 'FormLoader',
    props: {
        repeat: {
            type: Number,
            default: 2
        }
    },
    setup(props) {
        const limit = ref(0)
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min) * 2; // The maximum is exclusive and the minimum is inclusive
        }

        limit.value = getRandomInt(2,8)

        return {
            getRandomInt,
            limit
        }
    }
}
</script>