<template>
	<div class="card">
		<div class="card-header border-0">
			<div class="row align-items-center">
				<div class="col">
					<h3 class="mb-0">Social traffic</h3>
				</div>
				<div class="col text-right">
					<base-button size="sm" type="default">See all</base-button>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<base-table thead-classes="thead-light" :data="tableData">
				<template v-slot:columns>
					<th>Referral</th>
					<th>Visitors</th>
					<th></th>
				</template>

				<template v-slot:default="row">
					<th scope="row">
						{{ row.item?.name }}
					</th>
					<td>
						{{ row.item?.visitors }}
					</td>
					<td>
						<div class="d-flex align-items-center">
							<span class="mr-2">{{ row.item?.progress }}%</span>
							<base-progress
								:type="row.item?.progressType"
								class="pt-0"
								:show-percentage="false"
								:value="row.item?.progress"
							/>
						</div>
					</td>
				</template>
			</base-table>
		</div>
	</div>
</template>
<script>
	export default {
		name: "social-traffic-table",
		data() {
			return {
				tableData: [
					{
						name: "Facebook",
						visitors: "1,480",
						progress: 60,
						progressType: "gradient-danger",
					},
					{
						name: "LinkedIn",
						visitors: "5,480",
						progress: 70,
						progressType: "gradient-success",
					},
					{
						name: "Google",
						visitors: "4,807",
						progress: 80,
						progressType: "gradient-default",
					},
					{
						name: "Instagram",
						visitors: "3,678",
						progress: 75,
						progressType: "gradient-info",
					},
					{
						name: "Twitter",
						visitors: "2,645",
						progress: 30,
						progressType: "gradient-warning",
					},
				],
			};
		},
	};
</script>
<style></style>
