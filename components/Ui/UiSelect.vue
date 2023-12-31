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
import { mapKeyToValue, mapValueToKey } from '~/utils/mappings';

defineOptions({
  name: 'UISelect'
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
  emit('update:modelValue', setValue.value);
}

const setValue = ref<string | null>(mapKeyToValue(props.modelValue, props.items) || null);

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
  setValue.value = item;
  emit('update:modelValue', mapValueToKey(setValue.value, props.items));
  showItems.value = false;
};

watch(() => props.items, (newValue) => {
  if (!setValue.value) {
    setValue.value = mapKeyToValue(props.modelValue, newValue) || null;
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
}
</style>
