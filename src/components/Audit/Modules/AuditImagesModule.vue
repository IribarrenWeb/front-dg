<template>
    <div>
        <div v-if="images.length >= 1" class="border border-light rounded p-3 mb-3" style="max-height: 400px">
            <div class="q-gutter-sm row items-start">
                <q-img v-for="(image, id) in images" :key="id" :src="image.url" spinner-color="primary"
                    style="height: 140px; max-width: 150px">
                    <q-btn color="primary" dense push style="right: 0;" class="absolute all-pointer-events"
                        icon="fa-solid fa-circle-xmark" @click="$emit('delete', image.id)">
                        <q-tooltip>
                            Eliminar
                        </q-tooltip>
                    </q-btn>
                </q-img>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        images: {}
    },
    setup(props) {
        
    }
}
</script>