<template>
  <q-inner-loading dark label="Cargando..." :showing="(loader || isLoading)">
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
</template>
<script>
import { computed } from '@vue/runtime-core';
import { mapState, useStore } from 'vuex';
  export default {
    props: {
      isLoading: { //for manual loading
        type: Boolean,
        defaul: false
      },
      msg: {
        type: String,
        default: "Cargando..."
      } 
    },
    setup(props) {
      const store = useStore()
      const loader = computed(() => store.state.loader)

      return {
        loader
      }
    }
  };
</script>
<style>
  #loader {
    position: fixed;
    text-align: center;
    z-index: 10000000000000;
    top: 0;
    left: 0;
    background-color: #6e6e6e2a;
    width: 100%;
    height: 100%;
    align-items: center;
  }

  .q-inner-loading{
    background-color: #6e6e6e2a !important;
  }
</style>
