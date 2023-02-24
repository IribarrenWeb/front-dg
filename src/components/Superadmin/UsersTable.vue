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
							<q-item @click="handleShow(props.row)" style="min-width: 200px;text-align: center;" clickable v-close-popup>
								<q-item-section>
									<q-item-label>Detalles</q-item-label>
								</q-item-section>
							</q-item>
							<q-item @click="destroy(props.row.id)" style="min-width: 200px;text-align: center;" clickable v-close-popup>
								<q-item-section>
									<q-item-label>Eliminar</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
		</q-table>

		<!-- <q-dialog v-model="showAdd" :full-height="typeUser != 'consulting'" :full-width="typeUser != 'consulting'"> -->
		<q-dialog v-model="showAdd" :full-height="typeUser != 'consulting'" full-width>
			<!-- <q-card :style="{minWidth: typeUser == 'consulting' ? '500px' : '100%'}"> -->
			<q-card :style="{minWidth: '100%'}">
				<q-card-section class="q-pa-lg">
					<form-auditor v-if="typeUser == 'auditors'" :id="selectedId" @closeModal="showAdd = false" @saved="getUsers()"/>
					<form-consulting v-else-if="typeUser == 'consulting'" :consultingId="selectedId" @cancel="showAdd = false" @updated="getUsers(true)" @saved="getUsers()"/>
					<form-business-update v-else-if="typeUser == 'business'" :businessData="selectedId" @close="showAdd = false" @saved="getUsers()"/>
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
import { Dialog, Notify } from 'quasar'
import FormAuditor from '../Auditor/FormAuditor.vue'
import FormBusinessUpdate from '../Business/FormBusinessUpdate.vue'

export default {
	components: { TableHeader, FormDelegate, FormConsulting, FormAuditor, FormBusinessUpdate },
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
		const selectedId = ref(null);
		const columns = [
			{
				name: 'name',
				label: 'Nombre',
				align: 'left',
				field: row => row?.user ? row?.user.full_name : row?.full_name,
			},
			{
				name: 'plan',
				label: 'Plan contratado',
				align: 'left',
				// field: row => row?.scheduled_date,
				field: row => row.user ? row.user?.plan?.name : row?.plan?.name,
				// field: row => moment(row?.scheduled_date_original).format('DD/MM/YYYY HH:mm a'),
				// field: row => row?.created_at,
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'created_at',
				label: 'Creado hace',
				align: 'left',
				// field: row => row?.scheduled_date,
				field: row => moment(row?.created_at).format('DD/MM/YYYY HH:mm a'),
				// field: row => moment(row?.scheduled_date_original).format('DD/MM/YYYY HH:mm a'),
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

				case 'auditors':
					return 'auditores'
					break;

				case 'business':
					return 'empresas'
					break;

				default:
					break;
			}
		}

		async function getUsers(noClose = false) {
			try {
				showAdd.value = noClose
				loading.value = true

				let url = `${props.typeUser}`

				if (props.typeUser != 'consulting') {
					url += `?includes[]=user.plan`
				}
				if(props.typeUser == 'business') {
					url += `&counts[]=installations&includes[]=documents.type&includes[]=bank`
				}
				
				const res = await modelService.api({ url })
				console.log(res);
				data.value = res?.data?.data ?? []
				loading.value = false
			} catch (error) {

			}
		}

		function handleShow(data){
			if (props.typeUser != 'business') selectedId.value = data?.profile?.id ?? data?.id
			else selectedId.value = data

			showAdd.value = true
		}

		function destroy(id) {

			Dialog.create({
				title: '¿Esta seguro de eliminar este registro?',
				ok:{
					label: 'Eliminar',
					outline: true
				},
				cancel: {
					label: 'Cancelar',
				}
			}).onOk(async () => {
				try {
					loading.value = true
					await modelService.api({ url: `${props.typeUser}/${id}`, method: 'DELETE' })
					loading.value = false
					getUsers()
					Notify.create({
						message: 'Registro eliminado exitosamente',
						color: 'positive'
					})
				} catch (error) {
					loading.value = false
					Notify.create({
						message: 'No se pudo eliminar el registro',
						color: 'negative'
					})
				}
			})

		}


		watch(() => props.typeUser, (v) => getUsers(), { immediate: true })
		watch(() => showAdd.value, (v) => {
			if(!v) {
				selectedId.value = null
			}
		}, { immediate: true })

		return {
			columns,
			data,
			role,
			showAdd,
			loading,
			selectedId,
			getUsers,
			translate,
			destroy,
			handleShow
		}
	}
}
</script>