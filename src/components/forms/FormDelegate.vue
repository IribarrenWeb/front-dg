<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema" :initial-values="delegate">
      <div class="row">
        <div class="col-md-6">
          <Field name="name" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              :modelValue="delegate.name"
              v-bind="field"
              label="Nombre"
              :required="true"
              :error="errorMessage"
              :api-errors="apiValidationErrors.name"
            >
            </base-input>
          </Field>
        </div>
        <div class="col-md-6">
          <Field name="last_name" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              v-bind="field"
              label="Apellido"
              :required="true"
              :error="errorMessage"
              :api-errors="apiValidationErrors.last_name"
            >
            </base-input>
          </Field>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <Field name="dni" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              label="DNI"
              v-bind="field"
              type="number"
              :required="true"
              :error="errorMessage"
              :api-errors="apiValidationErrors.dni"
            >
            </base-input>
          </Field>
        </div>
        <div class="col-md-8">
          <Field name="email" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              label="Correo"
              :required="true"
              v-bind="field"
              type="email"
              :error="errorMessage"
              :api-errors="apiValidationErrors.email"
            >
            </base-input>
          </Field>
        </div>

        <div class="col-md-8">
          <div class="row" v-if="disabled">
            <!-- CITY INPUTS -->
            <div class="col-md-6">
              <base-input
                label="Ciudad"
                :disabled="true"
                :modelValue="delegate.province.city.name"
              >
              </base-input>
            </div>
            <!-- END CITY INPUTS -->

            <!-- PROVINCE INPUTS -->
            <div class="col-md-6">
                <base-input label="Provincia" :modelValue="delegate.province.name" :disabled="true"> </base-input>
            </div>
            <!-- END PROVINCE INPUTS -->
          </div>
          <div class="row" v-else>
            <!-- CITY INPUTS -->
            <div class="col-md-6">
              <Field
                name="city"
                v-slot="{ field }"
                @update:modelValue="getProvinces($event)"
              >
                <base-select label="Ciudad" :required="true" v-bind="field">
                  <option
                    :value="city.id"
                    v-for="(city, key) in cities"
                    :key="key.id"
                  >
                    {{ city.name }}
                  </option>
                </base-select>
              </Field>
            </div>
            <!-- END CITY INPUTS -->

            <!-- PROVINCE INPUTS -->
            <div class="col-md-6">
              <Field name="province_id" v-slot="{ field, errorMessage }">
                <base-select
                  label="Provincia"
                  :required="true"
                  v-bind="field"
                  :error="errorMessage"
                  :disabled="provinces.length >= 1 ? false : true"
                  :api-errors="apiValidationErrors.province_id"
                >
                  <option
                    :value="province.id"
                    v-for="(province, key) in provinces"
                    :key="key.id"
                  >
                    {{ province.name }}
                  </option>
                </base-select>
              </Field>
            </div>
            <!-- END PROVINCE INPUTS -->
          </div>
        </div>

        <div class="col-md-4">
          <Field name="phone_number" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              :modelValue="delegate.phone_number"
              label="Numero movil"
              v-bind="field"
              :required="true"
              :error="errorMessage"
              :api-errors="apiValidationErrors.phone_number"
            >
            </base-input>
          </Field>
        </div>
      </div>
      <hr />
      <div class="row" v-if="!disabled">
        <div class="col-md-6">
          <base-input
            :disabled="disabled"
            :modelValue="delegate.name"
            label="Certificado"
            v-model="file_cer"
            :required="true"
            type="file"
            accept="application/pdf"
            id="file_cer"
            :api-errors="apiValidationErrors.file_certification"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <Field name="date_cer" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              :modelValue="delegate.name"
              label="Fecha de certificado"
              :required="true"
              type="date"
              v-bind="field"
              :error="errorMessage || errors.certification_date"
              :api-errors="apiValidationErrors.certification_date"
            >
            </base-input>
          </Field>
        </div>
        <div class="col-md-6">
          <base-input
            :disabled="disabled"
            :modelValue="delegate.name"
            label="Alta"
            accept="application/pdf"
            :required="true"
            v-model="file_firm"
            type="file"
            id="file_firm"
            :api-errors="apiValidationErrors.file_firm"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <Field name="date_firm" v-slot="{ field, errorMessage }">
            <base-input
              :disabled="disabled"
              :modelValue="delegate.name"
              label="Fecha de alta"
              :required="true"
              v-bind="field"
              type="date"
              :error="errorMessage"
              :api-errors="apiValidationErrors.firm_date"
            >
            </base-input>
          </Field>
        </div>
      </div>

      <base-button type="primary" nativeType="submit" v-if="!disabled"
        >Enviar</base-button
      >
      <base-button type="danger" class="ml-auto btn-inline-block" @click="$emit('closeModal')"
        >Cerrar
      </base-button>
    </Form>
    <loader v-if="loader"></loader>
  </div>
