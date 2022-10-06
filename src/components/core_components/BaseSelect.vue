<template>
  <div
    class=""
    :class="[
      { 'input-group': hasIcon },
      { 'has-danger': error },
      { focused: focused },
      { 'has-label': label || $slots.label },
      { 'has-success': valid === true },
      { 'has-danger': valid === false },
      formClasses,
    ]"
  >
    <slot name="label">
      <label v-if="label" class="form-control-label" :class="labelClasses">
        {{ label }}
        <span v-if="required">*</span>
      </label>
    </slot>

    <div v-if="addonLeftIcon || $slots.addonLeft" class="input-group-prepend">
      <span class="input-group-text">
        <slot name="addonLeft">
          <i :class="addonLeftIcon"></i>
        </slot>
      </span>
    </div>
    <select
      :value="modelValue"
      v-bind="$attrs"
      v-on="listeners"
      class="custom-select filter"
      :class="[
        { 'is-valid': valid === true },
        { 'is-invalid': valid === false },
        inputClasses,
      ]"
      :disabled="disabled"
    >
      <option selected :value="0">{{ defaultOption }}</option>
      <slot></slot>
    </select>
    <div v-if="addonRightIcon || $slots.addonRight" class="input-group-append">
      <span class="input-group-text">
        <slot name="addonRight">
          <i :class="addonRightIcon"></i>
        </slot>
      </span>
    </div>
    <slot name="infoBlock"></slot>
    <slot name="helpBlock">
      <div
        class="text-danger invalid-feedback"
        style="display: block"
        :class="{ 'mt-2': hasIcon }"
        v-if="error"
      >
        {{ error }}
      </div>
      <div
        class="text-danger invalid-feedback"
        style="display: block"
        :class="{ 'mt-2': hasIcon }"
        v-if="apiErrors"
      >
        <ul>
          <li v-for="error in apiErrors" :key="error.id">
            {{ error }}
          </li>
        </ul>
      </div>
    </slot>
  </div>
</template>
<script>
  export default {
    inheritAttrs: false,
    name: "base-select",
    props: {
      required: {
        type: Boolean,
        description: "Whether input is required (adds an asterix *)",
      },
      disabled: {
        type: Boolean,
        description: "Whether is valid",
        default: false,
      },
      valid: {
        type: Boolean,
        description: "Whether is valid",
        default: undefined,
      },
      apiErrors: {
        type: String,
        description: "Api Input error (below input)",
      },
      label: {
        type: String,
        description: "Input label (text before input)",
      },
      error: {
        type: String,
        description: "Input error (below input)",
      },
      formClasses: {
        type: String,
        description: "Form css classes",
      },
      labelClasses: {
        type: String,
        description: "Input label css classes",
      },
      inputClasses: {
        type: String,
        description: "Input css classes",
      },
      modelValue: {
        type: [String, Number],
        description: "Input value",
      },
      addonRightIcon: {
        type: String,
        description: "Addon right icon",
      },
      addonLeftIcon: {
        type: String,
        description: "Addont left icon",
      },
      type: {
        type: String,
        default: "text",
        description: "Input type",
      },
      rules: {
        type: String,
      },
      defaultOption: {
        type: String,
        description: "Addont left icon",
        default: "Selecciona...",
      },
    },
    data() {
      return {
        focused: false,
      };
    },
    computed: {
      listeners() {
        return {
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur,
        };
      },
      hasIcon() {
        const { addonRight, addonLeft } = this.$slots;
        return (
          addonRight !== undefined ||
          addonLeft !== undefined ||
          this.addonRightIcon !== undefined ||
          this.addonLeftIcon !== undefined
        );
      },
    },
    methods: {
      updateValue(evt) {
        let value = evt.target.value;
        this.$emit("update:modelValue", value);
        this.$emit("updated", value);
      },
      onFocus(value) {
        this.focused = true;
        this.$emit("focus", value);
      },
      onBlur(value) {
        this.focused = false;
        this.$emit("blur", value);
      },
      validation() {
        // let rules = this.rules.split('|')
      },
    },
  };
</script>
<style></style>
