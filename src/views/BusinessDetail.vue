<template>
  <div>
    <base-header type="gradient-default" class="py-5">
    </base-header>

    <div class="container-fluid mt-4">
      <div class="card" v-if="business != null">
        <table class="table table-responsive-xl table-sm table-bordered">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">DNI</th>
              <th scope="col">Email</th>
              <th scope="col">Movil</th>
              <th scope="col">CIF/NIF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ business.user.name }}</td>
              <td>{{ business.property_dni }}</td>
              <td>{{ business.user.email }}</td>
              <td>{{ business.property_phone }}</td>
              <td>{{ business.business_nif }}</td>
            </tr>
            <tr class="text-uppercase">
              <th scope="row">Nombre empresa</th>
              <th scope="row">Provincia</th>
              <th scope="row">Ciudad</th>
              <th scope="row">Pais</th>
              <th scope="row">Instalaciones</th>
            </tr>
            <tr>
              <td>{{ business.business_name }}</td>
              <td>{{ business.province.name }}</td>
              <td>{{ business.province.city.name }}</td>
              <td>ESPANA</td>
              <td>{{ business.installations_count }}</td>
            </tr>
            <tr class="text-uppercase">
              <th scope="row">Codigo postal</th>
              <th scope="row">Fecha de ALTA</th>
              <th colspan="3" scope="row">Documentacion</th>
            </tr>
            <tr>
              <td>{{ business.postal_code }}</td>
              <td>{{ formatDate(business.documents[0].document_date, 'en-GB') }}</td>
              <td colspan="3">
                <a
                  href="#"
                  @click.prevent="getDocument(business.documents[0].id)"
                  >
                  <i class="fa fa-file-pdf-o" aria-hidden="true"></i>
                  Documentacion
                </a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card" v-else>
        <h3>No hay resultados</h3>
      </div>

      <installation-table v-if="business != null" :business_id="business.id"></installation-table>
    </div>
  </div>
</template>
<script>
  import service from "../store/services/model-service";
  import utils from "@/mixins/utils-mixin";
import InstallationTable from './Tables/InstallationTable.vue';

  export default {
	components: { InstallationTable },
    mixins: [utils],
    data() {
      return {
        meta: {},
        business: null,
        id: "",
      };
    },
    async created() {
      this.id = this.$route.params.id;
      await this.getBusiness();
      this.$watch(
        () => this.$route.params,
        (toParams) => {
          this.id = toParams.id;
        }
      );
    },
    methods: {
      async getBusiness() {
        console.log("ejecutando");
        const id = this.id;
        const response = await service.show('business',id, 'includes[]=province.city&counts[]=installations&includes[]=documents');
        this.business = response.data.data;

        console.log(this.business);
      },
    },
  };
</script>
<style>
  #table-data {
    overflow: hidden;
    overflow-x: auto;
  }
</style>
