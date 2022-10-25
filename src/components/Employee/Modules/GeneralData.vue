<template>
	<div>
		<div :class="classes" class="row">
			<div class="col-12 border-bottom border-light mb-md-3">
				<h4>Datos principales</h4>
			</div>
			<div class="col-lg-6 col-lg-4">
				<base-field :apiName="prevName +'name'" :name="prevName + 'name'" label="Nombre" :required="true">
					<field-validate
						:disabled="noEdit"
						type="text"
						class="form-control"
						:name="prevName + 'name'"
						rules="required|alpha_spaces"
						label="Nombre"
						@input="$emit('update:name', $event.target.value)"
						:value="name"
					/>
				</base-field>
			</div>

			<div class="col-lg-6 col-lg-4">
				<base-field
					:apiName="prevName +'last_name'"
					:name="prevName + 'last_name'"
					label="Apellido"
					:required="true"
				>
					<field-validate
						:disabled="noEdit"
						type="text"
						class="form-control"
						:name="prevName + 'last_name'"
						rules="required|alpha_spaces"
						label="apellido"
						@input="$emit('update:last_name', $event.target.value)"
						:value="last_name"
					/>
				</base-field>
			</div>

			<div class="col-lg-6 col-lg-4">
				<base-field :apiName="prevName +'dni'" :name="prevName + 'dni'" label="DNI">
					<field-validate
						:disabled="noEdit"
						type="text"
						class="form-control"
						:name="prevName + 'dni'"
						:rules="{ 'required': false, 'alpha_num': true ,'min':9,'max':9 }"
						label="dni"
						@input="$emit('update:dni', $event.target.value)"
						:value="dni"
					/>
				</base-field>
			</div>
			<div class="col-lg-6 col-lg-4">
				<base-field :apiName="prevName +'email'" :name="prevName + 'email'" label="Email" :required="isResponsible">
					<field-validate
						:disabled="noEdit"
						type="text"
						class="form-control"
						:name="prevName + 'email'"
						:rules="{ 'required': isResponsible, 'email': true}"
						label="email"
						@input="$emit('update:email', $event.target.value)"
						:value="email"
					/>
				</base-field>
			</div>

			<div class="col-lg-6 col-lg-4">
				<base-field :apiName="prevName +'position'" :name="prevName + 'position'" label="Cargo">
					<field-validate
						:disabled="noEdit"
						type="text"
						class="form-control"
						:name="prevName + 'position'"
						rules="alpha_spaces"
						label="cargo"
						@input="$emit('update:position', $event.target.value)"
						:value="position"
					/>
				</base-field>
			</div>

			<div class="col-lg-6 col-lg-4">
				<base-field :apiName="prevName +'phone_number'" label="Movil" :name="prevName + 'phone_number'">
					<field-validate
						:disabled="noEdit"
						type="number"
						class="form-control"
						:name="prevName + 'phone_number'"
						rules="min:5|max:15"
						label="movil"
						@input="$emit('update:phone_number', $event.target.value)"
						:value="phone_number"
					/>
				</base-field>
			</div>
		</div>

	</div>
</template>
<script>
	import { computed } from "@vue/runtime-core";
	import { useStore } from "vuex";
	export default {
		props: {
			last_name: {
				type: String,
			},
			name: {
				type: String,
			},
			phone_number: {
				type: String,
			},
			position: {
				type: String,
			},
			dni: {
				type: String,
			},
			email: {
				type: String,
			},
			form_id: {
				type: Number,
				default: null,
			},
			custom_key: {
				type: String,
				default: null
			},
			onlyForm: {
				type: Boolean,
				default: false,
			},
			isResponsible: {
				type: Boolean,
				default: false
			},
			noEdit: {
				type: Boolean,
				default: false
			}
		},
		setup(props) {
			const store = useStore();
			const role = computed(() => {
				return store.getters.ROLE;
			});
			const prevName = computed(() => {
				let prev = ''
				if (props.form_id) {
					prev += 'installations['+props.form_id+'].'
				}
				if (props.custom_key) {
					prev += props.custom_key + '.'
				}
				return prev;
			})
			const classes = computed(() => {
				const styles = "border rounded border-light px-4 py-2";
				return !props.onlyForm ? styles : 'm-0';
			});

			return {
				role,
				classes,
				prevName
			};
		},
	};
</script>