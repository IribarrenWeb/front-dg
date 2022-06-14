<template>
	<div>
		<div class="row mb-2">
			<div class="col-12 d-flex justify-content-center" @click="handleClick">
				<div class="btn btn-primary rounded-circle py-2 px-3">
					<i class="fa-solid fa-camera"></i>
				</div>
			</div>
			<div class="d-block col-12 text-center">Abrir camara</div>
		</div>
		<div v-show="canTake" class="position-relative py-4">
			<Transition name="fade">
				<modal v-if="!isMobile" v-model:show="canTake" model="imagen" action="Capturar" @close="stop" modalClasses="modal-xl">
					<div class="container my-2">
						<base-field label="Dispositivos (camaras)">
							<select v-model="selectedDevice" class="form-control" v-on:change="deviceChange()">
								<option v-for="(option, idx) in options" :key="idx" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</base-field>
					</div>

					<loader :isLoading="isLoading"></loader>

					<div class="row">
						<div class="col-12" style="min-height: 500px;">
							<camera-component ref="camera" :resolution="resolution" @loading="isLoading = true"
								@started="isLoading = false">
							</camera-component>
						</div>
						<div class="col-12">
							<div class="row">
								<div class="col-md-4">
									<base-button type="primary" class="my-2 my-md-0" tag="div" :block="true"
										@click="takePic" v-if="canTake" size="sm">{{
												textCaptured
										}}</base-button>
								</div>
								<div class="col-md-4">
									<base-button type="primary" class="my-2 my-md-0" tag="div" :block="true"
										:disabled="!isPhotoTaken" @click="save" v-if="isPhotoTaken" size="sm">
										<i class="fa-solid fa-upload"></i> Guardar
									</base-button>
								</div>
								<div class="col-md-4">
									<base-button type="primary" class="my-2 my-md-0" tag="div" :block="true"
										:outline="true" @click="stop" v-if="isPhotoTaken && cameraRef != null" size="sm">
										Cancelar</base-button>
								</div>
							</div>
						</div>
					</div>
				</modal>
			</Transition>
		</div>
		<input ref="camera_input" type="file" name="file" accept="image/*;capture=camera" @change="handleInput"
			class="d-none w-100 h-auto" id="input_file">
		<div v-if="isMobile && isPhotoTaken && mobileImageInput" class="container">
			<Transition name="fade">
				<modal v-model:show="isPhotoTaken" model="imagen" action="Capturar" modalClasses="modal-xl">
					<div class="col-12" style="min-height: 500px;">
						<img :src="mobileImageInput" alt="mobile-photo" id="image-element" class="mobile-photo">
					</div>
					<div class="col-12">
						<div class="row">
							<div class="col-md-4">
								<base-button type="primary" class="my-2 my-md-0" tag="div" :block="true"
									@click="handleClick" v-if="isPhotoTaken" size="sm">{{
											textCaptured
									}}</base-button>
							</div>
							<div class="col-md-4">
								<base-button type="primary" class="my-2 my-md-0" tag="div" :block="true"
									:disabled="!isPhotoTaken" @click="save" v-if="isPhotoTaken" size="sm">
									<i class="fa-solid fa-upload"></i> Guardar
								</base-button>
							</div>
							<div class="col-md-4">
								<base-button type="primary" class="my-2 my-md-0" tag="div" :block="true" :outline="true"
									@click="stop" v-if="isPhotoTaken" size="sm">
									Cancelar</base-button>
							</div>
						</div>
					</div>
				</modal>
			</Transition>
		</div>
	</div>
</template>
<script>
import service from "../store/services/model-service";
import utils from "../mixins/utils-mixin.js";
import { mapGetters } from 'vuex';

