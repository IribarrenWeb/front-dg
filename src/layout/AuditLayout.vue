<template>
  <div>
    <div class="container py-5">
      <base-steps containerClassess="border rounded border-ligth" listClasses="p-3 nav-fill" :audit="true" :steps="steps" @navigate="handleNavigate" :currentStep="currentStep" :meta="true" :id="audit.id"></base-steps>
      <div class="p-3 mt-3 border rounded border-ligth">
        <div class="text-center col-12">
            <h3 class="text-uppercase">Informe/Visita técnica instalaciones ADR</h3>
            <h4 class="text-muted text-uppercase">Real Decreto 97/2014</h4>
        </div>
        <div class="d-flex justify-content-center" v-if="typeof audit.id == 'undefined'">
            <div class="spinner-border" role="status">
            </div>
        </div>
        <router-view v-slot="{ Component, route }" v-else>
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
            title: "Datos",
            link: "",
            valid: false
          },
          {
            number: 2,
            title: "Contenido",
            link: "",
            valid: false
          },
          {
            number: 3,
            title: "Mercancías",
            link: "",
            valid: false
          },
          {
            number: 4,
            title: "Actividades",
            link: "",
            valid: false
          },
          {
            number: 5,
            title: "Comprobaciones",
            link: "",
            valid: false
          },
          {
            number: 6,
            title: "Empleo",
            link: "",
            valid: false
          },
          {
            number: 7,
            title: "Operaciones",
            link: "",
            valid: false
          },
          {
            number: 8,
            title: "Documentación",
            link: "",
            valid: false
          },
          {
            number: 9,
            title: "Verificación",
            link: "",
            valid: false
          },
          {
            number: 10,
            title: "Vehículos",
            link: "",
            valid: false
          },
          {
            number: 11,
            title: "No conforminades",
            link: "",
            valid: false
          },
          {
            number: 12,
            title: "Resultado",
            link: "",
            valid: false
          },
          {
            number: 13,
            title: "Consejeros",
            link: "",
            valid: false
          },
        ],
        currentStep: 1,
        audit: {}
      };
    },
    async beforeMount() {
      await this.getAudit()
      await this.setSteps()
    },
    methods: {
      async getAudit() {
        const id = this.$route.params.id;
        try {
          const res = await service.show('audit',id,
            'includes[]=materials&includes[]=review_materials&includes[]=comprobations&includes[]=installation.deposits&includes[]=installation.residues'+
            '&includes[]=vehicles&includes[]=installation.vehicles&includes[]=nonconformities'+
            '&includes[]=installation.operations&includes[]=installation.equipments'
          );
          this.audit = res.data.data
          this.currentStep = this.audit.current_step
          this.$router.push({name:`step.${this.audit.current_step}`})
        } catch (err) {
          console.log(err);
        }
      },
      handleNext(evnt){
        this.$store.commit('stopedCamera', true)
        for (let i = 0; i < this.steps.length; i++) {
          if (this.steps[i].number == evnt) {
            this.steps[i].valid = true
          }
        }

        if (evnt == 13) {
          this.$swal('Auditoria completada!', 'La auditoria se ha completado con exito.', 'success').then(()=> {
            this.$router.push({name: `auditorias`})
          })
        }else{
          this.currentStep += 1;
          this.$router.push({name: `step.${this.currentStep}`})
        }
      },
      async handlePrev(){
        if (this.currentStep !== 1) {
          try {
            await service.update('audit', this.audit.id, {current_step: this.currentStep-1});
            this.currentStep -= 1
            this.$router.push({name:`step.${this.currentStep}`})
          } catch (err) {
            this.$toast.error('Error al <i class="fa-solid fa-pencil"></i> de pagina');
          }
        }
      },
      async handleNavigate(step){
          try {
            await service.update('audit', this.audit.id, {current_step: step});
            this.currentStep = step
            this.$router.push({name:`step.${this.currentStep}`})
          } catch (err) {
            this.$toast.error('Error al <i class="fa-solid fa-pencil"></i> de pagina');
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
