<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        <div v-if="!hideLabel" class="text-black text-sm font-semibold mb-1">
          {{ label }}
        </div>
        <input
          :id="name"
          v-model="value"
          :type="actualType || type"
          :name="name"
          :autocomplete="autocomplete"
          class="h-6 py-1 px-2 rounded-lg leweb-input"
          :class="{
            'leweb-input__error': !!error,
            'leweb-input__disabled' : disabled
          }"
          :placeholder="label"
          :disabled="disabled"
          @focusout="emit('focusout')"
        >
      </div>
      <div v-if="error" class="text-error-border">
        {{ error }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">

defineOptions({
    name: 'UITextInput'
});
const emit = defineEmits<{
  'update:modelValue': [value: string | number | null | undefined];
  'focusout': [];
}>();

const props = withDefaults(
    defineProps<{
        modelValue: string | number | null | undefined;
        name: string;
        label?: string;
        autocomplete?: string;
        type?: string;
        errors?: string;
        disabled?: boolean;
        hideLabel?: boolean;
    }>(),
    {
        modelValue: null,
        label: undefined,
        autocomplete: undefined,
        type: 'text',
        errors: undefined
    }
);

const error = ref(props.errors);

const value = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
});

const actualType = computed(() => {
    if (typeof value.value === 'number') {
        return 'number';
    }
});

watch(() => props.errors, (newValue) => {
    if (newValue) {
        error.value = newValue;
    }
});

watch(() => value.value, () => {
    error.value = undefined;
});

</script>

<style lang="scss">
@import "~/scss/theme/variables";

.leweb-input {
    & input:-internal-autofill-selected {
        background-color: #000 !important;
    }
    box-shadow: 0 0 0 1px $color-primary;
    &:focus {
        box-shadow: 0 0 0 2px $color-primary;
    }

    &.leweb-input__error {
        box-shadow: 0 0 0 2px $color-error-border;
    }

    &.leweb-input__disabled {
        box-shadow: 0 0 0 1px $color-gray-text-disabled;
        color: $color-gray-text-disabled;
        &.leweb-input__error {
            box-shadow: 0 0 0 2px $color-error-border;
        }
    }
}
</style>
