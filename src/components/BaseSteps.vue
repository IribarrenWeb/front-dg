<template>
  <div :class="containerClassess">
    <ul :class="`nav nav-pills justify-content-center steps ${listClasses}`">
        <li class="nav-item" v-for="step in steps" :key="step.key">
            <a class="nav-link p-2" :class="[{'active': currentStep == step.number},{'disabled':!step.valid && currentStep != step.number}]" href="#" @click.prevent="handleClick(step)">
                <i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i> 
                {{step.title}}
            </a>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "base-steps",
  props: {
    steps: {
      type: Object,
      required: true,
    },
    currentStep: {
      required: true,
    },
    meta: {
      required:true
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
  methods: {
    handleClick(step){
      if (!step.vaild) {
        this.$toast.error('No puedes ir hasta que valides la información');
        return
      }
      if (typeof step.link != 'undefined' ) {
        this.$route.push(`/audit/${this.id}/page/${step.number}`);
      }
      this.$emit('step',step.number);
    }
  },
};
</script>
