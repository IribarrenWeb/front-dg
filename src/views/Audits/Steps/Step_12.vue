<template>
	<form-validate @submit="onSubmit" v-slot="{ meta }">
		<div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
			<div class="spinner-border" role="status"></div>
		</div>
		<div v-else class="row justify-content-center px-md-2">
			<div class="col-md-12">
				<h4 class="text-uppercase">RESULTADO VISITA / INFORME</h4>
				<div class="row">
					<div class="col-md-12 my-md-3">
						<h6 class="text-uppercase text-muted">Documentación</h6>

						<div class="row q-gutter-sm">
							<div class="col">
								<div class="flex">
									<q-file :loading="loading" counter class="col q-mt-sm" v-model="new_files" outlined
										use-chips multiple accept=".pdf">
										<template v-slot:prepend>
											<q-icon name="attach_file" />
										</template>
									</q-file>
									<div v-if="new_files?.length >= 1" class="col-2 flex column q-mt-lg">
										<q-btn flat dense color="primary" :loading="loading" icon="fa-solid fa-upload"
											@click="upload()">
											<q-tooltip>
												Subir Archivos
											</q-tooltip>
										</q-btn>
									</div>
								</div>
							</div>
							<div class="col">
								<div class="flex justify-end">
									<div style="width: 90%;" v-for="file, idx in files" :key="idx">
										<q-item clickable style="max-width: 400px;">
											<q-item-section top avatar>
												<q-icon size="2rem" color="primary" name="fa-regular fa-file-pdf" />
											</q-item-section>
											<q-item-section @click="open(file?.public_url)">
												<q-item-label>{{ file.file_name }}</q-item-label>
												<q-item-label caption lines="2" v-if="file?.size">{{ file.size /
														1000
												}}
													KB</q-item-label>
											</q-item-section>
											<q-item-section side>
												<q-btn :loading="loading" color="primary" icon="fa-solid fa-xmark" flat
													@click="deleteFile(file.id)" />
											</q-item-section>
										</q-item>
									</div>
								</div>
							</div>
						</div>
						<!-- <input type="file" multiple class="form-control" accept=".pdf" /> -->
					</div>
					<div class="col-md-12 mt-md-3">
						<h6 class="text-uppercase text-muted">Reportaje Fotográfico</h6>
						<base-field>
							<div class="clearfix">

								<audit-images-module :images="images" @delete="deleteFile" />

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
									data-name="general_images_base64" @photo_taken="loadImages"></camera>
								<div v-else-if="takePic === false">
									<UploadImages @changed="handleImages" />
									<div class="float-lg-right mt-2">
										<base-button type="primary" @click="submitImages" size="sm" v-if="upBtn">
											Guardar
										</base-button>
									</div>
								</div>
							</div>
						</base-field>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="mt-4 float-md-right">
					<base-button type="default" @click="this.$emit('prev')" v-if="currentStep !== 1">Anterior
					</base-button>
					<base-button type="default" :disabled="!meta.valid" nativeType="submit" v-if="currentStep !== 13">
						Siguiente</base-button>
				</div>
			</div>
		</div>
	</form-validate>
</template>
<script>
import service from "@/store/services/model-service";
import _, { random } from "lodash";
import UploadImages from "vue-upload-drop-images";
import { Notify } from 'quasar';
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
			takePic: null,
			addImages: false,
			upBtn: false,
			images: {},
			general_images: {},
			new_files: [],
			loading: false,
			files: []
		};
	},
	async mounted() {
		this.loadImages();
		this.loadFiles();
	},
	methods: {
		async onSubmit() {
			try {
				await service.update("audit", this.audit_id, {
					current_step: 13,
					valid_step:
						this.audit.valid_step >= this.currentStep
							? this.audit.valid_step
							: this.currentStep,
					non_c: this.nonconformities,
					general_observations: this.general_observations,
					compliance_level_id: this.level,
				});
				this.$emit("next", 12);
			} catch (err) {
				let message = err.response.message
					? err.response.message
					: "Ocurrio un error al guardar los cambios";
				this.$toast.error(message);
				console.log(err);
			}
		},
		open(url) {
			window.open(url, '_blank').focus();
		},
		async upload() {
			try {
				let data = new FormData();
				_.each(this.new_files, function (file) {
					data.append("general_files[]", file);
				});
				this.loading = true
				await service.update("audit", this.audit_id, data);
				this.loading = false
				this.addFiles = false
				this.new_files = []
				this.loadFiles()
			} catch (err) {
				Notify.create({
					message: 'Ocurrio un error al intentar subir los archivos'
				})
			}
		},
		async remove(id) {

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
		addNon(values, { resetForm }) {
			this.nonconformities.push({
				id: random(1, 999999),
				priority_id: this.non_c.pri.id,
				pri: this.non_c.pri,
				nonconformity_type_id: this.non_c.type.id,
				type: this.non_c.type,
				description: this.non_c.description,
			});

			this.non_c = {
				index: null,
				id: null,
				type_id: null,
				pri_id: null,
				description: null,
			};
			resetForm();
		},
		unlink(id) {
			let position = 0;
			let position_item = 0;
			_.mapKeys(
				this.nonconformities,
				(veh) => {
					if (veh.id == id) {
						position_item = position;
					}
					position++;
				},
				position_item,
				id
			);

			this.nonconformities.splice(position_item, 1);
		},
		async deleteFile(id) {
			try {
				await service.destroy("audit_image", id);
				this.loadFiles();
				this.loadImages();
			} catch (err) {
				console.log(err);
			}
		},
		handleImages(imgs) {
			this.general_images = imgs;
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
					"audit_id=" + this.audit_id + "&type=GENERAL"
				);
				this.images = res_images.data.data;
			} catch (err) {
				console.log(err);
			}
		},
		async loadFiles() {
			try {
				this.loading = true
				const res_images = await service.getIndex(
					"audit_image",
					null,
					"audit_id=" + this.audit_id + "&type=GENERAL_FILES"
				);
				this.loading = false
				this.files = res_images.data.data;
			} catch (err) {
				console.log(err);
			}
		},
		async submitImages() {
			try {
				let data = new FormData();
				_.each(this.general_images, function (img) {
					data.append("general_images[]", img);
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
	computed: {},
	watch: {
		"non_c.type_id": function (newVal) {
			this.non_c.type = this.audit.non_types[newVal];
		},
		"non_c.pri_id": function (newVal) {
			this.non_c.pri = this.audit.pri_types[newVal];
		},
	},
};
</script>