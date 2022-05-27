<template>
	<div>
		<form-validate @submit="onSubmit" v-slot="{ meta, resetForm }">
			<ul class="nav nav-pills mb-md-4 justify-content-center">
				<li class="nav-item" v-for="step in steps" :key="step.key">
					<a
						class="nav-link p-2"
						:class="[
							{ active: currentStep == step.number },
							{ disabled: !step.valid && currentStep != step.number },
						]"
						href="#"
						@click.prevent="meta.valid ? (currentStep = step.number) : ''"
					>
						<i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i>
						{{ step.title }}
					</a>
				</li>
			</ul>
			<template v-if="currentStep == 1">
				<div v-if="ROLE == 'business'" class="row border rounded border-light px-4 py-2 mb-2">
                    <div class="col">
						<base-field name="installation_id" label="Instalación">
							<field-validate
								as="select"
								class="form-control"
								name="installation_id"
								rules="required"
								label="instalación"
								v-model="model.installation_id"
							>
								<option
									v-for="installation in installations"
									:key="installation.key"
									:value="installation.id"
                                    class="text-uppercase"
								>
									#{{installation.id}} - {{ installation.name }}
								</option>
							</field-validate>
						</base-field>
					</div>
                </div>
				<div class="row border rounded border-light px-4 py-2">
					<div class="col-lg-3">
						<base-field name="is_residue" label="Tipo">
							<select
								name=""
								id=""
								v-model="model.is_residue"
								class="form-control"
                                :disabled="residue != null"
							>
								<option value="true" selected>Residuo ADR</option>
								<option value="false">Material</option>
							</select>
						</base-field>
					</div>
					<div class="col-lg-3">
						<base-field name="name" label="Nombre">
							<field-validate
								type="text"
								class="form-control"
								name="name"
								rules="required"
								label="Nombre"
								v-model="model.name"
							/>
						</base-field>
					</div>
					<div class="col-lg-3">
						<base-field name="equipment_type_id" label="Depósito">
							<field-validate
								as="select"
								class="form-control"
								name="equipment_type_id"
								rules="required"
								label="tipo de equipmento"
								v-model="model.equipment_type_id"
							>
								<option
									v-for="equipment in equipments"
									:key="equipment.key"
									:value="equipment.id"
								>
									{{ equipment.name }}
								</option>
							</field-validate>
						</base-field>
					</div>
					<div class="col-lg-3">
						<base-field name="material" label="UN">
							<div v-if="model.material != null">
								<span
									class="
										mr-md-4
										text-uppercase text-text-truncate
										d-inline-block
									"
									>{{ material.un_code }} -
									{{ material.denomination_name }}</span
								>
								<base-button
									@click="model.material = null"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<div v-else>
								<field-validate
									name="material"
									label="Material adr"
									rules="required"
									v-slot="{ field }"
									v-model="model.material"
								>
									<Multiselect
										:searchable="true"
										v-bind="field"
										:min-chars="2"
										:delay="1000"
										:required="true"
										:options="fetchItems"
										@select="material = $event"
									>
									</Multiselect>
								</field-validate>
							</div>
						</base-field>
					</div>
					<div class="col-lg-12">
						<div class="row">
                            <div class="col-md-3">
                                <base-field name="operation_type" label="Tipo de operación">
                                    <field-validate
                                        as="select"
                                        class="form-control"
                                        name="operation_type_id"
                                        rules="required"
                                        label="tipo de operación"
                                        v-model="model.operation_type_id"
                                    >
                                        <option v-for="(operation, idx) in operations" :key="idx" :value="operation.id">{{operation.code}} - {{operation.name}}</option>
                                    </field-validate>
                                </base-field>
                            </div>
							<div class="col-lg-3">
								<base-switch
									v-model="model.is_dangerous"
                                    label="Contaminante del medioambiente"
									:value="model.is_dangerous != 0 ? true : false"
								></base-switch>
							</div>
							<div class="col-lg-5" v-if="model.is_dangerous">
								<base-field
									apiName="file_document"
									name="file_document"
									label="Ficha de datos de seguridad"
								>
									<div v-if="model.file_document.file.length >= 1">
										<span class="mr-md-4">{{
											model.file_document.file[0].name
										}}</span>
										<base-button
											@click="model.file_document.file = []"
											size="sm"
											type="default"
											:outline="true"
											><i class="fa-solid fa-pencil"></i
										></base-button>
									</div>
									<field-validate
										v-else
										type="file"
										class="form-control"
										name="file_document"
										rules="required"
										label="Ficha de datos de seguridad"
										v-model="model.file_document.file"
									/>
								</base-field>
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
						<base-field name="buy" label="Compra" >
							<field-validate
								type="number"
								class="form-control"
								name="buy"
								rules="required"
								label="Cantidad de compra"
								v-model="model.buy"
							/>
						</base-field>
					</div>
                    <div class="col-lg-3" v-else-if="model.operation_type_id == 5">
						<base-field name="transported" label="Transportada">
							<field-validate
								type="number"
								class="form-control"
								name="transported"
								rules="required"
								label="Cantidad transportada"
								v-model="model.transported"
							/>
						</base-field>
					</div>
					<div class="col-lg-3" v-else>
						<base-field name="sell" label="Venta" >
							<field-validate
								type="number"
								class="form-control"
								name="sell"
								rules="required"
								label="Cantidad de venta"
								v-model="model.sell"
							/>
						</base-field>
					</div>
                    <div class="col-lg-3">
						<base-field name="quantity" label="Cantidad">
							<field-validate
								type="number"
								class="form-control"
								name="quantity"
								label="Cantidad"
								v-model="model.quantity"
							/>
						</base-field>
					</div>
				</div>
			</template>

			<div class="mt-4 float-md-right">
				<base-button type="default" @click="prevStep()" v-if="currentStep !== 1"
					>Anterior</base-button
				>
				<base-button type="default" nativeType="submit" v-if="currentStep !== 2"
					>Siguiente</base-button
				>
				<base-button type="default" nativeType="submit" v-if="currentStep === 2"
					>Enviar</base-button
				>
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
	import utils from "@/mixins/utils-mixin";
	import dataService from "@/store/services/data-service";
	import Multiselect from "@vueform/multiselect";
	import service from "@/store/services/model-service";

	import _ from "lodash";
    import { mapGetters } from 'vuex';

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
				default: 'false',
			},
            installations: {
                type: Object,
                required: false,
                default: null
            }
		},
		components: { Multiselect },
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
					installation_id: this.installation_id,
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
                        base64: ""
                    },
                    operation_type_id: null
				},
				material: {},
				equipments: {},
                operations: {}
			};
		},
		mounted() {
			this.loadEquipments();
            if (this.ROLE != 'business') {
                this.loadOperations();
            }
            if (this.residue == 'true' || this.residue == 'false') {
                this.model.is_residue = this.residue
            }
		},
        computed: {
            ...mapGetters(['CLEAN_DATA', 'ROLE'])
        },
		methods: {
			prevStep() {
				if (this.currentStep == 0 || this.currentStep == 1) {
					return;
				}
				this.currentStep--;
			},
			async onSubmit(values, { resetForm }) {
				if (this.currentStep === 1) {
					if (this.model.is_residue == null) {
						return this.$toast.error("Selecciona el tipo de material");
					}
					this.model.adr_material_id = this.material.id;
				}
				if (this.currentStep === 2) {
					if (this.model.is_residue === "true") {
						this.model.is_residue = true;
					} else {
						this.model.is_residue = false;
					}

					if (this.model.unit == null) {
						return this.$toast.error("Selecciona el tipo de unidad");
					}

                    if (this.model.is_dangerous) {
                        this.model.file_document.base64 = await this.toBase64(this.model.file_document.file[0])
                    }
					try {
                        console.log(this.model);
                        const data = this.CLEAN_DATA(this.model, ['material'])
						await service.store("material", data);
						resetForm();
						this.$emit("close");
						this.$emit("reload");
					} catch (error) {
						console.log(error);
					}
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
            async loadOperations(id = null) {
				try {
                    let inst_id = null;
                    if (id != null) {
                        inst_id = id;
                    }else{
                        inst_id = this.installation_id
                    }

					const resp = await service.instOperations(inst_id);
					this.operations = resp.data.data;
                    if (this.operations.length < 1) {
                        this.$swal('Esta instalación no tiene operaciones', 'Esta instalación no tienen ningun tipo de operacion registrada. Es necesario para agregar un material', 'warning')
                    }
				} catch (err) {
					console.log(err.response);
					this.$toast.error("No se pudieron cargar las operaciones");
				}
			},
			async fetchItems(search) {
				const res = await dataService.getAdrMaterials(`un_code=${search}`);
				const data = res.data.data;
				let options = _.map(data, (material) => {
					return {
						value: material,
						label: `${material.un_code} - ${material.denomination_name}`,
					};
				});
				return options;
			},
			handleClose(reset) {
				reset();
				this.$emit("close");
			},
		},
        watch: {
            'model.installation_id': function (newVal){
                console.log(newVal);
                if (this.ROLE == 'business' && newVal >= 1) {
                    this.loadOperations(newVal)
                }
            } 
        }
	};
</script>