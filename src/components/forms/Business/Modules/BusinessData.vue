<template>
	<div class="row border border-light rounded p-2">
		<div class="col-12">
			<h4>Datos de empresa</h4>
		</div>
		<div class="col-lg-4">
			<base-field name="name" label="Nombre" :required="true">
				<field-validate
					type="text"
					class="form-control"
					name="name"
					rules="required"
					label="nombre empresa"
					@input="$emit('update:name', $event.target.value)"
					:value="name"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="email" :required="true" label="Email">
				<field-validate
					type="text"
					class="form-control"
					name="email"
					rules="required|email"
					label="email"
					@input="$emit('update:email', $event.target.value)"
					:value="email"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="business_nif" label="CIF/NIF">
				<field-validate
					type="text"
					class="form-control text-uppercase"
					name="business_nif"
					rules="alpha_num"
					label="CIF/NIF"
					@input="$emit('update:business_nif', $event.target.value)"
					:value="business_nif"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="business_phone" label="Fijo">
				<field-validate
					type="number"
					class="form-control"
					name="business_phone"
					rules="min:5|max:15|numeric"
					label="Fijo"
					@input="$emit('update:business_phone', $event.target.value)"
					:value="business_phone"
				/>
			</base-field>
		</div>

		<slot></slot>
	</div>
</template>
<script>
	import { computed } from "@vue/runtime-core";
	import { useStore } from "vuex";
	export default {
		inheritAttrs: true,
		props: {
			name: {
				type: String,
			},
			email: {
				type: String,
			},
			business_nif: {
				type: String,
			},
			business_phone: {
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