<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask bg-default opacity-8"></span>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-12">
          <card shadow type="secondary">
            <template v-slot:header>
              <div class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">Mi cuenta</h3>
                  </div>
                  <div class="col-4 text-right">
                    <a href="#!" class="btn btn-sm btn-default"
                      >Configuracion</a
                    >
                  </div>
                </div>
              </div>
            </template>

            <form>
              <h6 class="heading-small text-muted mb-4">
                Informacion de usuario
              </h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      :view="true"
                      name="email"
                      label="Email address"
                      :modelValue="u_data.email"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      :view="true"
                      name="first_name"
                      label="First name"
                      :modelValue="u_data.name"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      :view="true"
                      label="last_name"
                      :modelValue="u_data.last_name"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <!-- Address -->
              <h6 class="heading-small text-muted mb-4">Contact information</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-md-12">
                    <base-input
                      name=""
                      label="Address"
                      placeholder="Home Address"
                      input-classes="form-control-alternative"
                      :modelValue="model.address"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <base-input
                      name=""
                      :view="true"
                      label="City"
                      placeholder="Ciudad"
                      input-classes="form-control-alternative"
                      :modelValue="model.city"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      name=""
                      :view="true"
                      label="Pais"
                      placeholder="Country"
                      input-classes="form-control-alternative"
                      :modelValue="model.country"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      name=""
                      :view="true"
                      label="Postal code"
                      placeholder="Postal code"
                      input-classes="form-control-alternative"
                      :modelValue="model.zipCode"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <!-- Description -->
              <h6 class="heading-small text-muted mb-4">About me</h6>
              <div class="pl-lg-4">
                <div class="form-group">
                  <base-input name=""
                  :view="true" label="About Me">
                    <textarea
                      rows="4"
                      class="form-control form-control-alternative"
                      placeholder="A few words about you ..."
                    >
                      A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.
                    </textarea>
                  </base-input>
                </div>
              </div>
            </form>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import service from "../store/services/profile-service.js";
    export default {
      name: "user-profile",
      data() {
        return {
          model: {
            address: "Av samaniego",
            city: "Barcelona",
            country: "España",
            zipCode: "80151",
          },
          u_data: {}
        };
      },
      async beforeMount() {
        const u_data = await service.get()
        this.u_data = u_data.list.user
      },
    };
</script>
<style>
  .bg-gradient-blue {
    background: linear-gradient(87deg, #2d41ce 0, #0206ff 100%) !important;
  }
</style>
