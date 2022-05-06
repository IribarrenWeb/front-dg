<template>
  <div>
    <form-validate @submit="onSubmit">
      <div class="row">
        <base-input
          :disabled="disabled"
          :modelValue="delegate.name"
          :view="delegate.length >= 1"
          formClasses="col-md-6"
          name="name"
          label="Nombre"
          rules="required"
        />
        <base-input
          :disabled="disabled"
          :modelValue="delegate.last_name"
          :view="delegate.length >= 1"
          formClasses="col-md-6"
          name="last_name"
          label="Apellido"
          rules="required"
        />
      </div>
      <div class="row">
        <base-input
          :disabled="disabled"
          :modelValue="delegate.phone_number"
          :view="delegate.length >= 1"
          formClasses="col-md-4"
          name="phone_number"
          label="Numero movil"
          rules="required|numeric"
        />
        <base-input
          :disabled="disabled"
          :modelValue="delegate.email"
          :view="delegate.length >= 1"
          formClasses="col-md-4"
          name="email"
          label="Email"
          rules="required|email"
        />
        <base-input
          :disabled="disabled"
          :modelValue="delegate.dni"
          :view="delegate.length >= 1"
          formClasses="col-md-4"
          name="dni"
          label="Dni"
          rules="required|numeric"
        />
        <div v-if="disabled" class="col-12">
          <div class="row">
            <base-input
              formClasses="col-md-6"
              :view="true"
              :modelValue="delegate.province.city.name"
              :disabled="true"
              label="Ciudad"
            />
            <base-input
              formClasses="col-md-6"
              :view="true"
              :modelValue="delegate.province.name"
              label="Provincia"
              :disabled="true"
            />
          </div>
        </div>
        <div v-else class="col-12">
          <div class="row">
            <base-input
              formClasses="col-md-6"
              @update:modelValue="getProvinces($event)"
              type="select"
              name="city"
              label="Ciudad"
            >
              <template v-slot:options>
                <option
                  :value="city.id"
                  v-for="(city, key) in cities"
                  :key="key.id"
                >
                  {{ city.name }}
                </option>
              </template>
            </base-input>

            <base-input
              formClasses="col-md-6"
              type="select"
              name="province_id"
              label="Provincia"
              :disabled="!provinces.length >= 1"
            >
              <template v-slot:options>
                <option
                  :value="province.id"
                  v-for="(province, key) in provinces"
                  :key="key.id"
                >
                  {{ province.name }}
                </option>
              </template>
            </base-input>
          </div>
        </div>
      </div>
      <div>
        <hr />
        <div class="row" v-if="!disabled">
          <base-input
            formClasses="col-md-6"
            name="file_cer"
            label="Certificado"
            type="file"
            rules="required|ext:pdf"
          />
          <base-input
            formClasses="col-md-6"
            name="date_cer"
            label="Fecha de certificado"
            type="date"
            rules="required"
          />
          <base-input
            formClasses="col-md-6"
            name="file_firm"
            label="Alta"
            type="file"
            rules="required|ext:pdf"
          />
          <base-input
            formClasses="col-md-6"
            name="date_firm"
            label="Fecha de alta"
            type="date"
            rules="required"
          />
        </div>
        <div class="row" v-else>
          <div
            class="col-md-6"
            v-for="document in delegate.documents"
            :key="document.id"
          >
            <div class="row">
              <div class="col-md-6 align-self-center">
                <button
                  type="button"
                  class="btn btn-link text-uppercase h3"
                  @click="getDocument(document.id)"
                >
                  <i class="fa fa-file-pdf"></i><u>{{ document.type.name }}</u>
                </button>
              </div>
              <div class="col-md-6">
                <base-input
                  :disabled="true"
                  :view="true"
                  :modelValue="formatDate(document.document_date)"
                  :label="'Fecha ' + document.type.name"
                >
                </base-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <base-button
        type="default"
        nativeType="submit"
        text="Enviar"
        v-if="!disabled"
      >
        Enviar
      </base-button>
      <base-button
        type="danger"
        class="btn-inline-block"
        @click="$emit('closeModal')"
      >
        Cancelar
      </base-button>
    </form-validate>
  </div>
</template>

<script>
  import service from "@/store/services/model-service";

  import utils from "@/mixins/utils-mixin";

  export default {
    mixins: [utils],
    name: "form-delegate",
    props: {
      isSubmit: {
        type: Boolean,
        default: false,
      },
      delegate: {
        type: Object,
      },
      disabled: {
        type: Boolean,
      },
    },
    data() {
      return {
        errors: {},
      };
    },
    mounted() {
      this.getCities();
    },
    methods: {
      async onSubmit(values, { resetForm }) {
        console.log(values);
        let formData = new FormData();

        formData.append("name", values.name);
        formData.append("last_name", values.last_name);
        formData.append("email", values.email);
        formData.append("phone_number", values.phone_number);
        formData.append("dni", values.dni);
        formData.append("province_id", values.province_id);
        formData.append("file_certification", values.file_cer[0]);
        formData.append(
          "certification_date",
          new Date(values.date_cer).toLocaleDateString("en-US")
        );
        formData.append("file_firm", values.file_firm[0]);
        formData.append(
          "firm_date",
          new Date(values.date_firm).toLocaleDateString("en-US")
        );

        console.log(formData);
        try {
          
          await service.store("delegate", formData, true);
  
          resetForm();
          this.$emit("closeModal");
          this.$emit("resetTable");
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
</script>
