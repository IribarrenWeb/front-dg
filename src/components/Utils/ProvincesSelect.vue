<template>
    <div >
        <base-field :name="name" label="Provincia">
            <field-validate class="form-control" as="select" :name="name" rules="" label="Provincia"
                v-model="model">
                <option value="" selected>Selecciona una provincia</option>
                <option v-for="province in provinces" :key="province.id" :value="province.id">
                    {{ province.name }}
                </option>
            </field-validate>
        </base-field>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import service from '../../store/services/model-service';

export default {
    props: {
        modelValue: {},
        name: {
            type: String,
            default: 'province_id'
        }
    },
    setup(props, { emit }) {
        const model = ref(props.modelValue);
        const provinces = ref([])
        async function getProvinces() {
            try {
                const res = await service.api('provinces');
                provinces.value = res.data.data
            } catch (err) {
                console.log(err);
            }
        }

        getProvinces()

        onMounted(()=>{console.log(props.modelValue, model.value);})

        watch(model, (val) => { 
            emit('update:modelValue', val)
        })

        return {
            model,
            provinces
        }
    }
}
</script>