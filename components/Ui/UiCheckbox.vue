<template>
  <div
    class="flex gap-2 items-center"
    :class="{
      'pointer-events-none': disabled
    }"
    :tabindex="disabled ? '-1': '0'"
  >
    <input
      :id="name"
      v-model="value"
      type="checkbox"
      :name="name"
      class="w-4 h-4 border-solid border-2 rounded-md text-white flex justify-center items-center text-base leading-none"
      :class="{
        'checkbox--checked' : symbol === 'check',
        'checkbox--question' : symbol === 'question',
        'checkbox--cross' : symbol === 'cross',
        'border-primary checked:bg-primary hover:cursor-pointer hover:bg-primary hover:bg-opacity-30': !disabled,
        'border-gray-text-disabled checked:bg-gray-text': disabled
      }"
    >
    <label :for="name">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">

defineOptions({
    name: 'UICheckbox'
});
const emit = defineEmits(['update:modelValue']);

const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      name: string;
      label?: string;
      symbol?: 'check' | 'cross' | 'question';
      disabled?: boolean;
    }>(),
    {
        modelValue: false,
        label: undefined,
        symbol: 'check',
        disabled: false
    }
);

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

.checkbox {
  &--checked:checked:before {
      content: '✓'
  }
  &--question{
    border-color: $color-accent;
    &:hover {
      background-color: lighten($color-accent, 70%);
    }
    &:checked {
      background-color: $color-accent;
      &:before {
          content: '?'
      }
    }
  }
  &--cross{
    border-color: $color-error-border;
    &:hover {
      background-color: $color-error-background;
    }
    &:checked {
      background-color: $color-error-border;
      &:before {
          content: 'X'
      }
    }
  }
}
</style>
