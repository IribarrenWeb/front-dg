<template>
  <div>
    <click-outside-detection :is-open="isOpen" @clicked="closeDropDown()"></click-outside-detection>
    <div class="dropdown" :class="[
      { show: isOpen },
      { dropdown: direction === 'down' },
      { dropup: direction === 'up' },
      { dropdown: direction == 'custom' },
      { 'dropdown-custom': direction == 'custom' },
      dropClasses
    ]" aria-haspopup="true" :aria-expanded="isOpen" @click="toggleDropDown" v-click-outside="closeDropDown">
      <slot name="title">
        <a class="dropdown-toggle nav-link" :class="{ 'no-caret': hideArrow }" data-toggle="dropdown">
          <i :class="icon"></i>
          <span class="no-icon">{{ title }}</span>
        </a>
      </slot>
      <ul class="dropdown-menu mt-2" ref="menu" :class="[
        { 'dropdown-menu-right': position === 'right' },
        { show: isOpen },
        menuClasses,
      ]">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>
<script>
import ClickOutsideDetection from './ClickOutsideDetection.vue';
export default {
  components: { ClickOutsideDetection },
  name: "base-dropdown",
  props: {
    direction: {
      type: String,
      default: "down",
    },
    title: {
      type: String,
      description: "Dropdown title",
    },
    icon: {
      type: String,
      description: "Icon for dropdown title",
    },
    position: {
      type: String,
      description: "Position of dropdown menu (e.g right|left)",
    },
    menuClasses: {
      type: [String, Object],
      description: "Dropdown menu classes",
    },
    dropClasses: {
      type: [String, Object],
      description: "Dropdown menu classes",
    },
    hideArrow: {
      type: Boolean,
      description: "Whether dropdown arrow should be hidden",
    },
    appendToBody: {
      type: Boolean,
      default: true,
      description: "Whether dropdown should be appended to document body",
    },
    tag: {
      type: String,
      default: "li",
      description: "Dropdown html tag (e.g div, li etc)",
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleDropDown() {
      this.isOpen = !this.isOpen;
      this.$emit("change", this.isOpen);
    },
    closeDropDown() {
      this.isOpen = false;
      this.$emit("change", this.isOpen);
    },
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.$emit('open', val);
      }
    }
  }
};
</script>
<style>
.dropdown {
  list-style-type: none;
}

.dropdown .dropdown-toggle {
  cursor: pointer;
}

.dropdown-custom > .dropdown-menu {
  top: -70px;
  right: 60px;
}
</style>
