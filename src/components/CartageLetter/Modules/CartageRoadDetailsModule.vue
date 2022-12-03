<template>
    <div>
        <h4 class="text-muted">Materiales:</h4>
        <div class="row">
            <q-item v-for="material, idx in materials" class="col-6" :key="idx">
                <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="fa-solid fa-recycle" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="truncate-250">
                        {{ material.material?.un_code }} - {{ material?.name }}
                        <q-tooltip>
                            {{ material.material?.denomination_name }}
                        </q-tooltip>
                    </q-item-label>
                    <q-item-label caption lines="2">Grupo de embalaje: {{ material.material?.packing?.code
                    }}</q-item-label>
                </q-item-section>
            </q-item>
        </div>
    </div>
</template>
<script>
import { computed } from '@vue/runtime-core'
export default {
    inheritAttrs:true,
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