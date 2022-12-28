<template>
	<div class="border rounded border-light px-md-3 py-md-2 mt-2 my-md-3 my-2 mx-md-3">
		<div>
			<h4>
				<slot name="title">
					{{ title }}
				</slot>
			</h4>
			<hr />
		</div>

		<div class="row">
			<slot>

			</slot>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String
		},
	}
}
</script>