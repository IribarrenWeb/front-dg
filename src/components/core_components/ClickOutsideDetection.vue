<template>
    <div v-if="isOpen" class="position-fixed bg-transparent" @click="$emit('clicked', true)"
        style="top: 0; right: 0; width: 100%;height: 100%;">
    </div>
</template>
<script>

export default {
    name: 'ouside-click',
    props: ['isOpen'],
}
</script>