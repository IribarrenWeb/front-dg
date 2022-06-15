<template>
    <div>
        <a href="#" class="btn btn-sm btn-outline-default" @click.prevent="handleDelete"><i
                class="fa-regular fa-trash-can"></i></a>
    </div>
</template>
<script>
import { useStore } from 'vuex'
export default {
    props: {
        model: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },
    setup(props, {emit}) {
        const store = useStore()

        async function handleDelete() {
            const res = await store.dispatch('delete', {model: props.model, id: props.id})
            if (res.status == 200) {
                emit('deleted', true)
            }
        }

        return {
            handleDelete
        }
    }
}
</script>