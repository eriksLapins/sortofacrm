<template>
  <label class="flex flex-col md:flex-row gap-2 items-start">
    <p class="md:w-1/3">{{ label }}</p>
    <input
      :id="name"
      v-model="value"
      type="date"
      :name="name"
      class="leweb-input h-6 py-1 px-2 rounded-lg md:w-2/3 flex items-center"
    >
  </label>
</template>

<script setup lang="ts">

defineOptions({
  name: 'UIDateInput'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String as PropType<String | null>,
    required: true
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