</template>

<script>
  import BaseSelect from "../BaseSelect.vue";
  import dataService from "../../store/services/data-service";
  import service from "../../store/services/delegate-service";
  import _ from "lodash";
  import { Field, Form } from "vee-validate";
  import * as yup from "yup";
  import formMixin from "@/mixins/form-mixin";
import BaseInput from '../BaseInput.vue';

  export default {
    components: { BaseSelect, Field, Form, BaseInput },
    mixins: [formMixin],
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
        type: Boolean
      }
    },
    data() {
      const schema = yup.object({
        name: yup.string().required("Es un campo requerido").min(5),
        last_name: yup.string().required("Es un campo requerido").min(5),
        phone_number: yup
          .number("Tiene que ser un numero")
          .required("Es un campo requerido"),
        dni: yup
          .number("Tiene que ser un numero")
          .required("Es un campo requerido"),
        email: yup.string().required("Es un campo requerido").email(),
        province_id: yup.mixed().required("Es un campo requerido"),
        date_cer: yup.date().required("Es un campo requerido"),
        date_firm: yup.date().required("Es un campo requerido"),
      });
      return {
        cities: {},
        provinces: {},
        schema,
        errors: {},
        file_firm: "",
        file_cer: "",
        loader: false,
        delegateVals: {
          name:"",
          last_name:"",
          phone_number:"",
          dni:"",
          email:"",
        }
      };
    },
    mounted() {
      this.getCities();
    },
    methods: {
      async getCities() {
        this.loader = true;
        try {
          const response = await dataService.getCities();
          this.cities = response.data.data;
        } catch (err) {
          console.log(err);
        }
        this.loader = false;
      },
      async getProvinces($evnt) {
        this.loader = true;
        try {
          const response = await dataService.getProvinces("city_id=" + $evnt);
          console.log(response);
          this.provinces = response.data.data;
        } catch (error) {
          console.log(error);
        }
        this.loader = false;
      },
      async onSubmit(values, { resetForm }) {
        if (_.isEmpty(this.file_firm) || _.isEmpty(this.file_cer)) {
          this.$swal(
            "Documentos requeridos",
            "Los documentos son requeridos",
            "error"
          );
          return;
        }
        var file_firm = document.querySelector("#file_firm");
        var file_cer = document.querySelector("#file_cer");

        let formData = new FormData();

        formData.append("name", values.name);
        formData.append("last_name", values.last_name);
        formData.append("email", values.email);
        formData.append("phone_number", values.phone_number);
        formData.append("dni", values.dni);
        formData.append("province_id", values.province_id);
        formData.append("file_certification", file_cer.files[0]);
        formData.append(
          "certification_date",
          new Date(values.date_cer).toLocaleDateString("en-GB")
        );
        formData.append("file_firm", file_firm.files[0]);
        formData.append(
          "firm_date",
          new Date(values.date_firm).toLocaleDateString("en-GB")
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