export default {
	name: "camera",
	mixins: [utils],
	props: {
		apiId: {
			type: Number,
			required: true,
		},
		apiModel: {
			type: String,
			required: true,
		},
		dataName: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			canTake: false,
			isLoading: false,
			isPhotoTaken: false,
			cameraRef: null,
			cameraInput: null,
			options: [],
			devices: [],
			image: null,
			mobile_image: null,
			constraints: null,
			currentStream: null,
			selectedDevice: null,
		};
	},
	mounted() {
		this.initVideo();
		this.getDevices().then(() => {
			this.selectedDevice = this.options[0].value;
		});
	},
	methods: {
		camera() {
			this.initVideo();
			this.startCam()
		},
		handleClick() {
			if (this.isMobile) {
				this.cameraInput.click()
				this.isPhotoTaken = false
				this.mobile_image = null
			} else {
				this.canTake = true;
			}
		},
		stop() {
			this.cameraRef?.stop()
			this.canTake = false
			this.isPhotoTaken = false
		},
		initVideo() {
			if (this.cameraRef == null) {
				this.cameraRef = this.$refs.camera;
			}
			if (this.cameraInput == null) {
				this.cameraInput = this.$refs.camera_input;
			}
		},
		deviceChange() {
			this.cameraRef.changeCamera(this.selectedDevice)
		},
		async save() {
			try {
				if (this.isMobile) {
					let img_tag = document.getElementById('image-element')
					if (this.mobile_image != null) {
						const res = await this.COMPRESS_IMAGE(img_tag);
						this.image = await this.toBase64(res)
					}
				}

				let data = {};
				
				data[this.dataName] = this.image
				await service.update(this.apiModel, this.apiId, data);
				this.saved();
			} catch (err) {
				console.log(err);
			}
		},
		saved() {
			this.stop();
			this.$emit("photo_taken", true);
		},
		startCam() {
			this.cameraRef.start()
			console.log(this.cameraRef);
		},
		async takePic() {
			if (this.isPhotoTaken) {
				this.cameraRef.resume();
			} else {
				this.cameraRef.pause();
				let img = await this.cameraRef?.snapshot()
				this.image = await this.toBase64(img)
			}
			this.isPhotoTaken = !this.isPhotoTaken;
		},
		async getDevices() {
			if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
				return false;
			}
			let allDevices = await this.cameraRef.devices();
			let counter = 1;
			for (let mediaDevice of allDevices) {
				if (mediaDevice.kind === "videoinput") {
					let option = {};
					option.text = mediaDevice.label ? mediaDevice.label : 'Camara: ' + counter;
					option.value = mediaDevice.deviceId;
					this.options.push(option);
					this.devices.push(mediaDevice);
				}
				counter++
			}
			console.log(this.options);
			return true;
		},
		async handleInput(evt) {
			this.mobile_image = evt.target.files;
			this.isPhotoTaken = true
			console.log(this.isPhotoTaken);
		}
	},
	computed: {
		textCaptured() {
			return this.isPhotoTaken ? "Volver a tomar" : "Capturar";
		},
		stopCamera() {
			return this.$store.state.stopCamera;
		},
		resolution() {
			let resolution = { width: 500, height: 500 }
			if (this.isMobile) {
				resolution = { width: 375, height: 812 }
			}
			console.log(resolution, this.isMobile);
			return resolution
		},
		mobileImageInput() {
			let img = false;
			if (this.mobile_image != null) {
				img = URL.createObjectURL(this.mobile_image[0]);
				// img.onload = function () {
				// 	URL.revokeObjectURL(output.src) // free memory
				// }
			}
			return img
		},
		isMobile(){
			return this.$store.state.is_mobile
		},
		...mapGetters(['COMPRESS_IMAGE'])
	},
	watch: {
		canTake(val) {
			if (val) {
				this.camera();
			}
		},
		stopCamera(val) {
			if (val) {
				this.stop();
				this.$store.commit("stopedCamera");
			}
		},
	},
};
</script>
<style lang="scss">
	.mobile-photo{
		width: inherit;
		height: auto;
	}
</style>