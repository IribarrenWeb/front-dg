<template>
	<div class="custom-table">
		<table-header :title="translate(typeUser)">
			<q-btn color="primary" label="Agregar" @click="showAdd = true" />
		</table-header>
		<q-table :loading="loading" table-class="table" table-header-class="thead-light" :rows="data" :columns="columns"
			row-key="id">

			<!-- <template v-slot:top>
			</template> -->

			<!-- <template v-slot:body-cell-status="props">
				<q-td :props="props">
					<q-badge class="text-capitalize" rounded :color="props.value?.color" v-if="props.value?.label"
						:label="props.value?.label" />
				</q-td>
			</template> -->

			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn-dropdown class="custom-drop" flat rounded icon="fa-solid fa-ellipsis-vertical"
						color="grey-7">
						<q-list bordered>
							<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup>
								<q-item-section>
									<q-item-label>Eliminar</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
		</q-table>

		<q-dialog v-model="showAdd">
			<q-card style="min-width: 500px;">
				<q-card-section class="q-pa-lg">
					<form-delegate v-if="typeUser == 'delegate'"  @saved="getUsers()"/>
					<form-consulting v-else-if="typeUser == 'consulting'" @cancel="showAdd = false" @saved="getUsers()"/>
				</q-card-section>
			</q-card>
		</q-dialog>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import { computed, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import TableHeader from '../Utils/TableHeader.vue'
import { moment } from '../../boot/plugins'

import FormDelegate from '../Delegate/FormDelegate.vue'
import FormConsulting from './FormConsulting.vue'

export default {
	components: { TableHeader, FormDelegate, FormConsulting },
	props: {
		typeUser: {
			type: String,
			default: 'consulting'
		}
	},
	setup(props) {
		const data = ref([])
		const store = useStore();
		const role = computed(() => store.getters.ROLE)
		const loading = ref(false)
		const showAdd = ref(false)
		const columns = [
			{
				name: 'name',
				label: 'Nombre',
				align: 'left',
				field: row => row?.user ? row?.user.full_name : row?.full_name,
			},
			{
				name: 'created_at',
				label: 'Creado hace',
				align: 'left',
				// field: row => row?.scheduled_date,
				field: row => moment(row?.scheduled_date_original).format('DD/MM/YYYY HH:mm a'),
				// field: row => row?.created_at,
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'actions',
			},
		]

		function translate(title) {
			switch (title) {
				case 'consulting':
					return 'consultoria'
					break;

				case 'delegate':
					return 'auditores'
					break;

				case 'business':
					return 'empresas'
					break;

				default:
					break;
			}
		}

		async function getUsers() {
			try {
				showAdd.value = false
				loading.value = true
				const wheres = JSON.stringify({
					type: props.typeUser
				})

				const includes = JSON.stringify([
					'user'
				])

				let url = `${props.typeUser}`

				if (props.typeUser != 'consulting') {
					url += `?includes[]=user`
				}
				const res = await modelService.api({ url })
				console.log(res);
				data.value = res?.data?.data ?? []
				loading.value = false
			} catch (error) {

			}
		}

		function handleCancel(id) {


		}


		watch(() => props.typeUser, (v) => getUsers(), { immediate: true })

		return {
			columns,
			data,
			role,
			showAdd,
			loading,
			translate,
		}
	}
}
</script>