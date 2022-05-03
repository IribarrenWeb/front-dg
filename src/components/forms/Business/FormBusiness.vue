<template>
  <div class="px-md-5">
    <div class="text-center text-uppercase">
      <h3>Agregar una empresa</h3>
    </div>
    <div class="progress" style="height: 1px">
      <div
        class="progress-bar"
        role="progressbar"
        :style="`width: ${percent}%`"
        aria-valuenow="50"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
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
                rules="required|alpha"
              />
            </div>
            <div class="col-md-4">
              <base-input
                name="last_name"
                inputClasses="form-control-sm"
                label="Apellido"
                type="text"
                :modelValue="model.last_name"
                rules="required|alpha"
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
                rules="required|email"
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
              <base-input
                inputClasses="form-control-sm"
                name="business_name"
                label="Nombre"
                :modelValue="model.business_name"
                type="text"
              />
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
              <base-input
                inputClasses="form-control-sm"
                name="nif"
                :modelValue="model.business_nif"
                label="NIF"
                type="text"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-if="step === 2">
        <div>
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
                rules="required|alpha_spaces"
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
                <base-input :view="true">{{
                  this.model.file_document[0].name
                }}</base-input>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="this.model.file_document = null"
                >
                  Cambiar
                </button>
              </div>
              <base-input
                v-else
                inputClasses="form-control-sm"
                name="file_document"
                label="Documentacion"
                type="file"
                rules="required|ext:pdf"
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
      <template v-if="step === 3">
        <fieldset
          class="border border-light rounded p-2 row mt-3"
          v-for="(installation, id) in installations"
          :key="installation.key"
        >
          <base-input
            formClasses="col-md-4"
            :name="`installations[${id}].name`"
            :modelValue="installations[id].name"
            label="Nombre de instalacion"
            rules="required|alpha_num"
          ></base-input>
          <base-input
            formClasses="col-md-4"
            :name="`installations[${id}].address`"
            :modelValue="installations[id].address"
            label="Direccion"
            rules="required"
          ></base-input>
          <div class="col-md-4">
            <label for=""> Auditor </label>
            <field-validate
              :name="`installations[${id}].auditor_id`"
              label="Auditor"
              rules="required"
              :modelValue="installations[id].auditable_id"
              v-slot="{ field, errorMessage }"
            >
              <Multiselect
                :searchable="true"
                trackBy="name"
                v-bind="field"
                label="name"
                :min-chars="2"
                :delay="500"
                valueProp="id"
                id="id"
                :required="true"
                :options="fetchItems"
                :object="true"
              >
                <template v-slot:option="{ option }">
                  {{ option.name }} {{ option.last_name }} - {{ option.email }}
                </template>
              </Multiselect>
              <span
                class="text-danger invalid-feedback d-block"
                v-if="apiValidationErrors.auditor_id || errorMessage"
                >{{
                  errorMessage
                    ? errorMessage
                    : apiValidationErrors.auditor_id[0]
                }}</span
              >
            </field-validate>
          </div>
          <div class="col-12">
            <div class="row">
              <div v-show="false">
                <field-validate
                  :name="`installations[${id}].province_id`"
                  class="form-control"
                  label="Provincia"
                  as="select"
                  rules="required"
                  :modelValue="installations[id].province_id"
                >
                </field-validate>
              </div>

              <base-input
                :apiErrors="apiValidationErrors.province_id"
                formClasses="col-md-6"
                type="select"
                :name="`installations[${id}].province_id`"
                label="Provincia"
                :modelValue="installations[id].province_id"
                :disabled="!provinces.length >= 1"
              >
                <template v-slot:options>
                  <option selected>Selecciona una provincia</option>
                  <option
                    :value="province.id"
                    v-for="(province, key) in provinces"
                    :key="key.id"
                  >
                    {{ province.name }}
                  </option>
                </template>
              </base-input>

              <div class="col-md-6">
                <div v-if="!this.installations[id].file_document == ''">
                  <base-input :view="true">{{
                    this.installations[id].file_document[0].name
                  }}</base-input>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="installations[id].file_document = null"
                  >
                    Cambiar
                  </button>
                </div>
                <base-input
                  v-else
                  :name="`installations[${id}].file_document`"
                  :modelValue="installations[id].file_document"
                  rules="required|ext:pdf"
                  type="file"
                  label="Documento de instalacion"
                ></base-input>
              </div>
            </div>
          </div>

          <div class="col-12 mt-2">
            <base-button
              type="danger"
              :outline="true"
              @click="remove(id)"
              :disabled="installations.length == 1"
              >Eliminar</base-button
            >
          </div>
        </fieldset>

        <div class="mt-3">
          <base-button
            @click="handlePush()"
            :disabled="installations.length >= 3"
          >
            Agregrar instalacion +
          </base-button>
        </div>
      </template>
      <template v-if="step === 4">
        <div>
          <fieldset
            class="border border-light rounded p-2 row mt-3"
            v-for="(installation, id) in installations"
            :key="installation.key"
          >
            <div class="col-12 border-bottom border-light mb-2">
              <h3 class="badge rounded-pill bg-primary text-white h3">
                Responsable de instalacion #{{ id + 1 }}
              </h3>
            </div>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.name`"
              :modelValue="installations[id].responsible.name"
              rules="required|alpha"
              label="Nombre"
            ></base-input>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.last_name`"
              :modelValue="installations[id].responsible.last_name"
              rules="required|alpha"
              label="Apellido"
            ></base-input>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.dni`"
              :modelValue="installations[id].responsible.dni"
              label="Dni"
              rules="required"
            ></base-input>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.email`"
              :modelValue="installations[id].responsible.email"
              label="Email"
              rules="required|email"
            ></base-input>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.position`"
              :modelValue="installations[id].responsible.position"
              rules="required|alpha_spaces"
              label="Posicion"
            ></base-input>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.phone_number`"
              :modelValue="installations[id].responsible.phone_number"
              label="Telefono"
              rules="required|numeric"
            ></base-input>
            <div class="col-md-4">
              <div
                v-if="!installations[id].responsible.file_certification == ''"
              >
                <base-input :view="true">{{
                  installations[id].responsible.file_certification[0].name
                }}</base-input>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="installations[id].responsible.file_certification = null"
                >
                  Cambiar
                </button>
              </div>
              <base-input
                v-else
                :name="`installations[${id}].responsible.file_certification`"
                :modelValue="installations[id].responsible.file_certification"
                rules="required|ext:pdf"
                type="file"
                label="Documento de certificado"
              ></base-input>
            </div>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.date_certification`"
              :modelValue="installations[id].responsible.date_certification"
              label="Fecha del certificado"
              type="date"
            ></base-input>
            <base-input
              formClasses="col-md-4"
              :name="`installations[${id}].responsible.date_firm`"
              :modelValue="installations[id].responsible.date_firm"
              label="Fecha de alta"
              type="date"
            ></base-input>
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-4">
                  <base-switch
                    label="Conductor ADR"
                    v-model="installations[id].responsible.driver"
                  ></base-switch>
                </div>
                <base-input
                  v-if="installations[id].responsible.driver"
                  formClasses="col-md-4"
                  type="select"
                  :name="`installations[${id}].responsible.adr_permit_id`"
                  label="Permiso ADR"
                  :modelValue="installations[id].responsible.adr_permit_id"
                  :disabled="!provinces.length >= 1"
                >
                  <template v-slot:options>
                    <option
                      :value="permit.id"
                      v-for="(permit, key) in permits"
                      :key="key.id"
                    >
                      {{ permit.name }}
                    </option>
                  </template>
                </base-input>
                <div class="col-md-4">
                  <div
                    v-if="
                      !installations[id].responsible.driver_document == '' &&
                      installations[id].responsible.driver
                    "
                  >
                    <base-input :view="true">{{
                      installations[id].responsible.driver_document[0].name
                    }}</base-input>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="installations[id].responsible.driver_document = null"
                    >
                      Cambiar
                    </button>
                  </div>
                  <base-input
                    v-else-if="
                      installations[id].responsible.driver &&
                      installations[id].responsible.driver_document == ''
                    "
                    :name="`installations[${id}].responsible.driver_document`"
                    :modelValue="installations[id].responsible.driver_document"
                    type="file"
                    rules="required|ext:pdf"
                    label="Documento de conductor"
                  ></base-input>
                </div>
                <base-input
                  v-if="installations[id].responsible.driver"
                  formClasses="col-md-4"
                  :name="`installations[${id}].responsible.driver_document_date`"
                  :modelValue="
                    installations[id].responsible.driver_document_date
                  "
                  label="Fecha de alta"
                  type="date"
                ></base-input>
              </div>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col-md-4">
                  <base-switch
                    label="Materiales peligrosos"
                    v-model="installations[id].responsible.dangerous_goods"
                  ></base-switch>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </template>

      <div class="mt-4 float-md-right">
        <base-button type="primary" @click="prevStep()" v-if="step !== 1"
          >Anterior</base-button
        >
        <base-button type="primary" nativeType="submit" v-if="step !== 4"
          >Siguiente</base-button
        >
        <base-button type="primary" nativeType="submit" v-if="step === 4"
          >Enviar</base-button
        >
        <base-button
          type="primary"
          :outline="true"
          class="ml-auto"
          @click="handleClose()"
          >Cancelar
        </base-button>
      </div>
    </form-validate>
    <loader v-if="loader"></loader>
  </div>
</template>
<script>
  import utils from "@/mixins/utils-mixin";
  import Multiselect from "@vueform/multiselect";
  import adminService from "../../../store/services/admin-service";
  import formMixin from "@/mixins/form-mixin";
  import service from "../../../store/services/business-service";
  import _ from "lodash";

  export default {
    components: { Multiselect },
    mixins: [formMixin, utils],
    data() {
      return {
        step: 1,
        model: {},
        installations: [],
      };
    },
    mounted() {
      this.resetValues();
      this.provinces = this.getProvinces();
      this.permits = this.getPermits();
    },
    methods: {
      async submit(values) {
        if (this.step === 1) {
          this.model.name = values.name;
          this.model.last_name = values.last_name;
          this.model.email = values.email;
          this.model.business_name = values.business_name;
          this.model.business_phone = values.business_phone;
          this.model.business_nif = values.nif;
          this.model.property_dni = values.property_dni;
          this.model.property_phone = values.property_phone;
        }
        if (this.step === 2) {
          this.model.bank_code = values.bank_code;
          this.model.holder_name = values.holder_name;
          this.model.iban_number = values.iban_number;
          this.model.file_date = values.file_date;
          this.model.file_document = values.file_document;
        }

        if (this.step == 3) {
          const inst = values.installations;
          for (let index = 0; index < this.installations.length; index++) {
            const element = this.installations[index];
            element.name = inst[index].name;
            element.address = inst[index].address;
            element.province_id = inst[index].province_id;
            element.auditable_id = inst[index].auditor_id.auditor.id;
            element.file_document = _.isEmpty(element.file_document)
              ? inst[index].file_document
              : element.file_document;
          }
        }
        if (this.step == 4) {
          const inst = values.installations;
          for (let index = 0; index < this.installations.length; index++) {
            const responsible = inst[index].responsible;
            console.log(responsible.last_name, responsible.file_certification);
            this.installations[index].responsible.name = responsible.name;
            this.installations[index].responsible.last_name =
              responsible.last_name;
            this.installations[index].responsible.position =
              responsible.position;
            this.installations[index].responsible.phone_number =
              responsible.phone_number;
            this.installations[index].responsible.date_firm =
              responsible.date_firm;
            this.installations[index].responsible.date_certification =
              responsible.date_certification;
            this.installations[index].responsible.file_certification =
              responsible.file_certification;
            this.installations[index].responsible.dni = responsible.dni;
            this.installations[index].responsible.email = responsible.email;
            this.installations[
              index
            ].responsible.driver_document = responsible.driver
              ? responsible.driver_document
              : responsible.driver_document;
            this.installations[
              index
            ].responsible.driver_document_date = responsible.driver
              ? responsible.driver_document_date
              : responsible.driver_document_date;
            this.installations[
              index
            ].responsible.adr_permit_id = responsible.driver
              ? responsible.adr_permit_id
              : responsible.adr_permit_id;
          }
        }
        if (this.step !== 4) {
          this.step++;
        } else {
          this.model.file_document_bas64 = await this.toBase64(
            this.model.file_document[0]
          );
          this.model.file_date = this.formatDate(this.model.file_date);
          for (let index = 0; index < this.installations.length; index++) {
            const inst = this.installations[index];

            this.installations[
              index
            ].responsible.date_certification = this.formatDate(
              inst.responsible.date_certification
            );

            this.installations[index].file_document_bas64 = await this.toBase64(
              inst.file_document[0]
            );
            this.installations[
              index
            ].responsible.file_certification_bas64 = await this.toBase64(
              inst.responsible.file_certification[0]
            );

            if (inst.responsible.driver) {
              console.log("driver");
              this.installations[
                index
              ].responsible.driver_document_bas64 = await this.toBase64(
                inst.responsible.driver_document[0]
              );
              this.installations[
                index
              ].responsible.file_certification.driver_document_date = this.formatDate(
                inst.responsible.file_certification.driver_document_date
              );
            }
          }

          this.loader = true;
          this.model.installations = this.installations;
          try {
            const response = await service.store(this.model);
            console.log(response);
            this.$swal("EXITO", "formulario", "success").then(()=>{
              this.resetValues()
              this.$emit('close')
              this.$emit('reload')
            });
          } catch (err) {
            if (
              !_.isEmpty(err.response) &&
              _.isEmpty(err.response.status == 422)
            ) {
              this.$swal(
                "Error  en los datos",
                err.response.data.message,
                "error"
              );
              this.setApiValidation(err.response.data.errors);
            } else {
              this.$swal("Error", "formulario", "error").then(() => {
                this.loader = false;
              });
            }
          }
          this.loader = false;
        }
      },
      prevStep() {
        if (this.step <= 0) {
          return;
        }

        this.step--;
      },
      async fetchItems(search) {
        if (_.isEmpty(search)) {
          return {};
        }
        const response = await adminService.getUsers(
          "name=" + search + "&role_id=3&includes[]=auditor"
        );
        return response.data.data;
      },
      remove(id) {
        let position = 0;
        let position_item = 0;

        _.mapKeys(
          this.installations,
          (inst, key) => {
            if (key == id) {
              position_item = position;
            }
            position++;
          },
          position_item,
          id
        );

        this.installations.splice(position_item, 1);
      },
      handlePush() {
        this.installations.push({
          name: "",
          auditor_id: "",
          province_id: "",
          file_document: "",
          responsible: {
            name: "",
            last_name: "",
            position: "",
            phone_number: "",
            date_certification: "",
            file_certification: "",
            email: "",
            dni: "",
            dangerous_goods: false,
            driver: false,
            driver_document: "",
            driver_document_date: "",
            adr_permit_id: "",
          },
        });
      },
      handleClose() {
        this.resetValues();
        this.$emit("close");
      },
      resetValues() {
        this.step = 1;
        this.installations = [];
        this.installations.push({
          name: "",
          auditable_id: "",
          province_id: "",
          address: "",
          file_document: "",
          responsible: {
            name: "",
            last_name: "",
            position: "",
            phone_number: "",
            date_certification: "",
            file_certification: "",
            email: "",
            dni: "",
            dangerous_goods: false,
            driver: false,
            driver_document: "",
            driver_document_date: "",
            adr_permit_id: "",
          },
        });
        this.model = {
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
          file_document: "",
        };
      },
    },
    computed: {
      percent() {
        return (this.step * 100) / 4;
      },
    },
  };
</script>
