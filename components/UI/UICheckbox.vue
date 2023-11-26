<template>
  <div class="flex gap-2 items-center">
    <input
      :id="name"
      v-model="value"
      type="checkbox"
      :name="name"
      class="w-4 h-4 border-solid border-primary border-2 rounded-md checked:bg-primary hover:cursor-pointer"
    >
    <label :for="name">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">

defineOptions({
  name: 'UICheckbox'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: undefined
  }
});

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});
</script>

<style lang="scss">
@import "~/scss/theme/variables";

.leweb-input {
    box-shadow: 0 0 0 1px $color-primary;
    &:focus {
        box-shadow: 0 0 0 2px $color-primary;
    }
}
</style>
