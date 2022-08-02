<template>
	<div>
		<table class="table table-sm table-hover">
			<thead>
				<tr>
					<th>Empresa</th>
					<th>Instalación</th>
					<th>Fecha programada</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="data?.length < 1">
					<td colspan="4">No hay auditorias disponibles para iniciar</td>
				</tr>
				<tr v-for="audit in data" :key="audit.id">
					<td>
						<div class="custom-control custom-radio" :key="audit.id">
							<input
                                v-model="id"
								type="radio"
                                :value="audit.id"
								id="audit_id"
								class="custom-control-input"
							/>
							<label class="custom-control-label" for="audit_id">{{
								audit.installation.company.user.full_name
							}}</label>
						</div>
					</td>
					<td>
						{{ audit.installation.name }}
					</td>
					<td>
						{{ audit.scheduled_date }}
					</td>
				</tr>
			</tbody>
		</table>
        <div class="d-flex justify-content-end mt-1">
            <base-button :disabled="!id" @click="toInit">Iniciar</base-button>
            <base-button @click="$emit('cancel')">Cancelar</base-button>
        </div>
	</div>
</template>

<script>
	import { ref } from "@vue/reactivity";
    import { useRouter } from "vue-router";
	
    export default {
		props: ["data"],
        emits:['cancel'],
		setup() {
			const id = ref(null);
            const route = useRouter()
			function toInit() {
                const link = `/audit-init/${id.value}`;
                route.push(link)
            }

			return {
				toInit,
				id,
			};
		},
	};
</script>