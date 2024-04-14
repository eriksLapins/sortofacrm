<template>
  <div class="flex flex-col">
    <div v-if="!hideLabel" class="text-black text-sm font-semibold mb-1">
      {{ label }}
    </div>
    <textarea
      :id="name"
      v-model="value"
      :name="name"
      :autocomplete="autocomplete"
      class="leweb-input min-h-[200px] py-1 px-2 rounded-lg"
      :placeholder="label"
    />
  </div>
</template>

<script setup lang="ts">

defineOptions({
    name: 'UITextInputArea'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string | undefined;
  name: string;
  label?: string;
  autocomplete?: string;
  hideLabel?: boolean;
}>();

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
