<template>
	<div>
		<form-validate @submit="onSubmit" v-slot="{ meta, resetForm }">
			<ul class="nav nav-pills mb-md-4 justify-content-center">
				<li class="nav-item" v-for="step in steps" :key="step.key">
					<a class="nav-link p-2" :class="[
						{ active: currentStep == step.number },
						{ disabled: !step.valid && currentStep != step.number },
					]" href="#" @click.prevent="meta.valid ? (currentStep = step.number) : ''">
						<i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i>
						{{ step.title }}
					</a>
				</li>
			</ul>
			<template v-if="currentStep == 1">
				<installation-select v-model="model.installation_id"></installation-select>
				<div class="row border rounded border-light px-4 py-2">
					<div class="col-lg-3">
						<base-field name="is_residue" label="Tipo">
							<select v-model="model_is_residue" class="form-control" :disabled="residue != null">
								<option value="true" selected>Residuo ADR</option>
								<option value="false">Mercancia ADR</option>
							</select>
						</base-field>
					</div>
					<div class="col-lg-3">
						<base-field name="name" label="Nombre">
							<field-validate type="text" class="form-control" name="name" rules="required" label="Nombre"
								v-model="model.name" />
						</base-field>
					</div>
					<div class="col-lg-3">
						<base-field name="equipment_type_id" label="Depósito"
							v-if="(update && equipments != null) || !update">
							<field-validate as="select" class="form-control" name="equipment_type_id" rules="required"
								label="tipo de equipmento" v-model="model.equipment_type_id">
								<option v-for="equipment in equipments" :key="equipment.key" :value="equipment.id">
									{{ equipment.name }}
								</option>
							</field-validate>
						</base-field>
					</div>
					<div class="col-lg-3">
						<base-field name="material" label="UN">
							<div v-if="model_material">
								<span class="
										mr-md-4
										text-uppercase text-text-truncate
										d-inline-block
									">{{ model_material.un_code }} -
									{{ model_material.denomination_name }}</span>
								<base-button @click="resetMaterial" size="sm" type="default" :outline="true"><i
										class="fa-solid fa-pencil"></i></base-button>
							</div>
							<div v-else>
								<field-validate name="material" label="mercancia adr" rules="required">
									<async-select @selected="adr_material = $event" :materials="true">
									</async-select>
								</field-validate>
							</div>
						</base-field>
					</div>
					<div class="col-lg-12">
						<div class="row">
							<div class="col-md-3">
								<base-field name="operation_type" label="Tipo de operación"
									v-if="(update && operations != null) || !update">
									<field-validate as="select" class="form-control" name="operation_type_id"
										rules="required" label="tipo de operación" v-model="model.operation_type_id">
										<option selected>Selecciona una operación</option>
										<option v-for="(operation, idx) in operations" :key="idx" :value="operation.id">
											{{ operation.code }} - {{ operation.name }}
										</option>
									</field-validate>
								</base-field>
							</div>
							<div class="col-lg-5">
								<base-field apiName="file_document" name="file_document"
									label="Ficha de datos de seguridad">
									<div v-if="file_document">
										<span class="mr-md-4">{{
												file_document.name
										}}</span>
										<base-button @click="resetFile" size="sm" type="default" :outline="true">
											<i class="fa-solid fa-pencil"></i>
										</base-button>
									</div>
									<div v-else>
										<field-validate type="file" class="form-control mb-1" name="file_document"
											rules="required" label="Ficha de datos de seguridad"
											v-model="model.file_document.file" />
										<base-button @click="new_document = false" v-if="update && !file_document"
											size="sm" type="default" :outline="true">
											Cancelar
										</base-button>
									</div>
								</base-field>
							</div>
							<div class="col-lg-3">
								<base-switch v-model="model.is_dangerous" label="Contaminante del medioambiente"
									:value="model.is_dangerous != 0 ? true : false"></base-switch>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-if="currentStep == 2">
				<div class="row border rounded border-light px-4 py-2">
					<div class="col-lg-3">
						<base-field name="address" label="Unidad">
							<select name="" class="form-control" v-model="model.unit">
								<option value="TONELADAS">TONELADAS</option>
								<option value="KILOS">KILOS</option>
							</select>
						</base-field>
					</div>
					<div class="col-lg-3" v-if="model.operation_type_id == 4">
						<base-field name="buy" label="Compra">
							<field-validate type="number" class="form-control" name="buy" rules="required"
								label="Cantidad de compra" v-model="model.buy" />
						</base-field>
					</div>
					<div class="col-lg-3" v-else-if="model.operation_type_id == 5">
						<base-field name="transported" label="Transportada">
							<field-validate type="number" class="form-control" name="transported" rules="required"
								label="Cantidad transportada" v-model="model.transported" />
						</base-field>
					</div>
					<div class="col-lg-3" v-else>
						<base-field name="sell" label="Venta">
							<field-validate type="number" class="form-control" name="sell" rules="required"
								label="Cantidad de venta" v-model="model.sell" />
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="quantity" label="Volumen Almacenamiento">
							<field-validate type="text" class="form-control" name="quantity"
								label="volumen del Almacenamiento" v-model="model.quantity" />
						</base-field>
					</div>
				</div>
			</template>

			<div class="mt-4 float-md-right">
				<base-button type="default" @click="prevStep()" v-if="currentStep !== 1">Anterior</base-button>
				<base-button type="default" nativeType="submit" v-if="currentStep !== 2">Siguiente</base-button>
				<base-button type="default" nativeType="submit" v-if="currentStep == 2 && update && canUpdate">
					Actualizar</base-button>
				<base-button type="default" nativeType="submit" v-if="currentStep === 2 && !update">Aceptar</base-button>
				<base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
				</base-button>
			</div>
		</form-validate>
	</div>
