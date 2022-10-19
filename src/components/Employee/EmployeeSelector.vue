<template>
	<modal v-if="show" :show="show" @update:show="$emit('update:show',$event)" action="seleccionar"
		@close="$emit('update:show',false)" modalClasses="modal-xxl" model="responsable">

		<base-table :columns="columns" :data="employees">
			<template #item="{column,item}">
				<div v-if="column.field == 'actions'" class="d-flex">
					<base-button size="sm" @click="$emit('selected',item),$emit('update:show',false)"> SELECCIONAR</base-button>
				</div>
				<div v-else>
					{{item[column.field]}}
				</div>
			</template>
		</base-table>
		<!-- <form-employee @close="show = false, employee_id = null" @reload="index(), this.$emit('reload_dash')"
			:employee_id="employee_id" :driver="driver" :installation_id="installation_id"></form-employee> -->
	</modal>
</template>
<script>
import _ from "lodash";
import { ref } from '@vue/reactivity';
import modelService from "../../store/services/model-service";
import BaseTable from '../core_components/BaseTable.vue';

export default {
	components: { BaseTable },
	props: {
		show: {
			type: Boolean,
			default: false
		},
		installation_id: {
			type: Number,
			default: null
		},
		business_id: {
			type: Number,
		}
	},
	setup(props) {
		const employees = ref([])
		const columns = ref([
			{
				title: 'Nombre',
				field: 'full_name'
			},
			{
				title: 'DNI',
				field: 'dni'
			},
			{
				title: 'Cargo',
				field: 'position'
			},
			{
				title: '',
				field: 'actions'
			}
		])
		const employee_selected = ref(null)

		async function getEmployees() 
		{
			let url = 'business/responsibles/'+props.business_id
			if (props.installation_id) {
				url += '?installation_id='+props.installation_id
			}
			const res = await modelService.api({url});
			employees.value = res?.data?.data ?? [];
		}

		getEmployees()
		return {
			employees,
			employee_selected,
			columns
		}
	}
};
</script>
