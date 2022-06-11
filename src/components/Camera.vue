<template>
	<div>
		<div class="row mb-2">
			<div class="col-12 d-flex justify-content-center" @click="canTake = true">
				<div class="btn btn-primary rounded-circle py-2 px-3">
					<i class="fa-solid fa-camera"></i>
				</div>
			</div>
			<div class="d-block col-12 text-center">Abrir camara</div>
		</div>
		<div v-show="canTake" class="position-relative py-4">
			<Transition name="fade">
				<modal v-model:show="canTake" model="imagen" action="Capturar" @close="stop" modalClasses="modal-xl">
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
										:outline="true" @click="stop" v-if="canTake && cameraRef != null" size="sm">
										Cancelar</base-button>
								</div>
							</div>
						</div>
					</div>
				</modal>
			</Transition>
		</div>

		<div class="mt-3 container"></div>
	</div>
</template>
<script>
import service from "../store/services/model-service";

export default {
	name: "camera",
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
			options: [],
			devices: [],
			image: null,
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
		stop() {
			this.cameraRef?.stop()
			this.canTake = false
		},
		initVideo() {
			if (this.cameraRef == null) {
				this.cameraRef = this.$refs.camera;
			}
		},
		deviceChange() {
			this.cameraRef.changeCamera(this.selectedDevice)
		},
		async save() {
			try {
				console.log(this.canvas);

				let data = new FormData();
				data.append(this.dataName, this.image);

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
		toBase64(blob) {
			return new Promise((resolve) => {
				let image64 = null;
				var reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = function () {
					image64 = reader.result;
					resolve(image64)
				}
			})
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
			if (this.$store.state.is_mobile) {
				resolution = { width: 375, height: 812 }
			}
			console.log(resolution, this.$store.state.is_mobile);
			return resolution
		},
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