</template>

<script>
import utils from "@/mixins/utils-mixin";
import dataService from "@/store/services/data-service";
import service from "@/store/services/model-service";

import { isEmpty, isEqual } from "lodash";
import { mapGetters } from "vuex";
import AsyncSelect from '../AsyncSelect.vue';
import InstallationSelect from '../Utils/InstallationSelect.vue';

export default {
	mixins: [utils],
	props: {
		installation_id: {
			required: true,
			default: null,
		},
		residue: {
			type: String,
			required: false,
			default: "false",
		},
		installations: {
			type: Object,
			required: false,
			default: null,
		},
		material: {
			type: Object,
			required: false,
			default: null
		}
	},
	components: { AsyncSelect, InstallationSelect },
	data() {
		return {
			steps: [
				{
					number: 1,
					title: "General",
					valid: false,
				},
				{
					number: 2,
					title: "Cantidades",
					valid: false,
				},
			],
			is_res: null,
			currentStep: 1,
			model: {
				installation_id: this.installation_id ?? null,
				adr_material_id: null,
				name: "",
				equipment_type_id: "",
				buy: "",
				sell: "",
				quantity: "",
				transported: "",
				unit: null,
				is_residue: null,
				is_dangerous: false,
				file_document: {
					file: [],
					base64: null,
					file_name: null
				},
				operation_type_id: null,
			},
			adr_material: null,
			original_material: null,
			equipments: null,
			operations: null,
			new_document: false,
			new_material: false,
			model_is_residue: null
		};
	},
	created() {
		if (this.update) {
			this.original_material = this.$functions.copy(this.material)
			this.original_material.file_document = {
				file: [],
				base64: null,
				file_name: null
			};
			this.original_material.adr_material_id = this.original_material.material.id

			this.model = this.$functions.copy(this.original_material)
		}
	},
	mounted() {
		this.loadEquipments();
		if (this.ROLE != "business") {
			this.loadOperations();
		}
		if (this.residue == "true" || this.residue == "false") {
			this.model_is_residue = this.residue;
		}
	},
	computed: {
		...mapGetters(["CLEAN_DATA", "ROLE"]),
		update() {
			return this.material != null && typeof this.material.id != undefined
		},
		file_document() {
			let file = false
			if (this.update && !this.new_document) {
				if (this.model.documents != null && !isEmpty(this.model.documents)) {
					file = {
						document: this.model.documents[0],
						name: "FICHA SEGURIDAD"
					}
				}
			}
			if (!this.update && this.model.file_document.file.length >= 1) {
				file = {
					document: this.model.file_document.file,
					name: this.model.file_document.file[0].name
				}
			}
			return file;
		},
		model_material() {
			let material = false
			if (this.update && !this.new_material) {
				material = typeof this.model.material != undefined ? this.model.material : false
			}
			if (!this.update && this.adr_material != null) {
				material = this.adr_material
			}
			return material;
		},
		canUpdate() {
			return !isEqual(this.model, this.original_material)
		}
	},
	methods: {
		prevStep() {
			if (this.currentStep == 0 || this.currentStep == 1) {
				return;
			}
			this.currentStep--;
		},
		resetFile() {
			if (this.update) {
				this.new_document = true
				this.model.file_document.file = []
			} else {
				this.model.file_document.file = []
			}
		},
		resetMaterial() {
			if (this.update) {
				this.new_material = true
				this.adr_material = null
			} else {
				this.adr_material = null
			}
		},
		async onSubmit(values, { resetForm }) {
			if (this.currentStep === 1) {
				if (this.model_is_residue == null) {
					return this.$toast.error("Selecciona el tipo de material");
				} else {
					this.model.is_residue = this.model_is_residue == 'true' ? 1 : 0
				}

				if (this.adr_material != null) {
					this.model.adr_material_id = this.adr_material.id;
				}

				if (!isEmpty(this.model.file_document.file)) {
					this.model.file_document.base64 = await this.toBase64(
						this.model.file_document.file[0]
					);
					this.model.file_document.file_name = this.model.file_document.file[0].name
				}
			}
			if (this.currentStep === 2) {

				if (this.model.unit == null) {
					return this.$toast.error("Selecciona el tipo de unidad");
				}
			}

			try {
				if (this.update) {
					await this.toUpdate()
				} else if (this.currentStep === 2) {
					const data = this.$functions.cleanData(this.model, ["material"], ["is_residue"]);
					await service.store("material", data);
					resetForm();
					this.$emit("close");
					this.$emit("reload");
				}
			} catch (error) {
				console.log(error);
				return
			}

			for (let index = 0; index < this.steps.length; index++) {
				const step = this.steps[index];
				if (step.number == this.currentStep) {
					step.valid = true;
				}
			}

			if (this.currentStep != 2) {
				this.currentStep++;
			}
		},
		async loadEquipments() {
			try {
				const resp = await dataService.getEquipments();
				this.equipments = resp.data.data;
			} catch (err) {
				console.log(err.response);
				this.$toast.error("No se pudieron cargar los equipmentos");
			}
		},
		async toUpdate() {
			if (!isEqual(this.model, this.original_material)) {
				try {
					const data = this.$functions.difference(this.original_material,this.model)

					const res = await service.update('material', this.material.id, data)
					this.original_material = this.$functions.copy(res.data.data)
					this.original_material.file_document = {
						file: [],
						base64: null,
						file_name: null
					};
					this.model = this.$functions.copy(this.original_material)
					this.new_document = false
					this.new_material = false
					this.$emit("reload");
				} catch (err) {
					console.log(err);
				}
			}
		},
		async loadOperations(id = null) {
			try {
				let inst_id = null;
				if (id != null) {
					inst_id = id;
				} else {
					inst_id = this.installation_id;
				}

				const resp = await service.instOperations(inst_id);
				this.operations = resp.data.data;
				if (this.operations.length < 1) {
					this.$swal(
						"Esta instalación no tiene operaciones",
						"Esta instalación no tienen ningun tipo de operacion registrada. Es necesario para agregar un material",
						"warning"
					);
				}
			} catch (err) {
				console.log(err.response);
				this.$toast.error("No se pudieron cargar las operaciones");
			}
		},
		handleClose(reset) {
			reset();
			this.$emit("close");
		},
	},
	watch: {
		"model.installation_id": {
			handler(newVal) {
				console.log(newVal, 'keinher');
				if (this.ROLE == "business" && newVal >= 1) {
					this.loadOperations(newVal);
				}
			},
			immediate: true,
			deep: true
		}
	},
};
</script>