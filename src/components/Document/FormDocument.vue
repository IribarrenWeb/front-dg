<template>
	<div>
		<form-validate @submit="onSubmit" v-slot="{ resetForm }">
			<div class="row border rounded border-light px-4 py-2">
				<div class="col-lg-6">
					<base-field name="name" label="Nombre">
						<field-validate
							type="text"
							class="form-control text-uppercase"
							name="name"
							rules="required"
							label="name"
							v-model="model.name"
						/>
					</base-field>
				</div>
				<div class="col-lg-6">
					<base-field name="file" label="Documento">
						<field-validate
							class="form-control"
							type="file"
							name="file"
							rules="required"
							:validateOnInput="true"
							label="documentacion"
							v-model="model.file"
						/>
					</base-field>
				</div>
				<div class="col-lg-6" v-if="ROLE && ROLE != 'business'">
					<base-field name="admin_document_type_id" label="Tipo de documento">
						<select-filter @updated="model.admin_document_type_id = $event" :options="types" label="Selecciona un tipo..." placeholder=""/>
						<field-validate v-model="model.admin_document_type_id" label="tipo de documento" name="admin_document_type_id" rules="required" v-show="false"/>
					</base-field>
				</div>
				<div class="col-lg-6" v-if="model.admin_document_type_id == 2 && ROLE != 'business'">
					<base-field name="business_id" label="Empresa">
						<business-filter
							v-model:clear="clear"
							@updated="model.business_id = $event"
						/>
						<field-validate v-model="model.business_id" rules="required" name="business_id" v-show="false"/>
					</base-field>
				</div>
			</div>

			<div class="mt-4 float-md-right">
				<base-button type="default" nativeType="submit">Aceptar</base-button>
				<base-button
					type="default"
					:outline="true"
					class="ml-auto"
					@click="handleClose(resetForm)"
					>Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
	import service from "../../store/services/model-service";
	import BusinessFilter from '../filters/BusinessFilter.vue';
	import SelectFilter from '../filters/SelectFilter.vue';

	export default {
	components: { SelectFilter, BusinessFilter },
        name: "form-document",
		data() {
			return {
				model: {
					name: null,
					file: null,
					admin_document_type_id: null,
					business_id: null
				},
				loader: false,
				types: [],
			};
		},
		mounted() {
			console.log(this.update);
			if (this.ROLE == 'business') {
				this.model.admin_document_type_id = 2
				console.log(this.$store.state.profile.me.business.id);
				this.model.business_id = this.$store.state.profile.me.business.id
			}
			this.getTypes();
		},
		methods: {
			async onSubmit(values, { resetForm }) {
				try {
					const data = new FormData;

                    data.append('name', this.model.name);
                    data.append('file', this.model.file[0]);
                    data.append('admin_document_type_id', this.model.admin_document_type_id);

					if (parseInt(this.model.admin_document_type_id) == 2) {
						data.append('business_id', this.model.business_id);
					}
                    await service.store("documents", data,true);
                    this.$toast.success("Documento registrado");
                    resetForm();
                    this.$emit("close");

					this.$emit("reload");
				} catch (error) {
					console.log(error);
				}
			},
			async getTypes(){
				try {
					const res = await service.api({url:'doc-types'})
					this.types = res.data.data.map((t) => {
						return {
							label: t.name,
							value: t.id
						}
					})
				} catch (err) {
					console.log(err);
				}
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
		},
		watch: {
			ROLE(v) {
				if (v == 'business') {
					this.model.admin_document_type_id = 2
					this.model.business_id = this.$store.profile.me.business.id
				}
			}
		},
		computed: {
			...mapGetters(['ROLE'])
		}
	};
</script>