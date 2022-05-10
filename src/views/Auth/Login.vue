<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-6 col-sm-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Login</small>
          </div>
          <form role="form" @submit.prevent="handleSubmit()">
            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="model.email"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="model.password"
            >
            </base-input>

            <div class="text-center">
              <base-button type="default" class="my-4" @click="handleSubmit()"
                >Sign in</base-button
              >
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <!-- <div class="col-6">
          <a href="#" class="text-light"><small>O?</small></a>
        </div> -->
        <div class="col-6 text-right">
          <router-link to="/reset-password-request" class="text-light"
            ><small>Olvide mi contraseña</small></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
   
  export default {
    name: "login",
    data() {
      return {
        model: {
          email: "admin@dgsoft.com",
          password: "secret",
        },
      };
    },
    methods: {
      async handleSubmit() {
        console.log("click");
        const user = {
          email: this.model.email,
          password: this.model.password,
        };

        try {
          await this.$store.dispatch("auth/login", {
            user,
          });
        } catch (error) {
          await this.$swal("Error", "Credenciales invalidas!");
        }
      },
    },
  };
</script>
<style></style>
