<template>
	<div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
		<div class="spinner-border" role="status"></div>
	</div>
	<div v-else class="row justify-content-center px-md-2">
		<div class="col-md-10">
			<h4 class="text-uppercase">Mercancias</h4>
			<div class="row justify-content-center">
				<div class="col-md-6">
					<base-field label="TIPO DE OPERACIONES DE MERCANCÍAS PELIGROSAS">
						<div v-for="operation in operations" :key="operation.id">
							<base-checkbox :checked="operation.checked" :disabled="true">
								<b>{{ operation.name }}</b>
							</base-checkbox>
						</div>
					</base-field>
				</div>
				<div class="col-md-6">
					<base-field label="TIPO DE EQUIPOS DE TRANSPORTE">
						<div v-for="equipment in equipments" :key="equipment.id">
							<base-checkbox :checked="equipment.checked" :disabled="true">
								<b>{{ equipment.name }}</b>
							</base-checkbox>
						</div>
					</base-field>
				</div>
				<div class="col-md-12 mt-md-3">
					<h5 class="text-uppercase text-primary">
						Mercancia adr carga y descarga
					</h5>
					<h6 class="text-uppercase text-muted">
						TIPO PELIGROS Y GRUPOS DE EMBALA MERCANCÍAS ADR REVISADAS
					</h6>
					<form-validate @submit="submitMaterial">
						<div class="row">
							<div class="col-md-3">
								<base-field name="adr_class_id" label="Clase ADR">
									<field-validate as="select" class="form-control" name="adr_class_id" label="clase"
										v-model="audit_materials.adr_class_id" rules="required">
										<option selected>CLASE ADR</option>
										<option :value="idx" v-for="(adr, idx) in adr_classes" :key="idx">
											{{ adr.code }}
										</option>
									</field-validate>
								</base-field>
							</div>
							<div class="col-md-3">
								<base-field name="packing_group_id" label="GE">
									<field-validate as="select" class="form-control" name="packing_group_id" label="ge"
										v-model="audit_materials.packing_group_id" rules="required">
										<option selected>G.E.</option>
										<option :value="idx" v-for="(pack, idx) in packing_types" :key="idx">
											{{ pack.code }}
										</option>
									</field-validate>
								</base-field>
							</div>
							<div class="col-md-4">
								<base-field name="comment" label="Comentario">
									<field-validate type="text" class="form-control" name="comment" rules="required"
										label="comentario" v-model="audit_materials.comment" />
								</base-field>
							</div>
							<div class="col-md-2 d-flex justify-content-center">
								<div class="align-self-center">
									<base-button size="sm" nativeType="submit" :outline="true">
										<i class="fa fa-plus" aria-hidden="true"></i>
									</base-button>
								</div>
							</div>
						</div>
					</form-validate>
					<div class="row" v-for="(material, idx) in materials" :key="idx">
						<div class="col-md-3">
							<base-input :view="true" :modelValue="material.class.code" disabled />
						</div>
						<div class="col-md-3">
							<base-input :view="true" :modelValue="material.packing.code" disabled />
						</div>
						<div class="col-md-4">
							<base-input :view="true" :modelValue="material.comment" disabled />
						</div>
						<div class="col-md-2 d-flex justify-content-center">
							<div class="align-self-center">
								<base-button size="sm" @click="unlink(material.id)" type="danger" :outline="true">
									<i class="fa fa-minus" aria-hidden="true"></i>
								</base-button>
							</div>
						</div>
					</div>
				</div>

				<div class="col-md-12 mt-md-3">
					<h5 class="text-uppercase text-primary">
						DEPOSITOS MERCANCÍAS PELIGROSAS INSTALACIÓN
					</h5>
					<h6 class="text-uppercase text-muted">
						TIPO PELIGROS Y GRUPOS DE EMBALA MERCANCÍAS ADR REVISADAS
					</h6>
					<form-validate ref="form_dep" @submit="addMaterial($event, 'deposit')">
						<div class="row">
							<div class="col-md-11">
								<div class="row">
									<div class="col-md-2">
										<base-field name="un_code" label="UN">
											<field-validate as="select" class="form-control" name="un_code" label="un"
												rules="required" v-model="deposit.index">
												<option selected>UN</option>
												<option :value="idx" v-for="(r, idx) in audit.installation.deposits"
													:key="idx">
													{{ r.material.un_code }}
												</option>
											</field-validate>
										</base-field>
									</div>
									<div class="col-md-5">
										<base-input :view="true" :modelValue="deposit.name" label="Nombre" disabled />
									</div>
									<div class="col-md-5">
										<base-input :view="true" :modelValue="
											deposit.material != null
												? deposit.material.denomination_name
												: ``
										" label="Denominación" disabled />
									</div>
									<div class="col-md-3">
										<base-input :view="true" :modelValue="
											deposit.material != null
												? deposit.material.class.code
												: ``
										" label="Clase" disabled />
									</div>
									<div class="col-md-3">
										<base-input :view="true" :modelValue="
											deposit.material != null
												? deposit.material.packing.code
												: ``
										" label="GE" disabled />
									</div>
									<div class="col-md-3">
										<base-input :view="true" :modelValue="
											deposit.equipment != null ? deposit.equipment.name : ``
										" label="Deposito" disabled />
									</div>
									<div class="col-md-3">
										<base-field label="Volumen almacenamiento">
											<field-validate name="quantity" type="number" class="form-control"
												v-model="deposit.quantity" :disabled="deposit.quantity == null">
											</field-validate>
										</base-field>
									</div>
								</div>
							</div>
							<div class="col-md-1 d-flex">
								<div class="align-self-center">
									<base-button size="sm" nativeType="submit" :outline="true">
										<i class="fa fa-plus" aria-hidden="true"></i>
									</base-button>
								</div>
							</div>
						</div>
					</form-validate>
					<hr />
					<div class="row" v-for="(dep, idx) in adr_deposits" :key="idx">
						<div class="col-md-11 border-bottom border-primary">
							<div class="row">
								<div class="col-md-2">
									<base-input :view="true" :modelValue="dep.material.un_code" disabled />
								</div>
								<div class="col-md-5">
									<base-input :view="true" :modelValue="dep.name" disabled />
								</div>
								<div class="col-md-5">
									<base-input :view="true" :modelValue="dep.material.denomination_name" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="dep.material.class.code" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="dep.material.packing.code" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="dep.equipment.name" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="dep.quantity" disabled />
								</div>
							</div>
						</div>
						<div class="col-md-1 d-flex">
							<div class="align-self-center">
								<base-button size="sm" @click="unlink(dep.id, 'deposits')" type="danger"
									:outline="true">
									<i class="fa fa-minus" aria-hidden="true"></i>
								</base-button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12 mt-md-3">
					<h5 class="text-uppercase text-primary">
						RESIDUOS ADR GENERADOS/ALMACENADOS INSTALACIÓN
					</h5>
					<h6 class="text-uppercase text-muted">
						TIPO RESIDUOS ADR CARGADOS/DESCARGADOS/ALMACENADOS EN LA INSTALACIÓN
					</h6>
					<form-validate ref="form_res" @submit="addMaterial($event, 'residue')">
						<div class="row">
							<div class="col-md-11">
								<div class="row">
									<div class="col-md-2">
										<base-field name="un_code" label="UN">
											<field-validate as="select" class="form-control" name="un_code" label="un"
												rules="required" v-model="residue.index">
												<option selected>UN</option>
												<option :value="idx" v-for="(r, idx) in audit.installation.residues"
													:key="idx">
													{{ r.material.un_code }}
												</option>
											</field-validate>
										</base-field>
									</div>
									<div class="col-md-5">
										<base-input :view="true" :modelValue="residue.name" label="Nombre" disabled />
									</div>
									<div class="col-md-5">
										<base-input :view="true" :modelValue="
											residue.material != null
												? residue.material.denomination_name
												: ``
										" label="Denominación" disabled />
									</div>
									<div class="col-md-3">
										<base-input :view="true" :modelValue="
											residue.material != null
												? residue.material.class.code
												: ``
										" label="Clase" disabled />
									</div>
									<div class="col-md-3">
										<base-input :view="true" :modelValue="
											residue.material != null
												? residue.material.packing.code
												: ``
										" label="GE" disabled />
									</div>
									<div class="col-md-3">
										<base-input :view="true" :modelValue="
											residue.equipment != null ? residue.equipment.name : ``
										" label="Deposito" disabled />
									</div>
									<div class="col-md-3">
										<base-field label="Volumen almacenamiento">
											<field-validate name="quantity" type="number" class="form-control"
												v-model="residue.quantity" :disabled="residue.quantity == null">
											</field-validate>
										</base-field>
									</div>
								</div>
							</div>
							<div class="col-md-1 d-flex">
								<div class="align-self-center">
									<base-button size="sm" nativeType="submit" :outline="true">
										<i class="fa fa-plus" aria-hidden="true"></i>
									</base-button>
								</div>
							</div>
						</div>
					</form-validate>
					<hr />
					<div class="row" v-for="(res, idx) in adr_residues" :key="idx">
						<div class="col-md-11">
							<div class="row">
								<div class="col-md-2">
									<base-input :view="true" :modelValue="res.material.un_code" disabled />
								</div>
								<div class="col-md-5">
									<base-input :view="true" :modelValue="res.name" disabled />
								</div>
								<div class="col-md-5">
									<base-input :view="true" :modelValue="res.material.denomination_name" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="res.material.class.code" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="res.material.packing.code" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="res.equipment.name" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="res.quantity" disabled />
								</div>
							</div>
						</div>
						<div class="col-md-1 d-flex">
							<div class="align-self-center">
								<base-button size="sm" @click="unlink(res.id, 'residues')" type="danger"
									:outline="true">
									<i class="fa fa-minus" aria-hidden="true"></i>
								</base-button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12 my-3">
					<base-field label="Imagenes:">
						<div class="clearfix">
							<div v-if="images.length >= 1" class="row overflow-auto border border-light rounded p-3 mb-3"
								style="max-height: 400px">
								<div v-for="(image, id) in images" :key="id" class="
										col-md-3
										d-flex
										justify-content-center
										position-relative
										my-1
									">
									<img :src="image.url" alt="" class="img-thumbnail" width="100" />
									<a class="text-danger position-absolute" style="right: 10%; top: 1%"
										@click.prevent="deleteImg(image.id)">
										<i class="fa-solid fa-circle-xmark"></i>
									</a>
								</div>
							</div>
							<div class="">
								<base-button type="primary" @click="addImages = !addImages" size="sm">{{
								!addImages ? "Agregar imagenes" : "Cancelar"
								}}</base-button>
							</div>
						</div>
						<div v-if="addImages">
							<div class="d-flex my-3 border border-ligth rounded p-2">
								<base-button :type="takePic ? 'secondary' : 'primary'" size="sm"
									@click="takePic = true">
									Tomar foto
								</base-button>
								<base-button :type="takePic === false ? 'secondary' : 'primary'" size="sm"
									@click="takePic = false, this.$store.commit('stopedCamera', true)">
									Subir foto
								</base-button>
							</div>
							<camera v-if="takePic && takePic != null" apiModel="audit" :apiId="audit?.id"
								data-name="material_images_base64" @photo_taken="loadImages"></camera>
							<div v-else-if="takePic === false">
								<UploadImages uploadMsg="Sube imagenes" @changed="handleImages" />
								<div class="float-lg-right mt-2">
									<base-button type="primary" @click="submitImages" size="sm" v-if="upBtn">Guardar
									</base-button>
								</div>
							</div>
						</div>
					</base-field>
				</div>
				<div class="col-md-12 mt-md-5">
					<base-field label="Observaciones:">
						<textarea name="" class="form-control" cols="30" rows="10"
							v-model="material_observations"></textarea>
					</base-field>
				</div>
			</div>
		</div>
		<div class="col-12">
			<div class="mt-4 float-md-right">
				<base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1">Anterior</base-button>
				<base-button type="default" @click.prevent="onSubmit" v-if="currentStep !== 9">Siguiente</base-button>
			</div>
		</div>
	</div>
