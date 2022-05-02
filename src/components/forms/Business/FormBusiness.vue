<template>
  <div>
    <form-validate @submit="submit">
      <template v-if="step === 1">
        <div>
          <div class="row border border-light rounded p-2">
            <div class="col-12">
              <h4>Datos del representante</h4>
            </div>
            <div class="col-md-4">
              <base-input
                name="name"
                label="Nombre"
                inputClasses="form-control-sm"
                type="text"
                :modelValue="model.name"
                rules="required"
              />
            </div>
            <div class="col-md-4">
              <base-input
                name="last_name"
                inputClasses="form-control-sm"
                label="Apellido"
                type="text"
                :modelValue="model.last_name"
                rules="required"
              />
            </div>
            <div class="col-md-4">
              <base-input
                name="property_dni"
                inputClasses="form-control-sm"
                label="Dni"
                type="text"
                :modelValue="model.property_dni"
                rules="required"
              />
            </div>
            <div class="col-md-6">
              <base-input
                name="email"
                inputClasses="form-control-sm"
                label="Email"
                type="text"
                :modelValue="model.email"
                rules="required"
              />
            </div>
            <div class="col-md-6">
              <base-input
                name="property_phone"
                inputClasses="form-control-sm"
                label="Telefono"
                type="text"
                :modelValue="model.property_phone"
                rules="required"
              />
            </div>
          </div>
          <div class="row border border-light rounded p-2 mt-2">
            <div class="col-12">
              <h4>Datos de empresa</h4>
            </div>
            <div class="col-md-4">
              <base-input inputClasses="form-control-sm" name="business_name" label="Nombre" :modelValue="model.business_name" type="text" />
            </div>
            <div class="col-md-4">
              <base-input
                inputClasses="form-control-sm"
                name="business_phone"
                :modelValue="model.business_phone"
                label="Telefono"
                type="number"
              />
            </div>
            <div class="col-md-4">
              <base-input inputClasses="form-control-sm" name="nif" :modelValue="model.business_nif" label="NIF" type="text" />
            </div>
          </div>
          <div class="row border border-light rounded p-2 mt-2">
            <div class="col-12">
              <h4>Datos Bancarios</h4>
            </div>
            <div class="col-md-4">
              <base-input
                inputClasses="form-control-sm"
                name="bank_code"
                label="Numero cuenta"
                type="number"
                :modelValue="model.bank_code"
                rules="required"
              />
            </div>
            <div class="col-md-4">
              <base-input
                inputClasses="form-control-sm"
                name="holder_name"
                label="Nombre titular"
                :modelValue="model.holder_name"
                type="text"
                rules="required"
              />
            </div>
            <div class="col-md-4">
              <base-input
                inputClasses="form-control-sm"
                name="iban_number"
                :modelValue="model.iban_number"
                label="Numero IBAN"
                type="number"
                rules="required"
              />
            </div>
          </div>

          <div class="row border border-light rounded p-2 mt-2">
            <div class="col-12">
              <h4>Documentacion</h4>
            </div>
            <div class="col-md-6">
                <div v-if="!this.model.file_document == ''">
                    <base-input :view="true">{{this.model.file_document[0].name}}</base-input>
                    <button type="button" class="btn btn-primary btn-sm" @click="this.model.file_document = null">Cambiar</button>
                </div>
              <base-input
                v-else
                inputClasses="form-control-sm"
                name="file_document"
                label="Documentacion"
                type="file"
                rules="required"
                :modelValue="model.file_document"
              />
            </div>
            <div class="col-md-6">
              <base-input
                name="file_date"
                label="Fecha documentacion"
                type="date"
                rules="required"
                :modelValue="model.file_date"
              />
            </div>
          </div>
        </div>
      </template>

      <template>
        <div v-if="step === 2"></div>
      </template>

      <template>
        <div v-if="step === 3"></div>
      </template>

      <template>
        <div v-if="step === 4"></div>
      </template>

      <div class="mt-4">
        <base-button type="primary" @click="prevStep()" v-if="step !== 1"
          >Anterior</base-button
        >
        <base-button
          type="primary"
          nativeType="submit"
          v-if="step !== 3"
          >Siguiente</base-button
        >
        <base-button
          type="primary"
          nativeType="submit"
          v-if="step === 4"
          >Enviar</base-button
        >
        <base-button type="link" class="ml-auto" @click="this.$emit('close')"
          >Cancelar
        </base-button>
      </div>
    </form-validate>
  </div>
</template>
<script>
  import BaseInput from "../../BaseInput.vue";
  export default {
    components: { BaseInput },
    data() {
      return {
        step: 1,
        model: {
            name: "",
            last_name: "",
            email: "",
            business_name: "",
            business_phone: "",
            business_nif: "",
            property_dni: "",
            property_phone: "",
            bank_code: "",
            holder_name: "",
            iban_number: "",
            file_date: "",
            file_document: ""
        }
      };
    },
    methods: {
      submit(values) {
          if (this.step === 1) {
            this.model.name = values.name
            this.model.last_name = values.last_name 
            this.model.email = values.email
            this.model.business_name = values.business_name
            this.model.business_phone = values.business_phone 
            this.model.business_nif = values.nif 
            this.model.property_dni = values.property_dni
            this.model.property_phone = values.property_phone
            this.model.bank_code = values.bank_code
            this.model.holder_name = values.holder_name
            this.model.iban_number = values.iban_number
            this.model.file_date = values.file_date
            this.model.file_document = values.file_document
            console.log(this.model.file_document);
        }
        if (this.step !== 3) {
            this.step++;
        }
      },
      prevStep() {
      if (this.step <= 0) {
        return;
      }

      this.step--;
    }
    },
  };
</script>
