<template>
    <div>
        <div class="row mb-3" v-if="role == 'admin'">
            <div class="col-xl-3 col-lg-6">
                <stats-card title="Delegación" type="gradient-info" :sub-title="counter.delegates"
                    icon="ni ni-single-02" class="mb-4 mb-xl-0"></stats-card>
            </div>
            <div class="col-xl-3 col-lg-6">
                <stats-card title="Auditores" type="gradient-info" :sub-title="counter.auditors" icon="ni ni-hat-3"
                    class="mb-4 mb-xl-0"></stats-card>
            </div>
            <div class="col-xl-3 col-lg-6">
                <stats-card title="Empresas" type="gradient-info" :sub-title="counter.business" icon="ni ni-shop"
                    class="mb-4 mb-xl-0">
                </stats-card>
            </div>
            <div class="col-xl-3 col-lg-6">
                <stats-card title="Instalaciones" type="gradient-info" :sub-title="counter.insts"
                    icon="ni ni-chart-bar-32" class="mb-4 mb-xl-0">
                </stats-card>
            </div>
        </div>
        <div>
            <visit-tablet :dash="true" title="Visitas"></visit-tablet>
        </div>
        <div class="my-md-4">
            <AnnualReportTable :dash="true"></AnnualReportTable>
        </div>
        <div>
            <non-table :dash="true"></non-table>
        </div>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import AnnualReportTable from '../AnnualReport/AnnualReportTable.vue'
import NonTable from '../Non/NonTable.vue'
import VisitTablet from '../Visit/VisitTablet.vue'
import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core'
import modelService from '../../store/services/model-service'
export default {
    components: { VisitTablet, AnnualReportTable, NonTable },
    props: {

    },
    setup(props) {
        const store = useStore()
        const role = computed(() => store.getters.ROLE)

        const counter = ref({
            delegates: 0,
            business: 0,
            auditors: 0,
            insts: 0,
        })
        async function getDash() {
            try {
                const res = await modelService.dashboard();
                let data = res.data.data;
                counter.value = {
                    delegates: data.delegates >= 1 ? data.delegates : "0",
                    business: data.business >= 1 ? data.business : "0",
                    auditors: data.auditors >= 1 ? data.auditors : "0",
                    insts: data.installations >= 1 ? data.installations : "0",
                };
            } catch (err) {
                console.log(err);
            }
        }

        watch(() => role.value, (v) => {
            if(v && v == 'admin') getDash()
        }, { immediate:true })

        return {
            counter
        }
    }
}
</script>