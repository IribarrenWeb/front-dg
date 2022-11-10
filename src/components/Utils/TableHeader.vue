<template>
    <div>
        <div class="card-header border-0">
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0 text-capitalize" :class="{'text-white': type === 'dark'}">
                        {{ title }}
                    </h3>
                </div>
                <div class="col justify-content-end d-flex q-gutter-md">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String
        },
        type: {
            type: String,
            default: ''
        }
    }
}
</script>