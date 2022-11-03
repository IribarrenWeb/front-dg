<template>
	<form-validate @submit="onSubmit" v-slot="{ meta }">
		<div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
			<div class="spinner-border" role="status"></div>
		</div>
		<div v-else class="row justify-content-center px-md-2">
			<div class="col-md-12">
				<!-- <h4 class="text-uppercase">VERIFICACIÓN DE LAS INSTALACIONES DE CARGA/DESCARGA Y ALMACENAMIENTO</h4> -->
				<div class="row">
					<div class="col-md-12">
						<base-checkbox :checked="check" @changed="changeHas" disabled>
							<b>
								- DISPONE DE VEHÍCULOS PROPIOS LA EMPRESA QUE TRANSPORTAN ADR
							</b>
						</base-checkbox>
					</div>
					<div class="col-md-12 mt-md-3">
						<h6 class="text-uppercase text-muted">VERIFICACIÓN DE VEHÍCULOS</h6>
						<form-validate @submit="addVehicle">
							<div class="row">
								<div class="col-md-3">
									<base-field name="matricula" label="Matricula">
										<field-validate as="select" class="form-control" name="matricula" label="un"
											rules="required" :disabled="!check" v-model="vehicle.index">
											<option selected>Matricula</option>
											<option :value="idx" v-for="(veh, idx) in inst_vehicles" :key="idx">
												{{ veh.registration_number }}
											</option>
										</field-validate>
									</base-field>
								</div>
								<div class="col-md-2">
									<base-input :view="true" :modelValue="vehicle.fleet != null ? vehicle.fleet : ``"
										label="Flota" disabled />
								</div>
								<div class="col-md-2">
									<base-input :view="true" :modelValue="vehicle.type != null ? vehicle.type.name : ``"
										label="Tipo" disabled />
								</div>
								<div class="col-md-3">
									<base-input :view="true" :modelValue="vehicle.adr != null ? vehicle.adr.code : ``"
										label="Designación" disabled />
								</div>
								<div class="col-md-2 d-flex">
									<div class="align-self-center">
										<base-button size="sm" nativeType="submit" :outline="true" :disabled="!check">
											<i class="fa fa-plus" aria-hidden="true"></i>
										</base-button>
									</div>
								</div>
							</div>
						</form-validate>
						<div class="row" v-for="(veh, idx) in vehicles" :key="idx">
							<div class="col-md-3">
								<base-input :view="true" :modelValue="veh.registration_number" disabled />
							</div>
							<div class="col-md-2">
								<base-input :view="true" :modelValue="veh.fleet" disabled />
							</div>
							<div class="col-md-2">
								<base-input :view="true" :modelValue="veh.type.name" disabled />
							</div>
							<div class="col-md-3">
								<base-input :view="true" :modelValue="veh.adr.code" disabled />
							</div>
							<div class="col-md-2 d-flex">
								<div class="align-self-center">
									<base-button size="sm" @click="unlink(veh.id)" type="danger" :outline="true">
										<i class="fa fa-minus" aria-hidden="true"></i>
									</base-button>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-12 my-3">
						<base-field label="Imagenes:">
							<div class="clearfix">
								<audit-images-module :images="images" @delete="deleteImg"/>
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
									data-name="vehicle_images_base64" @photo_taken="loadImages"></camera>
								<div v-else-if="takePic === false">
									<UploadImages @changed="handleImages" />
									<div class="float-lg-right mt-2">
										<base-button type="primary" @click="submitImages" size="sm" v-if="upBtn">Guardar
										</base-button>
									</div>
								</div>
							</div>
						</base-field>
					</div>
					<div class="col-md-12">
						<base-field label="OBSERVACIONES VEHÍCULOS EMPRESA">
							<textarea class="form-control" cols="30" rows="10"
								v-model="vehicle_observations"></textarea>
						</base-field>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="mt-4 float-md-right">
					<base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1">Anterior
					</base-button>
					<base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep !== 12">
						Siguiente</base-button>
				</div>
			</div>
		</div>
	</form-validate>
