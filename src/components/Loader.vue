<template>
  <Transition name="fade">
    <div class="d-flex justify-content-center" id="loader">
      <div class="spinner-border" role="status"></div>
    </div>
  </Transition>
</template>
<script>
  export default {};
</script>
<style>
  #loader {
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    background-color: #00000038;
    width: 100%;
    height: 100%;
    align-items: center;
  }
</style>
