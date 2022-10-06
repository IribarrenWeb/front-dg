<template>
	<div class="row border border-light rounded p-2">
		<div class="col-12">
			<h4>Datos bancarios</h4>
		</div>
		<div class="col-lg-4">
			<base-field name="holder_name" label="Nombre del titular">
				<field-validate
					type="text"
					class="form-control"
					name="holder_name"
					label="nombre"
					@input="$emit('update:holder_name', $event.target.value)"
					:value="holder_name"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="bank_code" label="BIC/SWIFT">
				<field-validate
					type="text"
					class="form-control text-uppercase"
					name="bank_code"
					rules="min:11|max:11"
					label="BIC/SWIFT"
					@input="$emit('update:bank_code', $event.target.value)"
					:value="bank_code"
				/>
			</base-field>
		</div>
		<div class="col-lg-4">
			<base-field name="iban_number" label="IBAN">
				<field-validate
					type="text"
					class="form-control"
					name="iban_number"
					rules="min:24|max:24|alpha_num"
					label="numero iban"
					@input="$emit('update:iban_number', $event.target.value)"
					:value="iban_number"
				/>
			</base-field>
		</div>
	</div>

</template>
<script>
	import { computed } from "@vue/runtime-core";
	import { useStore } from "vuex";
	export default {
		props: {
			holder_name: {
				type: String,
			},
			bank_code: {
				type: String,
			},
			iban_number: {
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