<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-2">
      <input
        :id="name"
        v-model="value"
        :type="type"
        :name="name"
        :autocomplete="autocomplete"
        class="h-6 py-1 px-2 rounded-lg"
        :class="!!error ? 'leweb-input__error' : 'leweb-input'"
        :placeholder="label"
      >
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
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    required: true,
    default: null
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
  },
  type: {
    type: String,
    default: 'text'
  },
  errors: {
    type: String,
    default: undefined
  }
});

const error = computed(() => {
  if (value.value) {
    return undefined;
  }

  return props.errors;
});

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
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

    &__error {
      box-shadow: 0 0 0 2px $color-error-border;
    }
}
</style>
