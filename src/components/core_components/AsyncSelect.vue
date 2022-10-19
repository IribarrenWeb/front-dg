<template>
	<div :class="classes">
		<multiselect
			:class="customClass"
			:disabled="disabled"
			v-model="content"
			:placeholder="placeholder"
			v-if="typeof options == 'object'"
			searchable
			@select="handleSelect"
			label="label"
			:options="options"
			:trackBy="trackBy"
			:loading="loading"
			deselectLabel="Remover"
			close-on-select
			@search-change="getUsers"
			openDirection="bottom"
			selectLabel="Seleccionar"
			@remove="handleSelect($event, true)"
		></multiselect>
	</div>
</template>
<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css">
</style>

<script>
	import Multiselect from "vue-multiselect";
	import { debounce, map } from "lodash";
	import { ref, onMounted, watch } from "vue";
	import { useStore } from "vuex";
	import dataService from "../../store/services/data-service";
	export default {
		props: {
			params: {
				type: String,
				required: false,
			},
			clear: {
				type: Boolean,
				default: false,
			},
			list: {
				type: Boolean,
				default: true,
			},
			placeholder: {
				type: String,
				default: "Selecciona...",
			},
			classes: {
				type: String,
			},
			customClass: {
				type: String,
			},
			trackBy: {
				type: String,
				default: 'id'
			},
			minSearch: {
				type: Number,
				default: 2,
			},
			roles: {
				type: Array,
				default: () => {
					return [2];
				},
			},
			wait: {
				type: Number,
				default: 500,
			},
			value: null,
			disabled: {
				type: Boolean,
				default: false,
			},
			option_disabled: null,
			materials: {
				type: Boolean,
				default: false,
			}
		},
		emits: ["input", "selected", "updated"],
		components: {
			Multiselect,
		},
		setup(props, { emit }) {
			const options = ref([]);
			const store = useStore();
			const content = ref(null);
			const loaded = ref(false)
			const loading = ref(false)

			const getUsers = debounce(async function search(query = null) {
				if (query?.length >= props.minSearch || props.list) {
					
					if (props.list && loaded.value) {
						return
					}

					try {
						if (props.materials) {
							loading.value = true
							const res = await dataService.getAdrMaterials(`un_code=${query}`);
							const data = res.data.data;
							options.value = map(data, (material) => {
								return {
									value: material,
									// id:material.id,
									label: `${material.un_code} - ${material.denomination_name}`,
								};
							});
							loading.value = false
						} else {
							const res = await store.dispatch("users", {
								query: query ?? "",
								roles: props.roles,
								params: props.params,
							});

							options.value = res.map((r) => {
								r['$isDisabled'] = props.option_disabled ? r.id == props.option_disabled : false;
								return r;
							});

							if (props.value) {
								content.value = options.value.find((o) => o.id == props.value)
							}
						}
						loaded.value = true
					} catch (error) {
						console.log(error);
					}
				}
			}, props.wait);

			onMounted(() => {
				options.value = [];
				if (props.list) {
					getUsers(null);
				}
			});

			function handleSelect(evt, clear = false) {
				console.log(evt);
				emit("selected", clear ? null : evt?.value);
				emit("input", clear ? null : evt?.value);
				emit("updated", clear ? null : evt?.value);
			}

			watch(
				() => props.clear,
				(val) => {
					if (val) {
						content.value = null;
						emit("update:clear", false);
					}
				}
			);

			return {
				handleSelect,
				getUsers,
				content,
				options,
				loading
			};
		},
	};
</script>
