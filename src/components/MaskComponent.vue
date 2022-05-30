<template>
    <div class="position-absolute w-100 h-100 d-flex justify-content-center align-content-center bg-light">
        <span class="text-capitalize text-secondary font-weight-bold">{{msg}}</span>
    </div>
</template>
<script>
export default {
    name: "mask-component",
    data() {
        return {
            
        }
    },
    props: {
        msg: {
            type: String,
            default: "mensaje"
        }
    }
}
</script>