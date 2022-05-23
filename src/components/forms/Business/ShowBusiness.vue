<template>
	<div>
		<form-validate>
			<template v-if="currentStep === 1">
				<div>
					<div class="row border border-light rounded p-2">
						<div class="col-12">
							<h4>Datos generales</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="name" label="Nombre representante">
								<field-validate
									type="text"
									class="form-control"
									name="name"
									rules="required|"
									label="nombre"
									v-model="model.name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="last_name" label="Apellido representante">
								<field-validate
									type="text"
									class="form-control"
									name="last_name"
									rules="required|"
									label="apellido"
									v-model="model.last_name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_dni" label="DNI">
								<field-validate
									type="text"
									class="form-control text-uppercase"
									name="property_dni"
									rules="required|min:8|max:10"
									label="dni"
									v-model.trim="model.property_dni"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="property_phone" label="Móvil">
								<field-validate
									type="number"
									class="form-control"
									name="property_phone"
									rules="required|min:5|max:15"
									label="móvil"
									v-model.number="model.property_phone"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="email" label="Email">
								<field-validate
									type="text"
									class="form-control"
									name="email"
									rules="required|email"
									label="email"
									v-model.trim="model.email"
								/>
							</base-field>
						</div>
					</div>
					<div class="row border border-light rounded p-2 mt-2">
						<div class="col-12">
							<h4>Datos de empresa</h4>
						</div>
						<div class="col-lg-4">
							<base-field name="business_name" label="Nombre">
								<field-validate
									type="text"
									class="form-control"
									name="business_name"
									rules="required|"
									label="nombre empresa"
									v-model="model.business_name"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_nif" label="CIF/NIF">
								<field-validate
									type="text"
									class="form-control"
									name="business_nif"
									rules="required|"
									label="nombre"
									v-model.trim="model.business_nif"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="business_phone" label="Fijo">
								<field-validate
									type="number"
									class="form-control"
									name="business_phone"
									rules="required|min:5|max:15"
									label="fijó"
									v-model.number="model.business_phone"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="address" label="Dirección">
								<field-validate
									type="text"
									class="form-control"
									name="address"
									rules="required"
									label="dirección"
									v-model.number="model.address"
								/>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="province_id" label="Provincia">
								<field-validate
									class="form-control"
									as="select"
									name="province_id"
									rules="required"
									label="Provincia"
									v-model="model.province_id"
								>
									<option value="" selected>Selecciona una provincia</option>
									<option
										v-for="province in provinces"
										:key="province.id"
										:value="province.id"
									>
										{{ province.name }}
									</option>
								</field-validate>
							</base-field>
						</div>
						<div class="col-lg-4">
							<base-field name="postal_code" label="Código postal">
								<field-validate
									type="number"
									class="form-control"
									name="postal_code"
									rules="required|numeric|min:5|max:6"
									label="postal_code"
									v-model="model.postal_code"
								/>
							</base-field>
						</div>
					</div>
				</div>
			</template>
			<template v-if="currentStep === 2">
				<div class="row border border-light rounded p-2">
					<div class="col-12">
						<h4>Datos bancarios</h4>
					</div>
					<div class="col-lg-4">
						<base-field name="holder_name" label="Nombre del titular">
							<field-validate
								type="text"
								class="form-control"
								name="holder_name"
								rules="required|alpha_spaces"
								label="nombre"
								v-model="model.holder_name"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="bank_code" label="BIC/SWIFT">
							<field-validate
								type="text"
								class="form-control"
								name="bank_code"
								rules="required|min:5|max:20|alpha_num"
								label="BIC/SWIFT"
								v-model="model.bank_code"
							/>
						</base-field>
					</div>
					<div class="col-lg-4">
						<base-field name="iban_number" label="IBAN">
							<field-validate
								type="number"
								class="form-control"
								name="iban_number"
								rules="required|min:3|max:50"
								label="numero iban"
								v-model="model.iban_number"
							/>
						</base-field>
					</div>
				</div>
				<div class="row border border-light mt-3 rounded p-2">
					<div class="col-12">
						<h4>Documentación de la empresa</h4>
					</div>
					<div class="col-lg-6">
						<base-field name="file_date.date" label="Fecha de documentación">
							<field-validate
								type="date"
								class="form-control"
								name="file_date.date"
								rules="required"
								label="fecha documentación"
								v-model="model.file_date"
							/>
						</base-field>
					</div>
					<div class="col-lg-6">
						<base-field name="file_document.base64" label="Documentación">
							<div v-if="model.file_document.file.length >= 1">
								<span class="mr-md-4">{{
									model.file_document.file[0].name
								}}</span>
								<base-button
									@click="model.file_document.file = []"
									size="sm"
									type="default"
									:outline="true"
									><i class="fa-solid fa-pencil"></i
								></base-button>
							</div>
							<field-validate
								v-show="model.file_document.file.length < 1"
								type="file"
								class="form-control"
								name="file_document.base64"
								rules="required|ext:pdf"
								label="documento"
								v-model="model.file_document.file"
							/>
						</base-field>
					</div>
				</div>
			</template>
		</form-validate>
	</div>
</template>