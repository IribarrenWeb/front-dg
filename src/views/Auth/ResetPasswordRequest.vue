<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Resetear password</small>
          </div>
          <form role="form" @submit.prevent="handleReset()">
            <base-input formClasses="input-group-alternative mb-3" placeholder="Email" addon-left-icon="ni ni-email-83"
              v-model="email">
            </base-input>

            <div class="text-center">
              <base-button type="default" :loading="loading" loading_text="Enviando..." class="my-4"
                @clicked="handleReset()">
                <div class="spinner-border text-light" role="status" v-if="loading">
                  <span class="visually-hidden">Enviado email...</span>
                </div>
                <span v-else>
                  Enviar codigo
                </span>
              </base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6 text-right">
          <router-link to="/login" class="text-left"><small>Login</small></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import formMixin from "@/mixins/form-mixin";
  export default {
    name: "login",
    mixins: [formMixin],
    data() {
      return {
        email: '',
        loading: false
      };
    },
    methods: {
      async handleReset() {
        console.log('click');
        if (this.email == '') {
          this.$toast.error('El campo email es requerido');
        } else {
          this.loading = true;
          try {
            const response = await this.$store.dispatch('auth/sendResetEmail', {
              email: this.email
            });
            this.$toast.success(response.data.message);
            this.$router.push({
              name: 'reset-password',
              params: {
                email: this.email
              }
            });
          } catch (err) {
            this.$toast.error(err.response.data.message);
          }
          this.loading = false;
        }
      },
    }
  };
</script>
<style></style>