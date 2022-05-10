<template>
  <div :class="containerClassess">
      <div v-if="audit">
        <Carousel :settings="settings" ref="carousel" :breakpoints="breakpoints" >
          <Slide :class="`nav nav-pills justify-content-center ${listClasses}`" v-for="step in steps" :key="step">
            <li class="nav-item" >
                <a class="nav-link p-2 d-flex align-items-center text" :class="[{'active': currentStep == step.number},{'disabled':!step.valid}]" href="#" @click.prevent="handleClick(step)">
                    <i class="fa fa-check mr-2" aria-hidden="true" v-if="step.valid"></i> 
                    {{step.title}}
                </a>
            </li>
          </Slide>
          <template #addons="{ slidesCount }">
            <Navigation v-if="slidesCount > 1"/>
          </template>
        </Carousel>
      </div>

      <ul v-else :class="`nav nav-pills justify-content-center steps nav-fill ${listClasses}`">
          <li class="nav-item" v-for="step in steps" :key="step">
              <a class="nav-link p-2 d-flex align-items-center text-center justify-content-center" :class="[{'active': currentStep == step.number},{'disabled':!step.valid}]" href="#" @click.prevent="handleClick(step)">
                  <i class="fa fa-check mr-2" aria-hidden="true" v-if="step.valid"></i> 
                  {{step.title}}
              </a>
          </li>
      </ul>
  </div>
</template>
<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel,Slide, Navigation } from 'vue3-carousel';

export default {
  name: "base-steps",
  components: {
    Carousel,
    Navigation,
    Slide
  },
  props: {
    steps: {
      type: Object,
      required: true,
    },
    audit: {
      type: Boolean,
      required: false,
      default: false
    },
    currentStep: {
      required: true,
    },
    id: {
      required: false
    },
    containerClassess: {
      type: String
    },
    listClasses: {
      type: String
    }
  },
  data() {
    return {
      // carousel settings
      settings: {
        itemsToShow: this.steps.length > 10 ? 2.7 : 1,
        itemsToScroll: this.steps.length > 10 ? 2 : 1,
        snapAlign: 'center',
      },
      // breakpoints are mobile first
      // any settings not specified will fallback to the carousel settings
      breakpoints: {
        // 700px and up
        700: {
          itemsToShow: this.steps.length > 10 ? 2.7 : 2,
          itemsToScroll: this.steps.length > 10 ? 1 : 1,
          snapAlign: 'center',
        },
        768: {
          itemsToShow: this.steps.length > 10 ? 3.5 : 3,
          itemsToScroll: this.steps.length > 10 ? 1 : 1,
          snapAlign: 'center',
        },
        // 1024 and up
        1024: {
          itemsToShow: this.steps.length > 10 ? 6 : 3,
          itemsToScroll: this.steps.length > 10 ? 1 : 1,
          snapAlign: 'start',
        },
      }
    }
  },
  methods: {
    handleClick(step){
      let true1 = step.valid
      if (true1) {
        this.$emit('navigate',step.number);
      }else{
        this.$toast.error('No puedes ir hasta que valides la información');
        return
      }
    }
  },
  mounted() {
    if (this.audit) {
      this.$refs.carousel.slideTo(this.currentStep)
    }
  },
  watch: {
    // currentStep(newVal){
    //   // this.$refs.carousel.slideTo(newVal)
    // }
  }
};
</script>
<style>
.carousel__prev--in-active,
.carousel__next--in-active {
  display: none;
}
</style>