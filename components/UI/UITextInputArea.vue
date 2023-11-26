<template>
  <textarea
    :id="name"
    v-model="value"
    :name="name"
    :autocomplete="autocomplete"
    class="leweb-input min-h-[200px] py-1 px-2 rounded-lg"
    :placeholder="label"
  />
</template>

<script setup lang="ts">

defineOptions({
  name: 'UITextInputArea'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String as PropType<string | undefined>,
    required: true,
    default: undefined
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: undefined
  },
  autocomplete: {
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
