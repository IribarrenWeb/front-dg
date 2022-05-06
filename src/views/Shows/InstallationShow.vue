<template>
    <div>
        en proceso...
    </div>
</template>

<script>
import service from "../../store/services/model-service";

export default {
    name:"installation-show",
    props:{
        installation_id:{
            required: true
        }
    },
    data() {
        return {
            model: this.$store.getters.INSTALLATION_SCHEMA,
        }
    },
    mounted() {
        this.getInst()
    },
    methods: {
        async getInst() {
             try {
                const res = await service.show('installation',this.installation_id,'includes[]=operations&includes[]=equipments&includes[]=auditable')
                console.log(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }
    },
}
</script>