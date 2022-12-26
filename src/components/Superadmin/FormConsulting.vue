<template>
    <div>
        <h3>{{ consultingId ? 'Editar' : 'Registrar' }} consultoria</h3>
        <q-separator spaced="20px" />
        <q-form @submit.prevent="submit" class="row q-col-gutter-md">

            
            <div class="col-12">
                <q-input v-model="model.name" :rules="[val => val?.length || 'El nombre es requerido']" outlined type="text" label="Nombre consultoria" dense />
            </div>
            <div class="col-12">
                <q-input v-model="model.email" :rules="[val => val?.length || 'El email es requerido']" outlined type="text" label="Email" dense />
            </div>
            <div class="col-12">
                <q-input v-model="model.password" :rules="[val => val?.length || 'Las contraseña es requerida']"  outlined type="password" label="Contraseña" dense />
                <q-input v-model="model.password_confirmation" :rules="[val => val == model.password || 'Las contraseñas no coinciden']" outlined type="password" label="Contraseña" dense />
            </div>
            
            <div class="col-12 flex items-center justify-end q-gutter-md">
                <q-btn label="Cancelar" type="reset" color="primary" @click="$emit('cancel', true)" flat
                    class="q-ml-sm" />

                <q-btn label="Guardar"  :loading="loading" type="submit"
                    color="primary" />
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
            email: null,
            password: null,
            password_confirmation : null
        })
        const loading = ref(false)

        async function submit() {
            try {
                loading.value = true
                await modelService.apiNoLoading({ url: `consulting`, method: 'POST', data: model.value })
                loading.value = false

                Notify.create({
                    message: 'Consultoria registrada',
                    color: 'positive'
                })
                emit('saved', true);
            } catch (error) {
                const serverMessage = error?.request?.response ? JSON.parse(error?.request?.response) : null
                const message = serverMessage?.message ?? 'Ocurrio un error al registrar la consultoria';
                loading.value = false
                Notify.create({
                    message: message,
                    color: 'negative'
                })
            }
        }



        return {
            loading,
            model,
            submit,
        }
    }
}
</script>