<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Resetear password</small>
          </div>
          <form role="form" @submit.prevent="handleReset()">
            <base-input formClasses="input-group-alternative mb-3" type="email" placeholder="Email" addon-left-icon="ni ni-email-83"
              v-model="model.email">
            </base-input>
            
            <base-input formClasses="input-group-alternative mb-3" type="number" placeholder="Codigo" addon-left-icon="ni ni-email-83"
              v-model="model.token">
            </base-input>

            <base-input formClasses="input-group-alternative mb-3" type="password" placeholder="Nueva contraseña" addon-left-icon="ni ni-email-83"
              v-model="model.password">
            </base-input>

            <base-input formClasses="input-group-alternative mb-3" type="password" @blur="validatePassword()" placeholder="Confirmar contraseña" addon-left-icon="ni ni-email-83"
              v-model="model.password_confirmation">
            </base-input>

            <div class="text-center">
              <base-button type="primary" :loading="loading" class="my-4"
                @clicked="handleReset()">
                <div class="spinner-border text-light" role="status" v-if="loading">
                  <span class="visually-hidden">Ejecutando...</span>
                </div>
                <span v-else>
                  Cambiar contrasena
                </span>
              </base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light"><small>Login</small></a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/reset-password-request" class="text-light"><small>Enviar codigo nuevamente</small></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import formMixin from "@/mixins/form-mixin";
  import _ from 'lodash'; 
  export default {
    name: "login",
    mixins: [formMixin],
    data() {
      return {
        model: {
          email: "",
          password: "",
          password_confirmation: '',
          token: ''
        },
        loading: false,
        passwordValid: false
      };
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.model.email = to.params.email
      })
    },
    methods: {
      async handleReset() {
        if (!this.validateInputs() || !this.passwordValid) {
          if (!this.passwordValid) {
            this.$toast.error('Las contrasenas no son iguales.')
          }else{
            this.$toast.error('Algunos campos estan vacios.')
          }
        }else{
          this.loading = true
          try {
            const response = await this.$store.dispatch('auth/resetPassword', this.model);
            console.log(response);
            this.$toast.success('Su contrasena se ha actualizado correctamente');
            this.$router.push('/login');
          } catch (err) {
            this.$toast.error(err.response.data.message)
          }
          this.loading = false
        }
      },
      validateInputs() {
        let count_empty = 0;
        _.forEach(this.model, element => {
          console.log(element);
          if (element == '' || typeof element == undefined || element == null) {
            count_empty += 1;
          }
        });

        return count_empty >= 1 ? false : true
      },
      validatePassword(){
        if (this.model.password_confirmation === this.model.password) {
          console.log(this.model.password_confirmation === this.model.password);
          this.passwordValid = true
        }else{
          this.passwordValid = false
        }
      }
    }
  };
</script>
<style></style>