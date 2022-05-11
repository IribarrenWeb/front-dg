<template>
  <div>
    <form-validate @submit="onSubmit" ref="form" v-slot="{meta}" :initial-values="current_values">

      <div class="row border rounded border-light px-md-3 py-md-2">
        <div class="col-12">
          <h4>
            Datos generales
          </h4>
          <hr>
        </div>
        <div class="col-lg-4">
          <base-field label="Nombre">
            <field-validate class="form-control" name="name" label="nombre" rules="required|max:20|alpha_spaces" v-model="model.name"/>
          </base-field>
        </div>

        <div class="col-lg-4">
          <base-field name="last_name" label="Apellido">
            <field-validate class="form-control" name="last_name" label="apellido" rules="required|max:20|alpha_spaces" v-model="model.last_name"/>
          </base-field>
        </div>

        <div class="col-lg-4">
          <base-field name="delegate" label="Delegado">
              <div v-if="model.delegate != null">
                  <span class="mr-md-4 text-uppercase">{{model.delegate.user.name}} {{model.delegate.user.last_name}}</span>
                  <base-button @click="model.delegate = null" size="sm" type="default" :outline="true">Cambiar</base-button>
              </div>
              <div v-show="model.delegate == null">
                  <field-validate name="delegate" label="Delegado" :rules="{'required':model.delegate == null}" v-slot="{ field }" v-model="model.delegate">
                      <Multiselect
                          :searchable="true"
                          v-bind="field"
                          :min-chars="2"
                          :delay="1000"
                          :required="true"
                          :options="fetchItems"
                          ref="multiselect"
                          @select="model.delegate = $event"
                          :resolve-on-load="false"
                      >
                      </Multiselect>
                  </field-validate>
                  <base-button v-if="update" @click="reset('delegate')" size="sm" type="default" :outline="true">Cancelar</base-button>
              </div>
          </base-field>
        </div>

        <div class="col-lg-4">
          <base-field name="phone_number" label="Móvil">
            <field-validate class="form-control" name="phone_number" label="móvil" rules="required|min:7|max:15" v-model="model.phone_number"/>
          </base-field>
        </div>

        <div class="col-lg-4">
          <base-field name="dni" label="DNI">
            <field-validate class="form-control" name="dni" label="dni" rules="required|min:5|max:15|alpha_num" v-model="model.dni"/>
          </base-field>
        </div>

        <div class="col-lg-4">
          <base-field name="email" label="Email">
            <field-validate class="form-control" name="email" label="email" rules="required|email" v-model="model.email"/>
          </base-field>
        </div>

        <div class="col-lg-4">
          <base-field name="province_id" label="Provincia">
            <div v-if="update && !prov_update" class="d-flex">
              <input type="text" class="form-control mr-md-3" disabled :value="model.province.name">
              <base-button @click="prov_update = true" size="sm" type="default" :outline="true">Cambiar</base-button>
            </div>
            <div v-show="!update || prov_update">
              <field-validate class="form-control" as="select" name="province_id" :rules="{'required':!update || prov_update}" label="Provincia" v-model="model.province_id">
                  <option value="" selected>Selecciona una provincia</option>
                  <option v-for="province in provinces" :key="province.id" :value="province.id">{{province.name}}</option>
              </field-validate>
              <base-button v-if="update" @click="reset('province')" size="sm" type="default" :outline="true">Cancelar</base-button>
            </div>
          </base-field>
        </div>
      </div>

      <div class="row border rounded border-light px-md-3 py-md-2 mt-2 mt-md-3">
        <div class="col-12">
          <h4>
            Documentacion
          </h4>
          <hr>
        </div>
        <div class="col-lg-6">
          <base-field   name="file_certification" label="Documento de ceritificado">
              <div v-if="cert_document && !cer_update">
                  <a href="#" @click.prevent="getDocument(cert_document.id)" class="mr-md-4">{{cert_document.type.name}}</a>
                  <base-button @click="cer_update = true" size="sm" type="default" :outline="true">Cambiar</base-button>
              </div>
              <div v-show="!cert_document || cer_update">
                <field-validate class="form-control"  type="file" name="file_certification" :rules="{'required':!cert_document || cer_update, ext:['pdf']}" label="documento certificado" v-model="model.file_certification"/>
                <base-button v-if="update" @click="reset('file_cer')" size="sm" type="default" :outline="true">Cancelar</base-button>
              </div>
          </base-field>
        </div>

        <div class="col-lg-6">
          <base-field name="certification_date" label="Fecha certificado">
            <field-validate class="form-control" name="certification_date" type="date" label="Fecha certificado" rules="required" v-model="model.certification_date"/>
          </base-field>
        </div>

        <div class="col-lg-6">
          <base-field   name="file_firm" label="Documento de alta">
              <div v-if="firm_document && !firm_update">
                  <a href="#" @click.prevent="getDocument(firm_document.id)" class="mr-md-4">{{firm_document.type.name}}</a>
                  <base-button @click="firm_update = true" size="sm" type="default" :outline="true">Cambiar</base-button>
              </div>
              <div v-show="firm_update || !firm_document">
                <field-validate class="form-control" type="file" name="file_firm" :rules="{'required':firm_update || !firm_document, ext:['pdf']}" label="documento alta" v-model="model.file_firm"/>
                <base-button v-if="update" @click="firm_update = false" size="sm" type="default" :outline="true">Cancelar</base-button>
              </div>
          </base-field>
        </div>

        <div class="col-lg-6">
          <base-field name="firm_date" label="Fecha Alta">
            <field-validate class="form-control" name="firm_date" type="date" label="Fecha certificado" rules="required" v-model="model.firm_date"/>
          </base-field>
        </div>
      </div>

      <div class="d-flex justify-content-lg-end">
        <base-button
          type="default"
          nativeType="submit"
          size="sm"
          v-if="!update"
          :disabled="!meta.valid"
        >
          Enviar
        </base-button>
        <base-button
          type="default"
          nativeType="submit"
          size="sm"
          v-if="update"
          :disabled="!meta.valid || !meta.dirty"
        >
          Actualizar
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
  import dataService from "@/store/services/data-service";
  import _ from "lodash";
   
  import utils from "@/mixins/utils-mixin";
