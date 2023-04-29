<template>
	<div class="custom-table">
		<table-header :title="typeAplication == 'formation' ? 'Formaciones' : 'Auditorías'">
			<q-btn v-if="role == 'business'" color="primary" label="Agregar" @click="showAdd = true" />
		</table-header>
		<q-table :loading="loading" table-class="table" table-header-class="thead-light" :rows="data" :columns="columns"
			row-key="id">

			<!-- <template v-slot:top>
			</template> -->

			<template v-slot:body-cell-status="props">
				<q-td :props="props">
					<q-badge class="text-capitalize" rounded :color="props.value?.color" v-if="props.value?.label"
						:label="props.value?.label" />
				</q-td>
			</template>

			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn-dropdown
						v-if="(role == 'business' && !props.row.status) || (role != 'business' && props.row.status == null)"
						class="custom-drop" flat rounded icon="fa-solid fa-ellipsis-vertical" color="grey-7">
						<q-list bordered>
							<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
								@click="handleCancel(props.row.id)" v-if="role == 'business' && !props.row.status">
								<q-item-section>
									<q-item-label>Eliminar</q-item-label>
								</q-item-section>
							</q-item>
							<q-item style="min-width: 200px;text-align: center;" clickable v-close-popup
								@click="toView(props.row.id)" v-if="role != 'business' && !props.row.status">
								<q-item-section>
									<q-item-label>Detalle</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
		</q-table>

		<q-dialog v-model="showAdd" persistent>
			<q-card style="min-width: 500px;">
				<q-card-section class="q-pa-lg">
					<aplication-form :cancel="handleCancel" :aplicationId="aplicationId" @saved="getAplications()"
						@cancel="showAdd = false" :typeAplication="typeAplication" />
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
import { Dialog, Notify } from 'quasar'

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
		const aplicationId = ref(null);
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
				// field: row => moment(row?.scheduled_date_original).format('DD/MM/YYYY HH:mm a'),
				field: row => row?.scheduled_date,
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'status',
				label: 'Estado',
				align: 'left',
				// field: row => row?.scheduled_date,
				field: row => formatStatus(row.status),
				// format: val => `${val}`,
				sortable: false
			},
			{
				name: 'actions',
			},
		]

		async function getAplications() {
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

		function formatStatus(s) {
			let status = {
				color: null,
				label: null
			}
			if (s == null) {
				status = {
					color: 'yellow-10',
					label: 'Pendiente'
				}
			} else if (s == 0) {
				status = {
					color: 'red-10',
					label: 'Rechazado'
				}
			} else {
				status = {
					color: 'green-10',
					label: 'Aceptado'
				}
			}
			return status
		}

		function handleCancel(id) {

			Dialog.create({
				title: 'Esta seguro de eliminar esta solicitud',
				ok: {
					label: 'Eliminar',
				},
				cancel: {
					outline: true,
					label: 'Cancelar'
				}
			})
				.onOk(async () => {
					await toCancel(id)
				})

		}

		async function toCancel(id) {
			try {
				loading.value = true
				await modelService.api({ url: `business-aplication/${id}`, method: 'DELETE' })

				Notify.create({
					message: 'Solicitud eliminada',
					color: 'positive'
				})
				loading.value = false
				getAplications()

			} catch (err) {
				console.log(err);
				loading.value = false
				Notify.create({
					message: 'No se pudo cancelar la solicitud',
					color: 'negative'
				})
			}
		}

		function toView(id) {
			aplicationId.value = id
			showAdd.value = true
		}

		watch(() => props.typeAplication, (v) => getAplications(), { immediate: true })

		return {
			columns,
			data,
			loading,
			showAdd,
			role,
			toView,
			aplicationId,
			toCancel,
			getAplications,
			formatStatus,
			handleCancel
		}
	}
}
</script>