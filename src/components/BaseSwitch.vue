<template>
  <div
    class="form-group"
    :class="[
      { 'has-label': label || $slots.label },
    ]"
  >
    <div>
      <slot name="label">
        <label v-if="label" class="form-control-label">
          {{ label }}
          <span v-if="required">*</span>
        </label>
      </slot>
    </div>
    <label class="custom-toggle">
      <input type="checkbox" v-model="model" v-bind="$attrs" />
      <span class="custom-toggle-slider rounded-circle"></span>
    </label>
  </div>
</template>
<script>
  export default {
    name: "base-switch",
    inheritAttrs: false,
    props: {
      value: {
        type: Boolean,
        default: false,
        description: "Switch value",
      },
      required: {
        type: Boolean,
        description: "Whether input is required (adds an asterix *)",
      },
      label: {
        type: String,
        description: "Input label (text before input)",
      },
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        },
      },
    },
  };
</script>
<style></style>
