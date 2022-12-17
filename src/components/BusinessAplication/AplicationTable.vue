<template>
	<div class="custom-table">
		<table-header :title="typeAplication">
			<q-btn v-if="role == 'business'" color="primary" label="Agregar" @click="showAdd = true" />
		</table-header>
		<q-table :loading="loading" table-class="table"
			table-header-class="thead-light" :rows="data" :columns="columns" row-key="id">

			<!-- <template v-slot:top>
			</template> -->
			
			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn-dropdown class="custom-drop" flat rounded icon="fa-solid fa-ellipsis-vertical"
						color="grey-7">
						<q-list bordered>
							<!-- <q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
								@click="toDelete(props.row.id)" v-if="role == 'business'">
								<q-item-section>
									<q-item-label>Eliminar</q-item-label>
								</q-item-section>
							</q-item> -->
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
		</q-table>

		<q-dialog v-model="showAdd" persistent>
			<q-card style="min-width: 500px;">
				<q-card-section class="q-pa-lg">
					<aplication-form @saved="getAplications()" @cancel="showAdd = false" :typeAplication="typeAplication"  />
				</q-card-section>
			</q-card>
		</q-dialog>
	</div>
</template>
<script>
import { ref } from '@vue/reactivity'
import modelService from '../../store/services/model-service'
import TableHeader from '../Utils/TableHeader.vue'
import { computed, watch } from '@vue/runtime-core'
import AplicationForm from './AplicationForm.vue'
import { useStore } from 'vuex'
import { moment } from '../../boot/plugins'

export default {
	components: { TableHeader, AplicationForm },
	props: {
		typeAplication: {
			type: String,
			default: 'formation'
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
				field: row => row?.name,
			},
			{
				name: 'type',
				label: 'Tipo',
				align: 'left',
				field: row => row.type,
			},
			{
				name: 'business',
				label: 'Empresa',
				align: 'left',
				field: row => row.business?.user?.full_name,
			},
			{
				name: 'installation',
				label: 'Instalación',
				align: 'left',
				field: row => row.installation?.name,
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'scheduled_date',
				label: 'Fecha',
				align: 'left',
				// field: row => row?.scheduled_date,
				field: row => moment(row?.scheduled_date).format('DD/MM/YYYY HH:mm a'),
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'actions',
			},
		]

		async function getAplications(){
			try {
				showAdd.value = false
				loading.value = true
				const wheres = JSON.stringify({
					type: props.typeAplication
				})

				const includes = JSON.stringify([
					'installation',
					'business.user'
				])
				const res = await modelService.api({ url: `business-aplication?wheres=${wheres}&includes=${includes}` })
				console.log(res);
				data.value = res?.data?.data ?? []
				loading.value = false
			} catch (error) {
				
			}
		}
		
		watch(() => props.typeAplication, (v) => getAplications(), {immediate:true})

		return {
			columns,
			data,
			loading,
			showAdd,
			role,
			getAplications
		}
	}
}
</script>