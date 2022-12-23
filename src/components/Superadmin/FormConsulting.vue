<template>
    <div>
        <h3>{{ consultingId ? 'Editar' : 'Registrar' }}</h3>
        <q-separator spaced="20px" />
        <q-form @submit="submit" class="row q-col-gutter-md">

            <q-input v-model="model.name" outlined type="text" label="Nombre consultoria" dense />

            <q-input v-model="model.password" outlined type="text" label="Contraseña" dense />
            
            <div class="col-12 flex items-center justify-end q-gutter-md">
                <q-btn label="Cancelar" type="reset" color="primary" @click="$emit('cancel', true)" flat
                    class="q-ml-sm" />

                <!-- <q-btn v-if="consultingId" label="Aceptar" :loading="loading" @click="handleUpdate(1)"
                    color="primary" />

                <q-btn v-else label="Guardar" :disable="!model.installation_id" :loading="loading" type="submit"
                    color="primary" /> -->
            </div>
        </q-form>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'
import { Notify } from 'quasar'
import { useStore } from 'vuex'
export default {
    components: {  },
    props: {
        consultingId: {
            type: Number,
            default: null
        }
    },
    setup(props, { emit }) {
        const store = useStore();
        const role = computed(() => store.getters.ROLE)
        const model = ref({
            name: null,
            password: null,
        })

        async function submit() {
            // try {
            //     loading.value = true
            //     await modelService.apiNoLoading({ url: `business-aplication`, method: 'POST', data: model.value })
            //     loading.value = false

            //     Notify.create({
            //         message: 'Solicitud realizada',
            //         color: 'positive'
            //     })
            //     emit('saved', true);
            // } catch (error) {
            //     const serverMessage = error?.request?.response ? JSON.parse(error?.request?.response) : null
            //     const message = serverMessage?.message ?? 'Ocurrio un error al realizar la solicitud';
            //     loading.value = false
            //     Notify.create({
            //         message: message,
            //         color: 'negative'
            //     })
            // }
        }



        return {
            model
        }
    }
}
</script>