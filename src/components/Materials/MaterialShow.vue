<template>
	<div v-if="material != null">
		<div class="d-flex align-items-center">
			<img v-if="material.is_dangerous" :src="dangerous_label" alt="is dangerous material" width="75" />
			<div v-if="material?.material?.labels" class="d-flex align-content-center justify-center">
				<img v-for="label in material?.material?.labels" :key="label.id" class="rounded" :src="label.url"
					:alt="label.image" width="75" />
			</div>
			<div class="ml-md-2 ml-1 row">
				<div class="col-12">
					<h3 class="font-weight-bold h2 text-uppercase">
						{{ material.name }}
					</h3>
				</div>
				<span v-if="material.material?.denomination_name" class="text-muted font-weight-light h6 col-12"
					data-bs-toggle="tooltip" data-bs-placement="top" :title="material?.material?.denomination_name">
					<!-- {{ denomination }} -->
					{{ material.material?.denomination_name }}
				</span>
			</div>
		</div>
		<div class="row border rounded border-light px-md-3 py-md-2 my-md-3 my-1">
			<div class="col-12">
				<h4>Datos generales</h4>
			</div>
			<div class="col-12 row overflow-auto">
				<table class="table table-sm table-bordered rounded">
					<thead>
						<tr>
							<th scope="row">Instalación</th>
							<th scope="row">Ciudad</th>
							<th scope="row">Operaciones</th>
							<th scope="row">Depósito</th>
							<th scope="row">Nombre</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ material.installation.name }}</td>
							<td>{{ material.installation?.address?.city }}</td>
							<td>
								<span v-for="op in material.installation.operations" :key="op.id">
									{{ op.name }},
								</span>
							</td>
							<td>{{ material.equipment.name }}</td>
							<td>{{ material.name }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="row">UN</th>
							<th scope="row">Denominacion</th>
							<th scope="row">Clase</th>
							<th colspan="2" scope="row">GE</th>
						</tr>
						<tr>
							<td>{{ material?.material?.un_code ?? 'PQ' }}</td>
							<td>
								<span data-bs-toggle="tooltip" data-bs-placement="top"
									:title="material?.material?.denomination_name">
									{{ denomination }}
									<!-- {{ material.material?.denomination_name }} -->
								</span>
							</td>
							<td>{{ material.material?.class.code }}</td>
							<td colspan="2">{{ material.material?.packing.code }}</td>
						</tr>
						<tr class="text-uppercase">
							<th scope="row">Disposiciones</th>
							<th scope="row">Cant. limitadas</th>
							<th scope="row">Cat. y tunel</th>
							<th colspan="2" scope="row">Peligro</th>
						</tr>
						<tr>
							<td>{{ material?.material?.dispositions }}</td>
							<td>{{ material?.material?.limited_quantities }}</td>
							<td>{{ material?.material?.category_tunnel }}</td>
							<td colspan="2">{{ material?.material?.danger }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="row border rounded border-light px-md-3 py-md-2">
			<div class="col-12">
				<h4>Cantidades anuales</h4>
				<table class="table table-sm table-bordered rounded">
					<thead>
						<tr>
							<th scope="col">Unidad</th>
							<th scope="col">Cant. compra</th>
							<th scope="col">Cant. venta</th>
							<th scope="col">Cant. transportada</th>
							<th scope="col">Vol. almacenamiento</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ material.unit }}</td>
							<td>{{ material.buy }}</td>
							<td>{{ material.sell }}</td>
							<td>{{ material.transported }}</td>
							<td>{{ material.quantity }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="row mt-md-3 mt-1">
			<div class="col-md-6 border rounded border-light px-md-2 py-md-1">
				<div class="col-12 d-flex justify-content-around align-items-center">
					<h4>Contaminante del medioambiente</h4>
					<base-switch :value="material.is_dangerous == 1 ? true : false" classes="m-0"
						:disabled="true"></base-switch>
				</div>
			</div>
			<div v-if="document" class="
						col-md-6
						border
						rounded
						border-light
						px-md-2
						py-md-1
						d-flex
						align-items-center
					">
				<div class="col-12 d-flex justify-content-around">
					<a href="#" @click.prevent="getDocument(document.id)">
						<h4>Ficha de datos de seguridad <i class="fa-regular fa-file-pdf"></i></h4>

					</a>
				</div>
			</div>
		</div>
		<div class="d-flex justify-content-lg-end mt-md-3 mt-2">
			<base-button type="default" :outline="true" size="sm" class="btn-inline-block" @click="$emit('close')">
				Cerrar
			</base-button>
		</div>
	</div>
</template>
<script>
import _ from "lodash";
import service from "../../store/services/model-service";
import utils from "@/mixins/utils-mixin";
import { baseUrl } from '../../axios/index'

export default {
	mixins: [utils],
	name: "material-show",
	props: ["id"],
	data() {
		return {
			material: null,
		};
	},
	mounted() { },
	methods: {
		async show(id) {
			try {
				const res = await service.show(
					"material",
					id,
					"includes[]=installation.operations&includes[]=installation.province.city&includes[]=equipment&includes[]=documents"
				);
				this.material = this.$functions.copy(res.data.data);
			} catch (err) {
				console.log(err);
			}
		},
	},
	computed: {
		denomination() {
			return _.truncate(this.material?.material?.denomination_name, {
				length: 25,
			});
		},
		document() {
			return _.isEmpty(this.material?.documents) ? false : this.material.documents[0]
		},
		dangerous_label() {
			return baseUrl + '/labels/is_dangerous.jpg'
		}
	},
	watch: {
		id: {
			// the callback will be called immediately after the start of the observation
			handler(val) {
				if (val >= 1 && val != null) {
					this.show(val);
				}
			},
			immediate: true,
		},
	},
};
</script>