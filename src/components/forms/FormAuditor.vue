<template>
  <div>
    <form-validate @submit="onSubmit">
      <div class="row">
        <base-input
          :disabled="disabled"
          :modelValue="auditor.name"
          :view="auditor.length >= 1"
          formClasses=" col-lg-4"
          name="name"
          label="Nombre"
          rules="required"
        />
        <base-input
          :disabled="disabled"
          :modelValue="auditor.last_name"
          :view="auditor.length >= 1"
          formClasses=" col-lg-4"
          name="last_name"
          label="Apellido"
          rules="required"
        />
        <div class=" col-lg-4">
          <div v-if="disabled">
            <label for="">Delegado</label>
            <div>
              <a href="#" @click.prevent="" class="text-uppercase">
                {{auditor.delegate.user.name + ' ' + auditor.delegate.user.last_name}}
              </a>
            </div>
          </div>
          <div v-else>
            <label for=""> Delegado </label>
            <Multiselect
              :searchable="true"
              v-model="delegate_id"
              trackBy="name"
              label="name"
              :min-chars="2"
              :delay="50"
              valueProp="id"
              :required="true"
              :options="fetchItems"
              :object="true"
            >
              <template v-slot:option="{ option }">
                {{ option.name }} {{ option.last_name }} - {{ option.email }}
              </template>
            </Multiselect>
          </div>
        </div>
      </div>
      <div class="row">
        <base-input
          :disabled="disabled"
          :modelValue="auditor.phone_number"
          :view="auditor.length >= 1"
          formClasses=" col-lg-4"
          name="phone_number"
          label="Numero movil"
          rules="required|numeric"
        />
        <base-input
          :disabled="disabled"
          :modelValue="auditor.email"
          :view="auditor.length >= 1"
          formClasses=" col-lg-4"
          name="email"
          label="Email"
          rules="required|email"
        />
        <base-input
          :disabled="disabled"
          :modelValue="auditor.dni"
          :view="auditor.length >= 1"
          formClasses=" col-lg-4"
          name="dni"
          label="Dni"
          rules="required|numeric"
        />
        <div v-if="disabled" class="col-12">
          <div class="row">
            <base-input
              formClasses=" col-lg-6"
              :view="true"
              :modelValue="auditor.province.city.name"
              :disabled="true"
              label="Ciudad"
            />
            <base-input
              formClasses=" col-lg-6"
              :view="true"
              :modelValue="auditor.province.name"
              label="Provincia"
              :disabled="true"
            />
          </div>
        </div>
        <div v-else class="col-12">
          <div class="row">
            <base-input
              formClasses=" col-lg-6"
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
              formClasses=" col-lg-6"
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
            formClasses=" col-lg-6"
            name="file_cer"
            label="Certificado"
            type="file"
            rules="required|ext:pdf"
          />
          <base-input
            formClasses=" col-lg-6"
            name="date_cer"
            label="Fecha de certificado"
            type="date"
            rules="required"
          />
          <base-input
            formClasses=" col-lg-6"
            name="file_firm"
            label="Alta"
            type="file"
            rules="required|ext:pdf"
          />
          <base-input
            formClasses=" col-lg-6"
            name="date_firm"
            label="Fecha de alta"
            type="date"
            rules="required"
          />
        </div>
        <div class="row" v-else>
          <div
            class=" col-lg-6"
            v-for="document in auditor.documents"
            :key="document.id"
          >
            <div class="row">
              <div class=" col-lg-6 align-self-center">
                <button
                  type="button"
                  class="btn btn-link text-uppercase h3"
                  @click="getDocument(document.id)"
                >
                  <i class="fa fa-file-pdf"></i><u>{{ document.type.name }}</u>
                </button>
              </div>
              <div class=" col-lg-6">
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
      <div class="d-flex justify-content-lg-end">
        <base-button
          type="default"
          nativeType="submit"
          text="Enviar"
          size="sm"
          v-if="!disabled"
        >
          Enviar
        </base-button>
        <base-button
          type="default"
          :outline="true"
          size="md"
          class="btn-inline-block"
          @click="$emit('closeModal')"
        >
          Cancelar
        </base-button>
      </div>
    </form-validate>

  </div>
</template>
<script>
  import Multiselect from "@vueform/multiselect";

  import service from "@/store/services/model-service";
  import _ from "lodash";
   
  import utils from "@/mixins/utils-mixin";
  export default {
    components: { Multiselect },
    mixins: [utils],
    name: "form-auditor",
    props: {
      auditor: {
        type: Object,
      },
      disabled: {
        type: Boolean,
      },
    },
    data() {
      return {
        errors: {},
        api: "auditor",
        delegate_id: "",
      };
    },
    mounted() {
      // this.getCities();
    },
    methods: {
      async onSubmit(values, { resetForm }) {
        let formData = new FormData();
        formData.append("name", values.name);
        formData.append("last_name", values.last_name);
        formData.append("email", values.email);
        formData.append("phone_number", values.phone_number);
        formData.append("dni", values.dni);
        formData.append("province_id", values.province_id);
        formData.append("delegate_id", this.delegate_id.delegate.id);
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
          const response = await service.store(this.api, formData, true);
          if (response.status == 201) {
              resetForm();
              this.$emit("closeModal");
              this.$emit("resetTable");
          }
        } catch (err) {
          // if (typeof err.response == "undefined") {
          //   this.$swal("Error", "Ocurrio un error", "error");
          //   console.log(err);
          // } else {
          //   if (err.response.status == 422) {
          //     this.setApiValidation(err.response.data.errors);
          //     console.log(this.apiValidationErrors);
          //     this.$swal(
          //       "Error en los datos",
          //       err.response.data.message,
          //       "error"
          //     );
          //   } else {
          //     this.$swal(
          //       "Error en el servidor",
          //       "Ocurrio un error en el servidor",
          //       "error"
          //     );
          //     console.log(err.response);
          //   }
          // }
        }
      },
      async fetchItems(search) {
        if (_.isEmpty(search)) {
          return {};
        }
        const response = await service.users(
          "name=" + search + "&role_id=2&includes[]=delegate"
        );
        return response.data.data;
      },
    },
  };
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
