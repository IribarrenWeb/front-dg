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
		<input ref="camera_input" type="file" name="file" accept="image/*;capture=camera" @change="handleInput"
			class="d-none w-100 h-auto" id="input_file">

		<q-dialog v-model="canTake" @hide="stop">
			<q-card>
				<q-card-section>
					<div class="text-h6">Capturar imagen</div>
				</q-card-section>

				<q-separator />

				<q-card-section>
					<div class="container my-2">
						<base-field label="Dispositivos (camaras)">
							<select v-model="selectedDevice" class="form-control" v-on:change="deviceChange()">
								<option v-for="(option, idx) in options" :key="idx" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</base-field>
					</div>
				</q-card-section>
				<q-card-section style="max-height: 60vh" class="scroll">
					<div class="full-height">
						<camera-loader v-if="isLoading"/>
						<Transition name="fade">
							<camera-component v-show="!isLoading" ref="cameraRef" :resolution="resolution" @loading="isLoading = true"
								@started="isLoading = false">
							</camera-component>
						</Transition>
					</div>
				</q-card-section>

				<q-separator />

				<q-card-actions align="right">
					<q-btn label="Cancelar" @click="stop" color="primary" v-close-popup  :loading="isLoading"/>
					<q-btn :label="textCaptured" color="primary" @click="takePic" :loading="isLoading" />
					<q-btn v-if="isPhotoTaken" label="Guardar" color="primary" :loading="isLoading" @click="save" />
				</q-card-actions>
			</q-card>
		</q-dialog>

		<div v-if="isMobile && isPhotoTaken && mobileImageInput" class="container">
			<Transition name="fade">
				<modal v-model:show="isPhotoTaken" model="imagen" action="Capturar" modalClasses="modal-xxl">
					<div class="col-12" style="min-height: 500px;">
						<img :src="mobileImageInput" alt="mobile-photo" id="image-element" class="mobile-photo">
					</div>
					<div class="col-12 my-3">
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
									@click="stop" size="sm">
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
import service from "../../store/services/model-service";
import utils from "../../mixins/utils-mixin.js";
import { useStore } from 'vuex';
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import functions from '../../utils/functions';
import { swal } from '../../boot/plugins';
import CameraLoader from '../../loaders/CameraLoader.vue';

export default {
	components: { CameraLoader },
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
	setup(props, { emit }) {
		const store = useStore()
		const canTake = ref(false)
		const isLoading = ref(false)
		const isPhotoTaken = ref(false)
		const cameraRef = ref(null)
		const cameraInput = ref(null)
		const options = ref([])
		const devices = ref([])
		const image = ref(null)
		const mobile_image = ref(null)
		const constraints = ref(null)
		const currentStream = ref(null)
		const selectedDevice = ref(null)
		const textCaptured = computed(() => {
			return isPhotoTaken.value ? "Volver a tomar" : "Capturar";
		})
		const isMobile = computed(() => {
			return store.state.is_mobile
		})
		const stopCamera = computed(() => {
			return store.state.stopCamera;
		})
		const resolution = computed(() => {
			let resolution = { width: 500, height: 500 }
			if (isMobile.value) {
				resolution = { width: 375, height: 812 }
			}
			console.log(resolution, isMobile.value);
			return resolution
		})
		const mobileImageInput = computed(() => {
			let img = false;
			if (mobile_image.value != null) {
				img = URL.createObjectURL(mobile_image.value[0]);
				// img.onload = function  {
				// 	URL.revokeObjectURL(output.src) // free memory
				// }
			}
			return img
		})

		function handleClick() {
			if (isMobile.value) {
				cameraInput.value.click()
				isPhotoTaken.value = false
				mobile_image.value = null
			} else {
				canTake.value = true;
			}
		}

		function stop() {
			cameraRef.value?.stop()
			canTake.value = false
			isPhotoTaken.value = false
		}

		function initVideo() {
			startCam()
		}

		function deviceChange() {
			cameraRef.value.changeCamera(selectedDevice.value)
		}

		async function save() {
			try {
				isLoading.value = true
				if (isMobile.value) {
					let img_tag = document.getElementById('image-element')
					if (mobile_image.value != null) {
						const res = await functions.compressImage(img_tag);
						image.value = await functions.toBase64(res)
					}
				}

				let data = {};

				data[props.dataName] = image.value
				await service.update(props.apiModel, props.apiId, data);
				saved();
				isLoading.value = false
			} catch (err) {
				isLoading.value = false
				console.log(err);
			}
		}

		function saved() {
			stop();
			emit("photo_taken", true);
		}

		function startCam() {
			cameraRef.value.start()
			setTimeout(() => {
				if (isLoading.value != false) {
					isLoading.value = false
					swal('No se pudo abrir la camara', 'Ocurrio un problema al intentar abrir la camara', 'error');
					stop()
				}
			}, 5000)
			console.log(cameraRef.value);
		}

		async function takePic() {
			if (isPhotoTaken.value) {
				cameraRef.value.resume();
			} else {
				cameraRef.value.pause();
				let img = await cameraRef.value?.snapshot()
				image.value = await functions.toBase64(img)
			}
			isPhotoTaken.value = !isPhotoTaken.value;
		}

		async function getDevices() {
			if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
				return false;
			}
			let allDevices = await cameraRef.value.devices();
			let counter = 1;
			for (let mediaDevice of allDevices) {
				if (mediaDevice.kind === "videoinput") {
					let option = {};
					option.text = mediaDevice.label ? mediaDevice.label : 'Camara: ' + counter;
					option.value = mediaDevice.deviceId;
					options.value.push(option);
					this.devices.push(mediaDevice);
				}
				counter++
			}
			console.log(options.value);
			return true;
		}

		async function handleInput(evt) {
			mobile_image.value = evt.target.files;
			isPhotoTaken.value = true
			console.log(isPhotoTaken.value);
		}


		// initVideo();

		watch(() => canTake.value, (val) => {
			if (val && cameraRef.value) {
				startCam();
			}
		})

		watch(() => stopCamera.value, (val) => {
			if (val) {
				stop();
				store.commit("stopedCamera");
			}
		})

		watch(() => cameraRef.value, (v) => {
			if (v) {
				startCam()
				getDevices().then(() => {
					selectedDevice.value = options.value[0].value;
				});
			}
		}, { immediate: true })

		return {
			canTake,
			isLoading,
			isPhotoTaken,
			cameraRef,
			cameraInput,
			options,
			devices,
			image,
			mobile_image,
			constraints,
			currentStream,
			selectedDevice,
			mobileImageInput,
			resolution,
			stopCamera,
			textCaptured,

			takePic,
			initVideo,
			getDevices,
			handleInput,
			startCam,
			deviceChange,
			save,
			initVideo,
			stop,
			handleClick,
		};
	}
};
</script>
<style lang="scss">
.mobile-photo {
	width: inherit;
	height: auto;
}
</style>