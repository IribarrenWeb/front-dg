<template>
	<div class="row border border-light rounded p-2">
		<div class="col-12">
			<h4>Datos generales representante</h4>
		</div>
		<div class="col-lg-4">
			<base-field name="property_name" label="Nombre representante">
				<field-validate
					type="text"
					class="form-control"
					name="property_name"
					rules=""
					label="nombre"
					@input="$emit('update:property_name', $event.target.value)"
					:value="property_name"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="property_last_name" label="Apellido representante">
				<field-validate
					type="text"
					class="form-control"
					name="property_last_name"
					rules=""
					label="apellido"
					@input="$emit('update:property_last_name', $event.target.value)"
					:value="property_last_name"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="property_dni" label="DNI">
				<field-validate
					type="text"
					class="form-control text-uppercase"
					name="property_dni"
					rules="min:9|max:9"
					label="dni"
					@input="$emit('update:property_dni', $event.target.value)"
					:value="property_dni"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="property_phone" label="Móvil">
				<field-validate
					type="number"
					class="form-control"
					name="property_phone"
					rules="min:5|max:15"
					label="móvil"
					@input="$emit('update:property_phone', $event.target.value)"
					:value="property_phone"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="property_email" label="Email">
				<field-validate
					type="email"
					class="form-control"
					name="property_email"
					rules="email"
					label="email de la empresa"
					@input="$emit('update:property_email', $event.target.value)"
					:value="property_email"
				/>
			</base-field>
		</div>
	</div>
</template>
<script>
	import { computed } from "@vue/runtime-core";
	import { useStore } from "vuex";
	export default {
		inheritAttrs: true,
		props: {
			property_name: {
				type: String,
			},
			property_last_name: {
				type: String,
			},
			property_dni: {
				type: String,
			},
			property_phone: {
				type: String,
			},
			property_email: {
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