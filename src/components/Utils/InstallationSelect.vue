<template>
    <div v-if="role == 'business'" class="row border rounded border-light px-4 py-2 mb-2">
        <div class="col">
            <base-field name="installation_id" label="Instalación">
                <field-validate as="select" class="form-control" name="installation_id" rules="required"
                    label="instalación" v-model="model">
                    <option v-for="(installation, idx) in installations" :key="idx" :value="installation.id"
                        class="text-uppercase">
                        #{{ idx + 1 }} - {{ installation.name }}
                    </option>
                </field-validate>
            </base-field>
        </div>
    </div>
</template>
<script>
import { ref, watch } from 'vue';
import service from '../../store/services/model-service';
import { isEmpty } from 'lodash';
import { useStore } from 'vuex';

export default {
    props: {
        modelValue: {},
    },
    setup(props, { emit }) {
        const model = ref(props.modelValue);
        const installations = ref([])
        const store = useStore()
        const role = ref(null);

        async function getInstallations() {
            try {
                const res = await service.api('installations');
                installations.value = res.data.data
            } catch (err) {
                console.log(err);
            }
        }
        // getInstallations()

        watch(model, (val) => {
            emit('update:modelValue', val)
        })

        watch(() => store.getters.ROLE, (val) => {
            role.value = val
            if (!isEmpty(val) && val == 'business') {
                getInstallations()
            }
        }, { immediate: true })

        return {
            model,
            installations,
            role
        }
    }
}
</script>