</template>
<script>
import service from "@/store/services/model-service";
import data_service from "@/store/services/data-service";
import _, { random } from "lodash";
import UploadImages from "vue-upload-drop-images";

export default {
	props: ["audit", "currentStep"],
	components: {
		UploadImages,
	},
	data() {
		return {
			takePic: null,
			adr_classes: {},
			packing_types: {},
			operations_data: {},
			equipments_data: {},
			audit_id: null,
			installation_id: null,
			installation: {},
			audit_materials: {
				packing_group_id: null,
				adr_class_id: null,
				comment: "",
			},
			materials: [],
			residue: {
				index: null,
				id: null,
				name: null,
				equipment: null,
				quantity: null,
				material: null,
				buy: null,
				is_residue: false,
			},
			deposit: {
				index: null,
				id: null,
				name: null,
				equipment: null,
				quantity: null,
				material: null,
				buy: null,
				is_residue: false,
			},
			selected_quantity: null,
			adr_residues: [],
			adr_deposits: [],
			material_observations: "",
			materials_images: {},
			addImages: false,
			images: {},
			upBtn: false,
		};
	},
	async mounted() {
		this.audit_id = this.$route.params.id;
		this.installation_id = this.audit.installation_id;
		this.materials = this.audit.review_materials;
		this.adr_residues = this.formatMaterials(this.audit.materials);
		this.material_observations = this.audit.material_observation;
		this.adr_deposits = this.formatMaterials(this.audit.materials, false);
		this.installation = this.audit.installation
		this.loadData();
		this.loadImages();
	},
	methods: {
		async onSubmit() {
			try {
				let valid_step =
					this.audit.valid_step >= this.currentStep
						? this.audit.valid_step
						: this.currentStep;

				await service.update("audit", this.audit_id, {
					current_step: 4,
					material_observation: _.isEmpty(this.material_observations)
						? ""
						: this.material_observations,
					valid_step: valid_step,
					audit_material_reviews: this.materials,
					audit_materials: this.adr_residues.concat(this.adr_deposits),
				});
			} catch (err) {
				let message = err.response.message
					? err.response.message
					: "Ocurrio un error al guardar los cambios";
				this.$toast.error(message);
			}
			this.$emit("next", 3);
		},
		async submitMaterial(values, { resetForm }) {
			const c = this.adr_classes[values.adr_class_id];
			const p = this.packing_types[values.packing_group_id];
			this.materials.push({
				id: random(1, 999999),
				adr_class_id: c.id,
				packing_group_id: p.id,
				class: c,
				packing: p,
				comment: values.comment,
			});
			this.audit;
			resetForm();
		},
		async submitImages() {
			try {
				let data = new FormData();
				_.each(this.materials_images, function (img) {
					data.append("material_images[]", img);
				});

				await service.update("audit", this.audit_id, data);
				this.loadImages();
				this.upBtn = false
				this.takePic = null
			} catch (err) {
				console.log(err);
			}
		},
		async addMaterial(values, op) {
			let model = op == "deposit" ? this.adr_deposits : this.adr_residues;
			let compare = op == "deposit" ? this.deposit : this.residue;
			if (this.find(model, compare)) {
				this.$toast.error(`El ${op} ya se ha seleccionado`);
				return;
			}

			if (this.selected_quantity != compare.quantity) {
				try {
					await service.update('material', compare.id, { quantity: compare.quantity })
					this.$toast.success('Cantidad actualizada')
				} catch (err) {
					this.$toast.error('No se pudo actualizar la cantidad')
					console.log(err);
					return
				}
			}

			model.push({
				index: compare.index,
				id: compare.id,
				material: compare.material,
				equipment: compare.equipment,
				quantity: compare.quantity,
				name: compare.name,
				buy: compare.buy,
				is_residue: compare.is_residue,
				installation_material_id: compare.id,
			});

			if (op == "deposit") {
				this.deposit = {
					index: null,
					id: null,
					material: null,
					buy: null,
					is_residue: false,
				};
				this.$refs.form_dep.resetForm()
			} else {
				this.residue = {
					index: null,
					id: null,
					material: null,
					buy: null,
					is_residue: false,
				};
				this.$refs.form_res.resetForm()
			}
		},
		async loadInstallation() {
			try {
				const res = await service.show(
					"installation",
					this.installation_id,
					"includes[]=materials"
				);
				this.installation = res.data.data;
			} catch (err) {
				console.log(err);
			}
		},
		async loadData() {
			try {
				const res = await data_service.getPacking();
				const res2 = await data_service.getAdrClass();
				const res3 = await data_service.getOperations();
				const res4 = await data_service.getEquipments();

				this.equipments_data = res4.data.data;
				this.operations_data = res3.data.data;
				this.adr_classes = res2.data.data;
				this.packing_types = res.data.data;
			} catch (err) {
				this.$toast.error("No se pudieron cargar los datos");
			}
		},
		async loadImages() {
			try {
				const res_images = await service.getIndex(
					"audit_image",
					null,
					"audit_id=" + this.audit_id +
					"&type=MATERIAL"
				);
				this.images = res_images.data.data;
			} catch (err) {
				console.log(err);
			}
		},
		find(arr, item) {
			for (let index = 0; index < arr.length; index++) {
				const element = arr[index];
				if (element.id == item.id) {
					return element;
				}
			}
			return false;
		},
		unlink(id, op = "materials") {
			let position = 0;
			let position_item = 0;
			let arr = null;
			switch (op) {
				case "materials":
					arr = this.materials;
					break;
				case "residues":
					arr = this.adr_residues;
					break;
				case "deposits":
					arr = this.adr_deposits;
					break;
				default:
					break;
			}
			_.mapKeys(
				arr,
				(material) => {
					if (material.id == id) {
						position_item = position;
					}
					position++;
				},
				position_item,
				id
			);
			console.log(arr);
			arr.splice(position_item, 1);
		},
		formatMaterials(materials, op_residue = true) {
			let m = [];
			_.forEach(materials, (res) => {
				if (res.is_residue == op_residue) {
					m.push({
						id: res.id,
						buy: res.buy,
						material: res.material,
						installation_material_id: res.id,
						equipment: res.equipment,
						quantity: res.quantity,
						name: res.name,
						is_residue: res.is_residue,
					});
				}
			});
			return m;
		},
		handleImages(imgs) {
			this.materials_images = imgs;
			if (imgs.length >= 1) {
				this.upBtn = true;
			} else {
				this.upBtn = false;
			}
		},
		async deleteImg(id) {
			try {
				await service.destroy("audit_image", id);

				this.loadImages();
			} catch (err) {
				console.log(err);
			}
		},
	},
	computed: {
		operations() {
			const ope_inst = this.installation.operations;
			return _.map(this.operations_data, (op) => {
				let res = _.find(ope_inst, function (o) {
					return o.id == op.id;
				});

				if (typeof res != "undefined") {
					op.checked = true;
				} else {
					op.checked = false;
				}
				return op;
			});
		},
		equipments() {
			const ope_inst = this.installation.equipments;
			return _.map(this.equipments_data, (op) => {
				let res = _.find(ope_inst, function (o) {
					return o.id == op.id;
				});

				if (typeof res != "undefined") {
					op.checked = true;
				} else {
					op.checked = false;
				}
				return op;
			});
		},
	},
	watch: {
		"residue.index": function (newVal) {
			this.residue.id = this.audit.installation.residues[newVal].id;
			this.residue.name = this.audit.installation.residues[newVal].name;
			this.residue.equipment =
				this.audit.installation.residues[newVal].equipment;
			this.residue.quantity = this.audit.installation.residues[newVal].quantity;
			this.residue.material = this.audit.installation.residues[newVal].material;
			this.residue.buy = this.audit.installation.residues[newVal].buy;
			this.residue.is_residue =
				this.audit.installation.residues[newVal].is_residue;
			this.selected_quantity = this.$functions.copy(this.residue.quantity)
		},
		"deposit.index": function (newVal) {
			this.deposit.name = this.audit.installation.deposits[newVal].name;
			this.deposit.equipment =
				this.audit.installation.deposits[newVal].equipment;
			this.deposit.quantity = this.audit.installation.deposits[newVal].quantity;
			this.deposit.id = this.audit.installation.deposits[newVal].id;
			this.deposit.material = this.audit.installation.deposits[newVal].material;
			this.deposit.buy = this.audit.installation.deposits[newVal].buy;
			this.deposit.is_residue =
				this.audit.installation.deposits[newVal].is_residue;
			this.selected_quantity = this.$functions.copy(this.deposit.quantity)
		},
	},
};
</script>