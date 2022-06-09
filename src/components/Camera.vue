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
				image: null,
			};
		},
		mounted() {
			this.initVideo();
			this.setSizes();
		},
		methods: {
			camera(face) {
				this.gum(face);
			},
			stop() {
				this.canTake = false;
				this.image = null;
				this.canvas = null;
				this.isPhotoTaken = false;
				return (
					this.video.srcObject &&
					this.video.srcObject.getTracks().map((t) => t.stop())
				);
			},
			initVideo() {
				if (this.video == null) {
					this.video = this.$refs.video;
				}

				if (this.canvas == null) {
					this.canvas = this.$refs.canvas;
				}
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
				this.isLoading = true;
				this.setSizes();

				if (face === "user") {
					return navigator.mediaDevices
						.getUserMedia({ video: { facingMode: face } })
						.then((stream) => {
							this.isLoading = false;
							this.initVideo();
							this.video.srcObject = stream;
							this.localstream = stream;
						})
						.catch((err) => {
							console.log(err);
							this.isLoading = false;
						});
				}
				if (face === "environment") {
					return navigator.mediaDevices
						.getUserMedia({ video: { facingMode: { exact: face } } })
						.then((stream) => {
							this.isLoading = false;
							this.initVideo();
							this.video.srcObject = stream;
							this.localstream = stream;
						})
						.catch(() => {
							console.log("error");
							this.isLoading = false;
						});
				}
			},
			takePic() {
				// if (!this.isPhotoTaken) {
				// 	this.isShotPhoto = true;

				// 	const FLASH_TIMEOUT = 50;

				// 	setTimeout(() => {
				// 		this.isShotPhoto = false;
				// 	}, FLASH_TIMEOUT);
				// }
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
		},
		computed: {
			textCaptured() {
				return this.isPhotoTaken ? "Volver a tomar" : "Capturar";
			},
			stopCamera(){
				return this.$store.state.stopCamera
			}
		},
		watch: {
			canTake(val) {
				if (val) {
					const env = this.$store.state.is_mobile ? "enviroment" : "user";
					this.camera(env);
				}
			},
			stopCamera(val){
				if (val) {
					this.stop();
					this.$store.commit('stopedCamera')
				}
			}
		},
	};
</script>
