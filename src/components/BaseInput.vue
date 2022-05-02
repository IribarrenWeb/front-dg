<template>
  <div :class="formClasses">
    <div
      class="form-group"
      :class="[
        { 'input-group': hasIcon },
        { 'has-danger': error },
        { focused: focused },
        { 'has-label': label || $slots.label },
        { 'has-success': valid === true },
        { 'has-danger': valid === false },
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
      <slot>
        <input
          :value="modelValue"
          v-bind="$attrs"
          v-on="listeners"
          class="form-control"
          :class="[
            { 'is-valid': valid === true },
            { 'is-invalid': valid === false },
            inputClasses,
          ]"
          aria-describedby="addon-right addon-left"
          :type="type"
          autocomplete="off"
          aria-autocomplete="both"
          aria-haspopup="false"
          :disabled="disabled"
          v-if="view"
        />
        <div v-else>
          <field-validate
            :disabled="disabled"
            :name="name"
            @update:modelValue="updateValue($event)"
            :rules="rules"
            class="form-control"
            :class="inputClasses"
            :label="label"
            :type="type"
            :value="modelValue"
            v-if="type != 'file' && type != 'select'"
          />
          <field-validate
            :disabled="disabled"
            v-else-if="type == 'select'"
            :name="name"
            @update:modelValue="updateValue($event)"
            :rules="rules"
            class="form-control"
            :label="label"
            as="select"
          >
            <slot name="options"></slot>
          </field-validate>
          <field-validate
            :disabled="disabled"
            v-else
            :name="name"
            @update:modelValue="updateValue($event)"
            :rules="rules"
            class="form-control"
            :label="label"
            :type="type"
          />
          <error-message-validate class="text-danger" :name="name" />
        </div>
      </slot>
      <div
        v-if="addonRightIcon || $slots.addonRight"
        class="input-group-append"
      >
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
  </div>
</template>
<script>
  export default {
    inheritAttrs: false,
    name: "base-input",
    props: {
      required: {
        type: Boolean,
        description: "Whether input is required (adds an asterix *)",
      },
      view: {
        type: Boolean,
        default: false,
      },
      rules: {
        type: String,
        default: "required",
      },
      valid: {
        type: Boolean,
        description: "Whether is valid",
        default: null,
      },
      disabled: {
        type: Boolean,
        description: "Whether is valid",
        default: false,
      },
      label: {
        type: String,
        description: "Input label (text before input)",
      },
      error: {
        type: String,
        description: "Input error (below input)",
      },
      apiErrors: {
        type: Object,
        description: "Api Input error (below input)",
        default: null
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
        default: "",
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
      name: {
        type: String,
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
        let value = evt;
        // let value = evt.target.value;
        this.$emit("update:modelValue", value);
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
