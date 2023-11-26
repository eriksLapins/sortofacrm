<template>
  <div
    class="relative"
  >
    <input
      :id="name"
      v-model="value"
      type="text"
      :name="name"
      class="leweb-input h-8 py-1 px-2 rounded-lg"
      :placeholder="label"
      @input="handleInput(value)"
      @click="handleInput(value)"
      @focusin="handleInput(value)"
    >
    <ul v-show="showItems" ref="optionList" class="w-[350px] h-[350px] absolute bg-white border-primary border-2 border-solid rounded-lg mt-2">
      <li
        v-for="item in options"
        :key="item"
        class="hover:cursor-pointer hover:bg-secondary h-8 p-2 flex items-center rounded-lg border-2 border-transparent"
        :class="item === value ? 'border-primary border-2' : ''"
        @click="(e) => handleSelectOption(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

defineOptions({
  name: 'InputsText'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
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
  type: {
    type: String,
    default: 'text'
  },
  items: {
    type: Array as PropType<string[]>,
    required: true
  }
});

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

const showItems = ref(false);
const options = ref(props.items);
const optionList = ref(null);

const handleInput = (input: string | undefined) => {
  const checkableInput = input || '';
  options.value = props.items.filter(item => item.match(checkableInput));
  if (checkableInput.length) {
    showItems.value = true;
  }
};

const handleSelectOption = (item: string) => {
  if (value.value === item) {
    value.value = undefined;
  } else {
    value.value = item;
  }
  showItems.value = false;
  onClickOutside(optionList, (e) => {
    console.log(e);
    showItems.value = false;
  });
};

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
