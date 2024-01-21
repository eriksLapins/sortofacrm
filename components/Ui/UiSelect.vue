<template>
  <div
    ref="optionList"
    class="relative flex flex-col"
    @click="checkClickOutside"
  >
    <input
      :id="name"
      v-model="setValue"
      type="text"
      :name="name"
      class="leweb-input h-6 py-1 px-2 rounded-lg"
      :class="{
        'leweb-input__error': !!error,
        'leweb-input__disabled' : disabled
      }"
      :placeholder="label"
      :disabled="disabled"
      @input="handleInput(setValue)"
      @click="handleInput(setValue)"
    >
    <div v-if="error" class="text-error-border">
      {{ error }}
    </div>
    <div v-if="setValue && !hideCross && !disabled" class=" absolute hover:cursor-pointer text-primary flex justify-center items-center h-6 right-0 mr-4 top-0 my-1" @click="clearItem">
      X
    </div>
    <ul v-show="showItems" class="absolute bg-white border-primary border-2 border-solid rounded-lg top-7 mt-2 p-2 grid gap-2 w-full z-10">
      <li
        v-for="item in options"
        :key="item.title"
        class="hover:cursor-pointer hover:bg-secondary h-8 p-2 flex gap-4 items-center rounded-lg border-2"
        :class="item.title === setValue ? 'border-primary' : 'border-transparent'"
        @click="handleSelectOption(item.title)"
      >
        <NuxtImg v-if="item.prependIcon" :src="item.prependIcon" width="30px" height="30px" />
        {{ item.title }}
        <NuxtImg v-if="item.appendIcon" :src="item.appendIcon" width="30px" height="30px" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useVModel } from '@vueuse/core';
import type { MultiSelect } from '~/types';
import { mapKeyToValue, mapValueToKey } from '~/utils/mappings';

defineOptions({
    name: 'UISelect'
});
const emit = defineEmits([
    'update:modelValue'
]);

const props = withDefaults(defineProps<{
    modelValue?: string | number | null;
    name: string;
    label?: string;
    type?: string;
    items: Prettify<MultiSelect[]>;
    prependIcon?: string;
    disabled?: boolean;
    hideCross?: boolean;
    filterOptions?: boolean;
    errors?: string;
}>(),
{
    modelValue: null,
    label: undefined,
    type: 'text',
    prependIcon: undefined,
    disabled: false,
    hideCross: false,
    filterOptions: false,
    errors: undefined
});

function clearItem () {
    setValue.value = null;
    emit('update:modelValue', setValue.value);
}

const modelValue = useVModel(props, 'modelValue', emit);

const error = ref(props.errors);

const setValue = ref<string | null>(mapKeyToValue(modelValue.value, props.items) || null);

const showItems = ref(false);
const options = ref(props.items);
const optionList = ref(null);

const handleInput = (input: string | null) => {
    const checkableInput = input || '';
    if (setValue && !props.filterOptions) {
        options.value = props.items;
    } else {
        options.value = props.items.filter(item => item.title.match(checkableInput));
    }
    showItems.value = true;
};

function checkClickOutside () {
    onClickOutside(optionList, () => {
        showItems.value = false;
    });
}

const handleSelectOption = (item: string) => {
    setValue.value = item;
    emit('update:modelValue', mapValueToKey(setValue.value, props.items));
    showItems.value = false;
};

watch(() => props.items, (newValue) => {
    if (!setValue.value) {
        setValue.value = mapKeyToValue(modelValue.value, newValue) || null;
    }
});

watch(() => modelValue.value, (newValue) => {
    error.value = undefined;
    if (props.items.length === 1) {
        setValue.value = props.items[0].title;
    } else if (!newValue) {
        setValue.value = null;
    }
});

watch(() => props.errors, (newValue) => {
    if (newValue) {
        error.value = newValue;
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
    &.leweb-input__disabled {
    box-shadow: 0 0 0 1px $color-gray-text-disabled;
    color: $color-gray-text-disabled;
    &.leweb-input__error {
        box-shadow: 0 0 0 2px $color-error-border;
    }
    }
}
</style>
