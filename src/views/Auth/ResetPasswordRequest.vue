<template>
  <div class="row justify-content-center">
    <div class="col-lg-5  col-lg-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Resetear password</small>
          </div>
          <form-validate @submit="handleReset()" v-slot="{meta, isSubmitting}">
            <base-field name="email" addon-left-icon="ni ni-email-83">
                <field-validate name="email" label="email" type="email" class="form-control border-0 shadow pl-2" rules="required|email" placeholder="Email" v-model="email"></field-validate>
            </base-field>
            <div class="text-center">
              <base-button type="default" :disabled="!meta.valid || isSubmitting" nativeType="submit" class="my-4">
                    <div class="spinner-border text-light spinner-border-sm mr-2" v-if="isSubmitting" role="status">
                    </div>
                    <span>{{ isSubmitting ? 'Enviando' : 'Enviar' }}</span>
                </base-button>
            </div>
          </form-validate>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6 text-white">
          <router-link to="/login" class="text-left"><small class="text-white">Volver al login</small></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
   
  export default {
    name: "reset",
    data() {
      return {
        email: '',
      };
    },
    methods: {
      async handleReset() {
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
      },
    }
  };
</script>
<style></style>