<template>
	<div>
		<div class="mt-3 card">
			<div class="my-2 ml-md-4 ml-2">
				<h4>{{ title }}</h4>
			</div>
			<table class="table table-bordered table-responsive-lg table-sm rounded">
				<thead>
					<tr>
						<td v-for="col, idx in columns" :key="idx">{{col.title}}</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row,idx in rows" :key="idx">
						<th v-for="col, idx in columns" :key="idx">
							<span>{{getData(row,col.field, col?.op_field)}}</span>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
	import { computed } from '@vue/runtime-core';
	
	export default {
		inheritAttrs: true,
		props: {
			profile: {
				required: true,
			},
			data : {
				type: Object,
			},
			title: {
				type: String,
				default: "Delegación",
			},
			columns: {
				type: Object,
				required: false,
			},
		},
		setup(props) {
			const rows = computed(() => {
				return props.profile ? [props.profile] : props.data
			});

			function getData(row, index, opField = false){
				const indexKeys = index.split('.')
				let data = null;
				for (let index = 0; index < indexKeys.length; index++) {
					const key = indexKeys[index];
					if (index == 0) {
						data = row[key];
					}else{
						data = data[key];
					}
				}

				if (!data && opField) {
					data = row[opField]
				}
				return data ?? 'N/A'
			}

			return {
				rows,
				getData
			};
		},
	};
</script>