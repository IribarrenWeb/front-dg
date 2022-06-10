<template>
	<div>
		<div class="d-flex justify-content-center mb-2">
			<button
				type="button"
				class="btn btn-primary btn-sm"
				v-if="!canTake"
				@click="canTake = true"
			>
				<i class="fa-solid fa-camera"></i>
				Abrir camara
			</button>
			<button
				type="button"
				class="btn btn-primary btn-sm"
				v-else-if="canTake && video != null"
				@click="stop"
			>
				Cancelar
			</button>
			<base-button type="primary" @click="takePic" v-if="canTake" size="sm">{{
				textCaptured
			}}</base-button>
			<base-button
				type="primary"
				:outline="true"
				:disabled="!isPhotoTaken"
				@click="save"
				v-if="isPhotoTaken"
				size="sm"
			>
				<i class="fa-solid fa-upload"></i> Guardar</base-button
			>
		</div>
		<div class="container my-2">
			<base-field label="Dispositivos (camaras)">
				<select
					v-model="selectedDevice"
					:options="options"
					class="form-control"
					v-on:change="deviceChange()"
				>
					<option
						v-for="(option, idx) in options"
						:key="idx"
						:value="option.value"
					>
						{{ option.text }}
					</option>
				</select>
			</base-field>
		</div>
		<div v-show="canTake" class="position-relative py-4">
			<loader :isLoading="isLoading"></loader>
			<div v-show="canTake" class="d-flex justify-content-center">
				<video
					v-show="!isLoading && !isPhotoTaken"
					ref="video"
					id="video"
					autoplay
					class="rounded shadow w-100"
				></video>
				<canvas
					ref="canvas"
					id="canvas"
					class="rounded shadow"
					v-show="isPhotoTaken"
				></canvas>
			</div>
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
				video: null,
				canvas: null,
				canTake: false,
				isLoading: false,
				isPhotoTaken: false,
				w: null,
				h: null,
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
			this.setSizes();
			this.setConstraints();
			this.getDevices().then(() => {
				this.selectedDevice = this.options[0].value;
			});
		},
		methods: {
			camera(face) {
				this.initVideo();
				this.gum(face);
			},
			stop() {
				this.canTake = false;
				this.image = null;
				this.canvas = null;
				this.isPhotoTaken = false;
				this.video.pause();
				if (this.currentStream) {
					this.currentStream.getTracks().forEach((track) => {
						track.stop();
					});
					this.video.srcObject = null;
				}
				this.video.removeAttribute("src");
				this.video.load();
				// this.canvas
				// 	.getContext("2d")
				// 	.clearRect(0, 0, this.w, this.h);
				// return;
			},
			initVideo() {
				if (this.video == null) {
					this.video = this.$refs.video;
				}

				if (this.canvas == null) {
					this.canvas = this.$refs.canvas;
				}
			},
			setConstraints() {
				const videoContstraints = {};
				if (this.selectedDevice === null) {
					videoContstraints.facingMode = "environment";
				} else {
					videoContstraints.deviceId = {
						exact: this.selectedDevice,
					};
				}
				this.constraints = {
					video: videoContstraints,
					audio: false,
				};
			},
			deviceChange() {
				this.stop();
				this.isLoading = true;

				//don't change selected device
				this.setConstraints();
				this.gum().then((result) => {
					this.isLoading = false;

					this.initVideo();
					this.canTake = true;
					console.log("device change:", result);
				});
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
			async gum(face) {
				console.log(face);
				this.isLoading = true;
				this.setSizes();

				return navigator.mediaDevices
					.getUserMedia(this.constraints)
					.then((stream) => {
						this.isLoading = false;
						window.stream = stream;
						this.currentStream = window.stream;
						this.video.srcObject = stream;
					})
					.catch((err) => {
						console.log(err);
						this.isLoading = false;
					});
			},
			takePic() {
				this.setSizes();
				this.isPhotoTaken = !this.isPhotoTaken;

				const context = this.$refs.canvas.getContext("2d");
				context.drawImage(this.$refs.video, 0, 0, this.w, this.h);
				this.image = this.canvas.toDataURL("image/jpeg");
			},
			setSizes() {
				this.w = this.$refs?.video?.videoWidth;
				this.h = this.$refs?.video?.videoHeight;
				this.$refs?.canvas?.setAttribute("width", this.w);
				this.$refs?.canvas?.setAttribute("height", this.h);
			},
			async getDevices() {
				if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
					return false;
				}
				let allDevices = await navigator.mediaDevices.enumerateDevices();
				for (let mediaDevice of allDevices) {
					if (mediaDevice.kind === "videoinput") {
						let option = {};
						option.text = mediaDevice.label;
						option.value = mediaDevice.deviceId;
						this.options.push(option);
						this.devices.push(mediaDevice);
					}
				}
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
		},
		watch: {
			canTake(val) {
				if (val) {
					const env = this.$store.state.is_mobile ? "enviroment" : "user";
					this.camera(env);
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
