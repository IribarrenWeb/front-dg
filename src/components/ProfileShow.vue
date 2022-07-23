<template>
	<div>
		<div class="mt-3 card">
			<div class="my-2 ml-md-4 ml-2">
				<h4>{{title}}</h4>
			</div>
			<table class="table table-bordered table-responsive-md table-sm rounded">
				<thead>
					<tr>
						<td>Nombre</td>
						<td>CIF/NIF</td>
						<td>Móvil</td>
						<td>Email</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>{{ profile?.user?.full_name ?? "N/A" }}</th>
						<th>
							{{
								profile?.cif_nif
									? profile?.cif_nif
									: profile?.dni ?? null
							}}
						</th>
						<th>{{ profile?.phone_number ?? "N/A" }}</th>
						<th>{{ profile?.user?.email ?? "N/A" }}</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
export default {
    inheritAttrs: true,
    props:{
        profile: {
            type: Object,
            required: true
        },
		title: {
			type: String,
			default: 'Delegación'
		}
    },
    setup() {
      return {

      }  
    }
}
</script>