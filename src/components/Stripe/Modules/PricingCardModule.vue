<template>
    <div class="card shadow">
        <ul>
            <li class="pack">{{ planData.name }}</li>
            <li id="master" class="price bottom-bar">&dollar;{{ planData.price }}</li>
            <li class="bottom-bar">2 TB Storage</li>
            <li class="bottom-bar">10 Users Allowed</li>
            <li class="bottom-bar">Send up to 20 GB</li>
            <li><button class="btn">Learn More</button></li>
        </ul>
    </div>
</template>
<script>
export default {
    inheritAttrs: true,
    props: {
        planData: {}
    },
    setup(props) {

    }
}
</script>