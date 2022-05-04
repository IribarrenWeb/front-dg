<template>
  <div>
    <form-validate @submit="onSubmit">
      <div class="row">
        <base-input
          :disabled="disabled"
          :modelValue="delegate.name"
          :view="delegate.length >= 1"
          :apiErrors="apiValidationErrors.name"
          formClasses="col-md-6"
          name="name"
          label="Nombre"
          rules="required|alpha"
        />
        <base-input
          :disabled="disabled"
          :modelValue="delegate.last_name"
          :view="delegate.length >= 1"
          :apiErrors="apiValidationErrors.last_name"
          formClasses="col-md-6"
          name="last_name"
          label="Apellido"
          rules="required|alpha"
        />
      </div>
      <div class="row">
        <base-input
          :disabled="disabled"
          :modelValue="delegate.phone_number"
          :view="delegate.length >= 1"
          :apiErrors="apiValidationErrors.phone_number"
          formClasses="col-md-4"
          name="phone_number"
          label="Numero movil"
          rules="required|numeric"
        />
        <base-input
          :disabled="disabled"
          :modelValue="delegate.email"
          :view="delegate.length >= 1"
          :apiErrors="apiValidationErrors.email"
          formClasses="col-md-4"
          name="email"
          label="Email"
          rules="required|email"
        />
        <base-input
          :disabled="disabled"
          :modelValue="delegate.dni"
          :view="delegate.length >= 1"
          :apiErrors="apiValidationErrors.dni"
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
              :apiErrors="apiValidationErrors.province_id"
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
        <hr>
        <div class="row" v-if="!disabled">
          <base-input
            :apiErrors="apiValidationErrors.file_certification"
            formClasses="col-md-6"
            name="file_cer"
            label="Certificado"
            type="file"
            rules="required|ext:pdf"
          />
          <base-input
            :apiErrors="apiValidationErrors.certification_date"
            formClasses="col-md-6"
            name="date_cer"
            label="Fecha de certificado"
            type="date"
            rules="required"
          />
          <base-input
            :apiErrors="apiValidationErrors.file_firm"
            formClasses="col-md-6"
            name="file_firm"
            label="Alta"
            type="file"
            rules="required|ext:pdf"
          />
          <base-input
            :apiErrors="apiValidationErrors.firm_date"
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

    <loader v-if="loader"></loader>
  </div>
</template>

<script>
  import service from "../../store/services/delegate-service";
  import formMixin from "@/mixins/form-mixin";
  import utils from "@/mixins/utils-mixin";

  export default {
    mixins: [formMixin, utils],
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
      console.log(this.delegate);
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

        this.loader = true;

        try {
          const response = await service.store(formData);
          if (response.status == 201) {
            this.$swal(
              "El delegado se ha creado",
              "El delegado se ha creado con exito.",
              "success"
            ).then(() => {
              resetForm();
              this.$emit("closeModal");
              this.$emit("resetTable");
            });
          }
        } catch (err) {
          if (err.response.status == 422) {
            this.setApiValidation(err.response.data.errors);
            console.log(this.apiValidationErrors);
            this.$swal(
              "Error en los datos",
              err.response.data.message,
              "error"
            );
          } else {
            this.$swal(
              "Error en el servidor",
              "Ocurrio un error en el servidor",
              "error"
            );
            console.log(err.response);
          }
        }
        this.loader = false;
      },
    },
  };
</script>
