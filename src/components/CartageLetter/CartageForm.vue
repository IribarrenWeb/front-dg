<template>
    <div>
        <q-form @submit="onSubmit" class="q-px-md">
            <div>
                <h3>Agregar carta de porte</h3>
            </div>
            <q-separator spaced="15px" />
            <div class="row q-col-gutter-sm">
                <q-input class="col-md-6 col-12" outlined v-model="model.name" type="text" label="Nombre" />
                <q-input class="col-md-6 col-12" outlined v-model="model.description" type="text" label="Descripción" />

                <q-input class="col-md-6 col-12" outlined v-model="model.date" mask="date" label="Fecha" :rules="['date']">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                                <q-date v-model="model.date">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input class="col-md-6 col-12" outlined v-model="model.installation_id" type="text"
                    label="Instalación" />
            </div>
            <div class="q-gutter-md flex justify-end">
                <q-btn label="Cancelar" v-if="modalMode" type="reset" color="primary" @click="$emit('close', true)" />
                <q-btn label="Guardar" type="submit" color="primary" />
            </div>
        </q-form>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import functions from '../../utils/functions'
export default {
    props: {
        modalMode: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const model = ref({})

        function onSubmit() {
            alert('submit')
        }

        model.value = functions.schemas('cartage')

        return {
            model,

            onSubmit
        }
    }
}
</script>