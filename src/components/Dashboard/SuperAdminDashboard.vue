<template>
    <div>
        <div class="row mb-3">
            <div class="col-xl-4 col-lg-6">
                <stats-card title="Consultorias" type="gradient-info" :sub-title="counter.admins"
                    icon="ni ni-single-02" class="mb-4 mb-xl-0"></stats-card>
            </div>
            <div class="col-xl-4 col-lg-6">
                <stats-card title="Auditores" type="gradient-info" :sub-title="counter.auditors" icon="ni ni-hat-3"
                    class="mb-4 mb-xl-0"></stats-card>
            </div>
            <div class="col-xl-4 col-lg-6">
                <stats-card title="Empresas" type="gradient-info" :sub-title="counter.business" icon="ni ni-shop"
                    class="mb-4 mb-xl-0">
                </stats-card>
            </div>
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
            admins: 0,
            business: 0,
            auditors: 0,
        })
        async function getDash() {
            try {
                const res = await modelService.api({url:'super-admin/dashboard'});
                let data = res.data.data;
                counter.value = {
                    admins: data.admins >= 1 ? data.admins : "0",
                    business: data.business >= 1 ? data.business : "0",
                    auditors: data.auditors >= 1 ? data.auditors : "0",
                };
            } catch (err) {
                console.log(err);
            }
        }

        watch(() => role.value, (v) => {
            getDash()
        }, { immediate:true })

        return {
            counter
        }
    }
}
</script>