import { mapGetters } from 'vuex';
  export default {
    components: { Multiselect },
    mixins: [utils],
    name: "form-auditor",
    props: {
      id: {
        default: null,
        required: false
      },
    },
    data() {
      return {
        errors: {},
        api: "auditor",
        model: this.$store.getters.AUDITOR_SCHEMA,
        auditor: null,
        provinces: null,
        cer_update: false,
        firm_update: false,
        current_values: null,
        prov_update: null
      };
    },
    mounted() {
      this.$refs.form.resetForm('dirty')
      this.loadProvinces()
    },
    methods: {
      async onSubmit(values, { resetForm }) {
        let formData = new FormData();
        formData.append("name", this.model.name);
        formData.append("last_name", this.model.last_name);
        formData.append("email", this.model.email);
        formData.append("phone_number", this.model.phone_number);
        formData.append("dni", this.model.dni);
        formData.append("province_id", this.model.province_id);
        formData.append("delegate_id", this.model.delegate.id);
        formData.append("certification_date", this.model.certification_date);
        formData.append("firm_date", this.model.firm_date);

        if (_.isArray(this.model.file_certification)) {
          formData.append("file_certification", this.model.file_certification[0]);
        }

        if (_.isArray(this.model.file_firm)) {
          formData.append("file_firm", this.model.file_firm[0]);
        }

        let response = null
        try {
          if (!this.update) {
            response = await service.store(this.api, formData, true);
          }else{
            response = await service.update(this.api, this.auditor.id,formData, true);
          }
          if (response.status == 201) {
            if (!this.update) {
                resetForm();
                this.$emit("closeModal");
              }else{
                this.show(this.auditor.id)
              }
              this.$emit("resetTable");
          }
        } catch (err) {
         console.log(err);
        }
      },
      async loadProvinces(){
            const res = await dataService.getProvinces()
            this.provinces = res.data.data;
        },
      async fetchItems(search) {
        if (_.isEmpty(search)) {
          return {};
        }
        const res = await service.getIndex('delegate',`name=${search}&includes[]=user`);
        const data = res.data.data;
        let options = _.map(data, (delegate) => {
            return {value: delegate, label: `${delegate.user.name} ${delegate.user.last_name} - ${delegate.dni}`}
        })
        return options
      },
      async show(id){
        console.log(this.$refs)
        try {
          const response = await service.show(
            "auditor",
            id,
            "includes[]=province.city&includes[]=documents.type&includes[]=delegate.user"
          );
          const data = response.data.data
          this.setCurrent(data)
          this.auditor = this.COPY(data)
          this.model = this.COPY(data);
          this.model.name = this.model.user.name;
          this.model.last_name = this.model.user.last_name;
          this.model.email = this.model.user.email;
        } catch (err) {
          this.$emit('closeModal')
          console.log(err);
        }
      },
      setCurrent(data) {
        let current = null
        if(this.update){
          current = {
            name: data.user.name,
            last_name: data.user.last_name,
            certification_date: data.documents[0].document_date,
            delegate: data.delegate,
            file_firm: undefined,
            file_certification: undefined,
            // delegate_id: "",
            dni: data.dni,
            firm_date: data.documents[1].document_date,
            phone_number: data.phone_number,
            province_id: data.province_id,
            email: data.user.email,
          }

          this.cer_update = false;
          this.firm_update = false;
          this.current_values = null;
          this.prov_update = null;
        }
        this.current_values = current
      },
      reset(op){
        switch (op) {
          case 'delegate':
            this.model.delegate = this.COPY(this.auditor.delegate)
            break;
          case 'file_cer':
            this.model.file_certification = undefined 
            this.cer_update = false
            break;
          case 'file_firm':
            this.model.file_firm = undefined 
            this.firm_update = false
            break;
          case 'province':
            this.prov_update = false
            this.model.province_id = this.auditor.province_id
            break;
          default:
            break;
        }
      }
    },
    computed: {
      firm_document(){
        let doc = false;
        if (this.model.documents != null && _.isObject(this.model.documents)) {
            _.forEach(this.model.documents, (document) => {
              if(document.type.name == 'ALTA'){
                doc = document
                this.model.firm_date = doc.document_date
              }
            })
        }
        return doc;
      },
      cert_document(){
        let doc = false;
        if (this.model.documents != null && typeof this.model.documents == 'object') {
            _.forEach(this.model.documents, (document) => {
              if(document.type.name == 'CERTIFICADO'){
                doc = document
                this.model.certification_date = doc.document_date
              }
            })
        }
        return doc;
      },
      update(){
        return this.id != null 
      },
      ...mapGetters([
        'COPY'
      ])
    },
    watch: {
      id: {
        // the callback will be called immediately after the start of the observation
        handler (val) {
          if (val >= 1 && val != null) {
            this.show(val)
          }
        },
        immediate: true, 
      }
    }
  };
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
