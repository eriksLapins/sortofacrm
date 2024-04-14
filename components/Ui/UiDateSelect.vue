<template>
  <label class="flex flex-col md:flex-row gap-2 items-start w-full">
    <p class="md:w-1/3">{{ label }}</p>
    <div class="leweb-input h-8 py-1 px-2 w-full rounded-lg md:w-2/3 flex items-center">
      <input
        :id="name"
        v-model="value"
        type="date"
        :name="name"
        class="w-full"
        @input="handleInput"
      >
    </div>
  </label>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import type { PropType } from 'vue';

defineOptions({
    name: 'UIDateInput'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: {
        type: String as PropType<string | null>,
        default: null
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

const value = ref<string | null>();

function handleInput () {
    if (value.value) {
        emit('update:modelValue', new Date(value.value).toISOString());
    } else {
        emit('update:modelValue', null);
    }
}

onMounted(() => {
    if (props.modelValue) {
        value.value = format(new Date(props.modelValue), 'yyyy-MM-dd');
    }
});

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        value.value = format(new Date(newValue), 'yyyy-MM-dd');
    } else {
        value.value = null;
    }
});
</script>

<style lang="scss">
@import "~/scss/theme/variables";

.leweb-input {
    box-shadow: 0 0 0 1px $color-primary;
    &:focus {
        box-shadow: 0 0 0 2px $color-primary;
    }
    &::-webkit-datetime-edit-wrapper {
        width: 100%;
    }
}
</style>
