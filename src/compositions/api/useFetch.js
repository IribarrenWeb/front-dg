import { ref, computed } from "@vue/composition-api";
import service from "../store/services/model-service";

export default function useFetch(model) {
    const data = ref([]);
    const metaData = ref({});
    const page = ref(1);
    const loading = ref(false);

    const getData = async (page) => {
        loading.value = true;
        const resp = await service.getIndex(model, page);
        if (typeof resp.data.data !== "undefined") {
            data.value = resp.data.data;
            metaData.value = resp.data.meta.page;
            page.value = metaData.value.currentPage;
        }
        loading.value = false;
    };

    const isLoading = computed(() => loading.value);

    return {
        data,
        metaData,
        page,
        getData,
        isLoading,
    };
}
