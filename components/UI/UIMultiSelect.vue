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
      :placeholder="label"
      @input="handleInput(setValue)"
      @click="handleInput(setValue)"
    >
    <div v-if="setValue" class=" absolute hover:cursor-pointer text-primary flex justify-center items-center h-6 right-0 mr-4 top-0 my-1" @click="clearItem">
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
import { onClickOutside } from '@vueuse/core';

defineOptions({
  name: 'UISelect'
});
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
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
    type: Array as PropType<{key: string, title: string, prependIcon?: string, appendIcon?: string}[]>,
    required: true
  },
  prependIcon: {
    type: String,
    default: undefined
  }
});

function clearItem () {
  setValue.value = null;
  currentArray.value = [];
  emit('update:modelValue', currentArray.value);
}

const currentArray = ref<string[]>(mapArrayKeyToValue(props.modelValue, props.items));

const setValue = ref<string | null>(null);

const showItems = ref(false);
const options = ref(props.items);
const optionList = ref(null);

const handleInput = (input: string | null) => {
  const checkableInput = input || '';
  options.value = props.items.filter(item => item.title.match(checkableInput));
  showItems.value = true;
};

function checkClickOutside () {
  onClickOutside(optionList, () => {
    showItems.value = false;
  });
}

const handleSelectOption = (item: string) => {
  currentArray.value.push(item);
  emit('update:modelValue', mapArrayValueToKey(currentArray.value, props.items));
  showItems.value = false;
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