</template>
<script>
import UploadImages from "vue-upload-drop-images";
import service from "@/store/services/model-service";
import _ from "lodash";
import AuditImagesModule from '../../../components/Audit/Modules/AuditImagesModule.vue';
export default {
	props: ["audit", "currentStep"],
	components: {
		UploadImages,
		AuditImagesModule,
	},
	data() {
		return {
			audit_id: this.$route.params.id,
			has_vehicles: this.audit.has_vehicles,
			check: false,
			inst_vehicles: this.audit.installation.vehicles,
			vehicles: this.audit.vehicles,
			vehicle: {
				index: null,
				id: null,
				type: null,
				adr: null,
				fleet: null,
			},
			takePic: null,
			vehicle_observations: this.audit.vehicle_observations,
			addImages: false,
			upBtn: false,
			images: {},
			vehicle_images: {},
		};
	},
	async mounted() {
		this.check = this.audit.installation.hasTransport;

		this.loadImages();
	},
	methods: {
		async onSubmit() {
			try {
				await service.update("audit", this.audit_id, {
					current_step: 11,
					valid_step:
						this.audit.valid_step >= this.currentStep
							? this.audit.valid_step
							: this.currentStep,
					vehicles: this.vehicles,
					vehicle_observations: this.vehicle_observations,
					has_vehicles: this.has_vehicles,
				});
				this.$emit("next", 10);
			} catch (err) {
				let message = err.response.message
					? err.response.message
					: "Ocurrio un error al guardar los cambios";
				this.$toast.error(message);
				console.log(err);
			}
		},
		changeHas() {
			this.has_vehicles = !this.has_vehicles;
		},
		formatComp() {
			let compr = [];
			_.forEach(this.audit.comprobations, (comp) => {
				if (comp.step == 11) {
					compr.push(comp);
				}
			});
			return compr;
		},
		addVehicle(values, { resetForm }) {
			if (this.find(this.vehicles, this.inst_vehicles[this.vehicle.index])) {
				return this.$toast.error("Este vehiculo ya esta seleccionado");
			}
			let vehicle = this.inst_vehicles[this.vehicle.index];
			this.vehicles.push({
				id: vehicle.id,
				registration_number: vehicle.registration_number,
				type: vehicle.type,
				fleet: vehicle.fleet,
				adr: vehicle.adr,
			});
			this.vehicle = {
				index: null,
				id: null,
				type: null,
				adr: null,
				fleet: null,
			};
			resetForm();
		},
		find(arr, item) {
			for (let index = 0; index < arr.length; index++) {
				const element = arr[index];
				if (element.id == item.id) {
					return true;
				}
			}
			return false;
		},
		unlink(id) {
			let position = 0;
			let position_item = 0;
			_.mapKeys(
				this.vehicles,
				(veh) => {
					if (veh.id == id) {
						position_item = position;
					}
					position++;
				},
				position_item,
				id
			);

			this.vehicles.splice(position_item, 1);
		},
		async deleteImg(id) {
			try {
				await service.destroy("audit_image", id);

				this.loadImages();
			} catch (err) {
				console.log(err);
			}
		},
		handleImages(imgs) {
			this.vehicle_images = imgs;
			if (imgs.length >= 1) {
				this.upBtn = true;
			} else {
				this.upBtn = false;
			}
		},
		async loadImages() {
			try {
				const res_images = await service.getIndex(
					"audit_image",
					null,
					"audit_id=" + this.audit_id + "&type=VEHICULO"
				);
				this.images = res_images.data.data;
			} catch (err) {
				console.log(err);
			}
		},
		async submitImages() {
			try {
				let data = new FormData();
				_.each(this.vehicle_images, function (img) {
					data.append("vehicle_images[]", img);
				});

				await service.update("audit", this.audit_id, data);
				this.loadImages();
				this.upBtn = false;
				this.takePic = null;
			} catch (err) {
				console.log(err);
			}
		},
	},
	watch: {
		"vehicle.index": function (newVal) {
			this.vehicle.id = this.inst_vehicles[newVal].id;
			this.vehicle.type = this.inst_vehicles[newVal].type;
			this.vehicle.fleet = this.inst_vehicles[newVal].fleet;
			this.vehicle.adr = this.inst_vehicles[newVal].adr;
		},
	},
};
</script>