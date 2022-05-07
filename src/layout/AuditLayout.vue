<template>
  <div>
    <base-header class="py-5">
    </base-header>

    <div class="container py-5">
      <base-steps listClasses="p-3 border rounded border-ligth nav-fill" :steps="steps" :currentStep="currentStep" :meta="true"></base-steps>
      <div class="p-3 mt-3 border rounded border-ligth">
        <div class="text-center col-12">
            <h3 class="text-uppercase">Informe/Visita técnica instalaciones ADR</h3>
            <h4 class="text-muted text-uppercase">Real Decreto 97/2014</h4>
        </div>
        <router-view v-slot="{ Component, route }">
          <transition name="fade">
            <keep-alive>
              <component :is="Component" :key="route.path" :audit="audit" @next="handleNext" @prev="handlePrev" :currentStep="currentStep"/>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import service from "@/store/services/model-service";

  export default {
    data() {
      return {
        sidebarBackground: "blue", //vue|blue|orange|green|red|default,
        steps: [
          {
            number: 1,
            title: "1.Primero",
            link: "",
            valid: false
          },
          {
            number: 2,
            title: "2.Segundo",
            link: "",
            valid: false
          },
          {
            number: 3,
            title: "3.Tercero",
            link: "",
            valid: false
          },
          {
            number: 4,
            title: "4.Cuarto",
            link: "",
            valid: false
          },
          {
            number: 5,
            title: "5.Quinto",
            link: "",
            valid: false
          },
          {
            number: 6,
            title: "6.Sexto",
            link: "",
            valid: false
          },
          {
            number: 7,
            title: "7.Septimo",
            link: "",
            valid: false
          },
          {
            number: 8,
            title: "8.Octavo",
            link: "",
            valid: false
          },
          {
            number: 9,
            title: "9.Noveno",
            link: "",
            valid: false
          },
        ],
        currentStep: 1,
        audit: {}
      };
    },
    async beforeMount() {
      console.log(this.$route.params.id)
      console.log('hhahaha');
      await this.getAudit()
      await this.setSteps()
    },
    methods: {
      async getAudit() {
        const id = this.$route.params.id;
        try {
          const res = await service.show('audit',id);
          this.audit = res.data.data
          this.currentStep = this.audit.current_step
          console.log('ahjashjahsjahsjh');
          this.$router.push({name:`step.1`})
          this.$router.push({name:`step.${this.audit.current_step}`})
        } catch (err) {
          console.log(err);
        }
      },
      handleNext(evnt){
        for (let i = 0; i < this.steps.length; i++) {
          if (this.steps[i].number == evnt) {
            this.steps[i].valid = true
          }
        }
        this.currentStep += 1;
        this.$router.push({name: `step.${this.currentStep}`})
      },
      async handlePrev(){
        if (this.currentStep !== 1) {
          try {
            await service.update('audit', this.audit.id, {current_step: this.currentStep-1});
            this.currentStep -= 1
            this.$router.push({name:`step.${this.currentStep}`})
          } catch (err) {
            this.$toast.error('Error al cambiar de pagina');
          }
        }
      },
      next(step){
          this.$router.push({name:`step.${step}`})
      },
      setSteps(){
        const valids = this.audit.valid_step;
        for (let i = 0; i < valids; i++) {
            this.steps[i].valid = true
        }
      }
    },
  };
</script>
<style lang="scss"></style>
