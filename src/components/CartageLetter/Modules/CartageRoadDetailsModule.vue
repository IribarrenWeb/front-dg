<template>
    <div>
        <h4 class="text-muted">Materiales:</h4>
        <div class="row">
            <q-expansion-item v-for="material, idx in materials" class="col-6 text-primary" :key="idx"
                :label="material.material?.un_code + ' - ' + material?.name" icon="fa-solid fa-recycle">
                <!-- <q-tooltip>
                    {{ material.material?.denomination_name }}
                </q-tooltip> -->
                <q-list dense style="font-size: 10px;" class="text-grey-7 bg-grey-3">
                    <q-item dense>
                        <q-item-section><span>Denominación ADR: <b>{{ material?.material?.denomination_name
                        }}</b></span>

                        </q-item-section>
                    </q-item>
                    <q-item dense>
                        <q-item-section style="font-size: 10px;"><span>Clase: <b>{{
                                material.material?.class?.code
                        }}</b></span></q-item-section>
                    </q-item>
                    <q-item dense>
                        <q-item-section style="font-size: 10px;"><span>Grupo de embalaje: <b>{{
                                material.material?.packing?.code
                        }}</b></span></q-item-section>
                    </q-item>
                    <q-item dense>
                        <q-item-section style="font-size: 10px;"><span>Numero de bultos: <b>{{
                                material.pivot?.number_of_packages
                        }}</b></span></q-item-section>
                    </q-item>
                    <q-item dense>
                        <q-item-section style="font-size: 10px;"><span>Cantidad de bultos: <b>{{
                                material.pivot?.quantity_of_packages
                        }}</b></span></q-item-section>
                    </q-item>
                    <q-item dense>
                        <q-item-section style="font-size: 10px;" class="flex"><span>Empaque: <b>{{
                                material.pivot?.packing_name
                        }}</b></span></q-item-section>
                    </q-item>
                </q-list>
            </q-expansion-item>
            <!-- <q-item>
                <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="fa-solid fa-recycle" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="truncate-250">

                    </q-item-label>
                    <q-item-label caption lines="2"></q-item-label>

                    <q-item-label caption lines="2">Numero de bultos: {{
                            material.pivot?.number_of_packages
                    }}</q-item-label>
                    <q-item-label caption lines="2">Cantidad de bultos: {{
                            material.pivot?.quantity_of_packages
                    }}</q-item-label>
                    <q-item-label caption lines="2">Empaque: {{ material.pivot?.packing_name }}</q-item-label>
                </q-item-section>
            </q-item> -->
        </div>
    </div>
</template>
<script>
import { computed } from '@vue/runtime-core'
export default {
    inheritAttrs: true,
    props: {
        cartage: {}
    },
    setup(props) {
        const materials = computed(() => props.cartage?.materials)

        return {
            materials
        }
    }
}
</script>