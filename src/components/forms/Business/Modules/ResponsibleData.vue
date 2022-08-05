<template>
	<div class="row border border-light rounded p-2">
		<div class="col-12">
			<h4>Datos generales (responsable ADR)</h4>
		</div>
		<div class="col-lg-4">
			<base-field name="responsible_name" label="Nombre responsable">
				<field-validate
					type="text"
					class="form-control"
					name="responsible_name"
					rules=""
					label="nombre responsable"
					@input="$emit('update:responsible_name', $event.target.value)"
					:value="responsible_name"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="responsible_last_name" label="Apellido responsable">
				<field-validate
					type="text"
					class="form-control"
					name="responsible_last_name"
					rules=""
					label="apellido responsable"
					@input="$emit('update:responsible_last_name', $event.target.value)"
					:value="responsible_last_name"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="responsible_dni" label="DNI">
				<field-validate
					type="text"
					class="form-control text-uppercase"
					name="responsible_dni"
					rules="min:9|max:9"
					label="dni responsable"
					@input="$emit('update:responsible_dni', $event.target.value)"
					:value="responsible_dni"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="responsible_phone_number" label="Móvil">
				<field-validate
					type="number"
					class="form-control"
					name="responsible_phone_number"
					rules="min:5|max:15"
					label="móvil"
					@input="$emit('update:responsible_phone_number', $event.target.value)"
					:value="responsible_phone_number"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="responsible_email" label="Email">
				<field-validate
					type="email"
					class="form-control"
					name="responsible_email"
					rules="email"
					label="email de la empresa"
					@input="$emit('update:responsible_email', $event.target.value)"
					:value="responsible_email"
				/>
			</base-field>
		</div>
	</div>
</template>
<script>
	import { computed } from "@vue/runtime-core";
	import { useStore } from "vuex";
	export default {
		inheritAttrs:true,
		props: {
			responsible_name: {
				type: String,
			},
			responsible_last_name: {
				type: String,
			},
			responsible_dni: {
				type: String,
			},
			responsible_phone_number: {
				type: String,
			},
			responsible_email: {
				type: String,
			},
		},
		setup() {
			const store = useStore();
			const role = computed(() => {
				return store.getters.ROLE;
			});

			return {
				role,
			};
		},
	};
</script>