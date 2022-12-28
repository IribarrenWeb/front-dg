<template>
    <div>
        <h3>{{ consultingId ? 'Editar' : 'Registrar' }} consultoria</h3>
        <q-separator spaced="20px" />
        <q-form @submit.prevent="submit" class="q-col-gutter-md">

            <form-block title="Datos generales">
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.name" :rules="[val => val?.length || 'El nombre es requerido']" outlined
                        type="text" label="Nombre consultoria" />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.email" :rules="[val => val?.length || 'El email es requerido']" outlined
                        type="text" label="Email" />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.dni" mask="#########" :rules="[val => val?.length || 'El DNI es requerido']" outlined
                        type="text" label="DNI" />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.phone_number" mask="#########" :rules="[val => val?.length || 'El movil es requerido']" outlined
                        type="text" label="Movil" />
                </div>
            </form-block>

            <form-block title="Datos de consultoria">
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.consultancy_name" :rules="[val => val?.length || 'El nombre es requerido']" outlined
                        type="text" label="Nombre empresa" />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.consultancy_email" :rules="[val => val?.length || 'El email es requerido']" outlined
                        type="text" label="Email" />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.cif_nif" mask="#########" :rules="[val => val?.length || 'El DNI es requerido']" outlined
                        type="text" label="CIF/DNI" />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <q-input v-model="model.consultancy_phone" mask="#########" :rules="[val => val?.length || 'El movil es requerido']" outlined
                        type="text" label="Movil" />
                </div>
            </form-block>
           
            <form-block title="Dirección">
                <address-select-v-2 v-model:address="model.address.address" v-model:city="model.address.city"
                    v-model:code="model.address.code" v-model:comunity="model.address.comunity"
                    v-model:province="model.address.province" v-model:country="model.address.country"
                    v-model:street_number="model.address.street_number" />
            </form-block>
            <!-- <div class="col-12">
                <q-input v-model="model.password" :rules="[val => val?.length || 'Las contraseña es requerida']"  outlined type="password" label="Contraseña" dense />
                <q-input v-model="model.password_confirmation" :rules="[val => val == model.password || 'Las contraseñas no coinciden']" outlined type="password" label="Contraseña" dense />
            </div> -->

            <div class="col-12 flex items-center justify-end q-gutter-md">
                <q-btn label="Cancelar" type="reset" color="primary" @click="$emit('cancel', true)" flat
                    class="q-ml-sm" />

                <q-btn label="Guardar" :loading="loading" type="submit" color="primary" />
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
import AddressSelectV2 from '../core_components/AddressSelectV2.vue'
import FormBlock from '../Utils/FormBlock.vue'
export default {
    components: { AddressSelectV2, FormBlock },
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
            address: null,
            consultancy_name: null,
            cif_nif: null,
            consultancy_phone: null,
            consultancy_email: null,
            dni: null,
            phone_number: null,
            firm_date: null,
            address: {
                code: null,
                city: null,
                address: null,
                street_number: null,
                comunity: null,
                country: null,
                province: null,
            }
        })
        const loading = ref(false)
        const consultancy_data = ref(null)

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

        async function getConsulting(){
            try {
                
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

        watch(() => props.consultingId, (v) => {
            if (condition) {
                
            }
        })



        return {
            loading,
            model,
            submit,
        }
    }
}
</script>