<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-6 col-sm-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Login</small>
          </div>
          <form-validate @submit="handleSubmit()" v-slot="{meta, isSubmitting}">
            <base-field name="email" addon-left-icon="ni ni-email-83">
                <field-validate name="email" label="contraseña" type="email" class="form-control border-0 shadow pl-2" rules="required|email" placeholder="Email" v-model="model.email"></field-validate>
            </base-field>
            <base-field name="password" addon-left-icon="ni ni-lock-circle-open">
                <field-validate name="password" label="contraseña" type="password" class="form-control border-0 shadow pl-2" rules="required" placeholder="Password" v-model="model.password"></field-validate>
            </base-field>
            <div class="text-center">
                <base-button type="default" :disabled="!meta.valid || isSubmitting" nativeType="submit" class="my-4">
                    <div class="spinner-border text-light spinner-border-sm mr-2" v-if="isSubmitting" role="status">
                    </div>
                    <span>{{ isSubmitting ? 'Enviando' : 'Ingresar' }}</span>
                </base-button>
            </div>
          </form-validate>
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
          email: "",
          password: "",
        },
      };
    },
    mounted() {
        this.$store.commit('resetApiErrors')
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
