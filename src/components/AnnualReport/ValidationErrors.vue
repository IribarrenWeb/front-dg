<template>
	<q-dialog>
		<q-card>
			<q-card-section class="">
				<div class="list-group list-group-flush">
					<div v-for="(error, idx) in errors" :key="idx" class="list-group-item list-group-item-action">
						<div class="d-flex">
							<div>
								<i v-if="!error.valid" class="fa-regular fa-circle-xmark text-danger"></i>
								<i v-else class="fa-solid fa-check text-success"></i>
							</div>
							<div class="ml-2">
								<div class="d-flex w-100 justify-content-between">
									<h5 class="mb-1 text-bolder">{{ error.title }}</h5>
									<small v-if="!error.valid" class="ml-2">{{ error.message }}</small>
								</div>
								<div v-if="!error.valid">
									<div v-for="validation, idx in error.validations" :key="idx"
										class="d-flex align-items-center">
										<i v-if="!validation.valid" class="fa-solid fa-xmark text-danger"></i>
										<i v-else class="fa-solid fa-check text-success"></i>
										<small class="mb-1 ml-2">{{ validation.title }} <span
												v-if="validation?.data && !validation.valid">{{ validation.data }}</span></small>
									</div>
								</div>
							</div>
						</div>
						<!-- <small>And some small print.</small> -->
					</div>
				</div>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn flat label="Cerrar" color="primary" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>
<script>
export default {
	inheritAttrs:true,
	props: {
		errors: {
			type: Array || Object
		},
	},
	setup() { },
};
</script>