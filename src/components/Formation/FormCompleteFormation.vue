<template>
	<div>
		<div class="row border rounded border-light px-3 py-2 mx-0" v-if="isComplete">
			<div class="col-lg-6">
				<base-field name="name" label="Nombre">
					<input type="text" class="form-control text-uppercase" :disabled="true"
						:value="training?.formation?.name" />
				</base-field>
			</div>
			<div class="col-lg-6">
				<base-field name="formation_type_id" label="Modalidad">
					<input type="text" class="form-control text-uppercase" :disabled="true"
						:value="training?.formation?.type?.name" />
				</base-field>
			</div>
			<div class="col-lg-6">
				<base-field name="duration" label="Duración">
					<input type="text" class="form-control text-uppercase" :disabled="true"
						:value="training?.formation?.duration" />
				</base-field>
			</div>
			<div class="col-lg-6" v-if="!$store.state.is_auditor">
				<base-field name="auditor_id" label="Responsable">
					<input type="text" class="form-control text-uppercase" :disabled="true"
						:value="training?.formation?.facilitable.user.full_name" />
				</base-field>
			</div>
			<div class="col-lg-12">
				<base-field name="content" label="Contenido">
					<textarea cols="20" :disabled="true" rows="5" class="form-control"
						:value="training?.formation?.content"></textarea>
				</base-field>
			</div>
		</div>

		<form-validate @submit="onSubmit" v-slot="{ resetForm }">
			<div class="border rounded border-light px-3 py-2 my-2" style="overflow-x: scroll">
				<h4 v-if="isComplete">Listado de asistentes</h4>
				<h4 v-else-if="reAssign">Listado de empleados</h4>

				<div class="d-flex mx-0 align-items-end mb-4">
					<base-field class="mt-3" label="Buscar" customClases="mb-0">
						<input class="form-control" style="min-width:300px" placeholder="Buscar" v-model="filter" />
					</base-field>
					<!-- <base-field class="mt-3" label="Buscar" customClases="mb-0">
					</base-field> -->
				</div>

				<table class="table table-sm table-hover table-bordered">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>DNI</th>
							<th>CARGO</th>
							<th>ULTIMA FORMACIÓN</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="employees_rows?.length < 1">
							<td colspan="4">No hay empleados disponibles</td>
						</tr>
						<tr v-for="employee in employees_rows" :key="employee.id">
							<td>
								<div class="form-check">
									<input v-if="!isComplete && (toComplete || employee.canCheck)"
										class="form-check-input" type="checkbox" :value="employee.id"
										v-model="employees_ids" />
									<label class="form-check-label" for="flexCheckDefault">
										{{ employee.full_name }}
									</label>
								</div>
							</td>
							<td>
								{{ employee.dni }}
							</td>
							<td>
								{{ employee.position }}
							</td>
							<td>
								{{
								employee.last_formation == null
								? "SIN FORMACIÓN"
								: employee.last_formation.date_formatted
								}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="mt-4 float-md-right">
				<base-button type="default" nativeType="submit" v-if="!isComplete">{{ reAssign ? 'Asignar' : 'Aceptar'}}
				</base-button>
				<base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>

<script>
import service from "@/store/services/model-service";
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { uniqBy } from 'lodash';

export default {
	props: {
		training_id: null,
		installation_id: null,
		isComplete: {
			type: Boolean || Number,
			default: false,
		},
		reAssign: {
			type: Boolean,
			default: false
		},
		toComplete: {
			type: Boolean || Number,
			default: false
		}
	},
	emits: ['close', 'reload'],
	setup(props, { emit }) {
		const employees_ids = ref([])
		const installation_employees = ref([])
		const training = ref(null)
		const filter = ref(null)
		const filter_date = ref(null)
		const training_employees_ids = computed(() => training.value?.employees ? training.value.employees.map(e => e.id) : [])
		const employees = computed(() => uniqBy([...training.value?.employees, ...installation_employees.value], 'id').map(e => {
			e.canCheck = true;
			return e
		}))

		const employees_rows = computed(() => {
            return employees.value?.filter((e) => {
                return filter.value ? e.full_name.toLowerCase().includes(filter.value) : e;
            }) ?? []
        })

		async function onSubmit(values, { resetForm }) {
			try {
				await service.update("training", props.training_id, {
					employees_ids: employees_ids.value,
					status: props.reAssign ? 0 : 1,
				});

				resetForm();
				emit("close");
				emit("reload");
			} catch (error) {
				console.log(error);
			}
		}

		async function loadTraining() {
			try {
				const resp = await service.show(
					"training",
					props.training_id,
					"includes[]=employees&includes[]=formation.facilitable.user&includes[]=formation.type"
				);
				training.value = resp.data.data;
			} catch (err) {
				console.log(err);
			}
		}

		async function loadEmployees() {
			try {
				const resp = await service.api({ url: 'employees?installation_id=' + props.installation_id });
				installation_employees.value = resp.data.data;
			} catch (err) {
				console.log(err);
			}
		}

		function handleClose(reset) {
			reset();
			emit("close");
		}

		loadTraining();
		if (props.reAssign) {
			loadEmployees()
		}

		watch(() => training_employees_ids.value, (v) => {
			employees_ids.value = v;
		}, { immediate: true })

		return {
			employees_ids,
			training,
			employees,
			filter,
			employees_rows,

			loadEmployees,
			loadTraining,
			onSubmit,
			handleClose
		}
	}
};
</script>