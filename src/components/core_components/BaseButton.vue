<template>
  <component
    :is="tag"
    :type="tag === 'button' ? nativeType : ''"
    @click="handleClick"
    class="btn"
    :class="classes"
    :disabled="disabled"
    ref="button"
    target="_blank"
  >
    <span
      class="btn-inner--icon"
      v-if="$slots.icon || (icon && $slots.default)"
    >
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </span>
    <i v-if="!$slots.default" :class="icon"></i>
    <span
      class="btn-inner--text"
      v-if="$slots.icon || (icon && $slots.default)"
    >
      <span v-if="loading">
        {{ loading_text }}
      </span>
      <slot v-else>
        {{ text }}
      </slot>
    </span>
    <slot v-if="!$slots.icon && !icon"></slot>
  </component>
</template>
<script>
export default {
  name: "base-button",
  inheritAttrs: true,
  props: {
    tag: {
      type: String,
      default: "button",
      description: "Button tag (default -> button)",
    },
    type: {
      type: String,
      default: "default",
      description: "Button type (e,g default, danger etc)",
    },
    size: {
      type: String,
      default: "",
      description: "Button size lg|sm",
    },
    textColor: {
      type: String,
      default: "",
      description: "Button text color (e.g default, danger etc)",
    },
    nativeType: {
      type: String,
      default: "button",
      description: "Button native type (e.g submit,button etc)",
    },
    icon: {
      type: String,
      default: "",
      description: "Button icon",
    },
    text: {
      type: String,
      default: "",
      description: "Button text in case not provided via default slot",
    },
    outline: {
      type: Boolean,
      default: false,
      description: "Whether button style is outline",
    },
    rounded: {
      type: Boolean,
      default: false,
      description: "Whether button style is rounded",
    },
    iconOnly: {
      type: Boolean,
      default: false,
      description: "Whether button contains only an icon",
    },
    block: {
      type: Boolean,
      default: false,
      description: "Whether button is of block type",
    },
    loading: {
      type: Boolean,
      default: false,
      description: "If button is loading",
    },
    loading_text: {
      type: String,
      default: 'Cargando...',
      description: "Text button when loading",
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      let btnClasses = [
        { "btn-block": this.block },
        { "rounded-circle": this.rounded },
        { "btn-icon-only": this.iconOnly },
        { [`text-${this.textColor}`]: this.textColor },
        { "btn-icon": this.icon || this.$slots.icon },
        this.type && !this.outline ? `btn-${this.type}` : "",
        this.outline ? `btn-outline-${this.type}` : "",
      ];
      if (this.size) {
        btnClasses.push(`btn-${this.size}`);
      }
      return btnClasses;
    },
  },
  methods: {
    handleClick(evt) {
      // evt.preventDefault();
      
      this.$emit("clicked", evt);
    },
    click() {
      this.$refs.button.click()
    }
  },
};
</script>
<style></style>
