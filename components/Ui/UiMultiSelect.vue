<template>
  <div
    ref="optionList"
    class="w-full md:w-max"
    :class="{
      'pointer-events-none multiselect--disabled': disabled
    }"
    @click="checkClickOutside"
  >
    <slot name="prepend" />
    <div class="relative flex flex-col">
      <button v-if="asButton" class="w-8 h-8 rounded-full border-solid border-primary border-2 flex items-center justify-center hover:bg-primary hover:bg-opacity-30" @click.prevent="showInput = !showInput">
        <div class="text-primary font-bold flex justify-center items-center p-1 leading-none h-8 w-8">
          <IPlus v-if="!showInput" class="text-primary" />
          <IMinus v-else class="text-primary" />
        </div>
      </button>
      <div
        v-show="asButton ? showInput : true"
        :class="{
          'absolute mt-9': asButton
        }"
      >
        <div class="leweb-input h-8 py-1 px-2 rounded-lg w-full md:w-40">
          <input
            :id="name"
            v-model="setValue"
            type="text"
            class="h-full"
            :name="name"
            :placeholder="label"
            @input="handleInput(setValue)"
            @click="handleInput(setValue)"
          >
        </div>
        <div v-if="setValue" class=" absolute hover:cursor-pointer text-primary flex justify-center items-center h-6 right-0 mr-4 top-0 my-1" @click="clearInput">
          X
        </div>
        <ol
          v-show="showItems"
          class="bg-white border-primary border-2 border-solid rounded-lg top-7 mt-2 p-2 grid gap-2 w-full md:w-max md:min-w-[175px] z-10 max-h-80 overflow-y-scroll"
          :class="{
            absolute: !asButton
          }"
          @dragover.prevent="!!sortingMode"
        >
          <li v-if="options.length" class="flex justify-between border-b border-b-primary">
            <p v-if="!sortingMode" class="text-sm hover:cursor-pointer hover:underline p-2" @click="clearAllItems()">
              Clear all
            </p>
            <p v-if="!sortingMode" class="text-sm hover:cursor-pointer hover:underline p-2" @click="selectAllItems()">
              Select all
            </p>
            <p v-if="draggable && !sortingMode" class="text-sm hover:cursor-pointer hover:underline p-2" @click="sortingMode = true">
              Reorder
            </p>
            <p v-if="(draggable && sortingMode) || visibilityChanges" class="text-sm hover:cursor-pointer hover:underline p-2" @click="handleSaveClick()">
              Save
            </p>
            <p v-if="draggable && sortingMode" class="text-sm hover:cursor-pointer hover:underline p-2" @click="handleReturn">
              Return
            </p>
            <p v-if="(draggable && sortingMode) || visibilityChanges" class="text-sm hover:cursor-pointer hover:underline p-2" @click="handleReset">
              Reset
            </p>
          </li>
          <li
            v-if="!currentArray.length && !setValue"
            class="hover:cursor-pointer hover:bg-secondary h-8 p-2 flex gap-4 items-center rounded-lg border-2"
            :class="!currentArray.length ? 'border-primary' : 'border-transparent'"
          >
            undefined
          </li>
          <li
            v-for="item in options"
            :key="item.title"
            class="hover:cursor-pointer hover:bg-secondary h-8 p-2 flex gap-4 items-center rounded-lg border-2"
            :class="currentArray.includes(item.title) ? 'border-primary' : 'border-transparent'"
            :draggable="draggable && sortingMode"
            @click="sortingMode ? '' : handleSelectOption(item.title)"
            @dragstart="sortingMode ? startDrag($event, item) : null"
            @drag="sortingMode ? currentDragged = item : null"
            @dragenter.prevent="!!sortingMode"
            @dragover.prevent="sortingMode ? handleDragOver($event, item) : null"
          >
            <NuxtImg v-if="item.prependIcon" :src="item.prependIcon" width="30px" height="30px" />
            {{ item.title }}
            <NuxtImg v-if="item.appendIcon" :src="item.appendIcon" width="30px" height="30px" />
          </li>
          <li
            v-if="!options.length"
            class="h-8 p-2 flex gap-4 items-center text-gray-text"
          >
            No matching values found
          </li>
        </ol>
      </div>
    </div>
    <slot name="append" />
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import type { PropType } from 'vue';
import type { MultiSelect } from '~/types/MultiSelect';

defineOptions({
    name: 'UIMultiSelect'
});
const emit = defineEmits([
    'update:modelValue',
    'update:columnOrder',
    'update:saveColumns',
    'return',
    'reset'
]);

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
        type: Array as PropType<MultiSelect[]>,
        required: true
    },
    initialItems: {
        type: Array as PropType<MultiSelect[]>,
        required: true
    },
    prependIcon: {
        type: String,
        default: undefined
    },
    asButton: {
        type: Boolean
    },
    draggable: {
        type: Boolean
    },
    disabled: {
        type: Boolean
    }
});

const currentArray = ref<string[]>(mapArrayKeyToValue(props.modelValue, props.items));

const setValue = ref<string | null>(null);

const showItems = ref(props.asButton);
const showInput = ref(false);
const options = ref(props.items);
const optionList = ref(null);
const sortingMode = ref(false);
const currentDragged = ref<MultiSelect | null>(null);
const currentDraggedStartPosition = ref<number>(0);
const visibilityChanges = ref(false);

function clearInput () {
    setValue.value = null;
    handleInput('');
}

function clearAllItems () {
    currentArray.value = [];
    emit('update:modelValue', currentArray.value);
}

function selectAllItems () {
    currentArray.value = options.value.map((item) => {
        return item.title;
    });
    emit('update:modelValue', currentArray.value);
}

function clearItem (item: string) {
    currentArray.value = currentArray.value.filter(value => value !== item);
    emit('update:modelValue', currentArray.value);
}

const handleInput = (input: string | null) => {
    const checkableInput = input || '';
    options.value = props.items.filter(item => item.title.match(checkableInput));
    if (!props.asButton) {
        showItems.value = true;
    }
};

function checkClickOutside () {
    onClickOutside(optionList, () => {
        if (props.asButton) {
            showInput.value = false;
        } else {
            showItems.value = false;
        }
    });
}

function handleReturn () {
    sortingMode.value = false;
    emit('return');
}

function handleReset () {
    sortingMode.value = false;
    visibilityChanges.value = false;
    options.value = [...props.initialItems];
    currentArray.value = props.initialItems.filter(item => item.visible === true).map(item => item.title);
    emit('update:modelValue', mapArrayValueToKey(currentArray.value, props.initialItems));
}

const handleSelectOption = (item: string) => {
    visibilityChanges.value = true;
    if (currentArray.value.includes(item)) {
        clearItem(item);
    } else {
        currentArray.value.push(item);
    }

    emit('update:modelValue', mapArrayValueToKey(currentArray.value, props.items));
};

const startDrag = (event: DragEvent, item: MultiSelect) => {
    if (!event.dataTransfer) {
        return;
    }
    currentDraggedStartPosition.value = item.position;
    currentDragged.value = item;
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (event: DragEvent, item: MultiSelect) => {
    const currentDraggedPosition = currentDragged.value?.position;
    if (currentDraggedPosition === undefined) {
        return;
    }

    if (item.position === currentDraggedPosition) {
        return;
    }

    const y = event.clientY;
    // @ts-ignore
    const box = event.target?.getBoundingClientRect();

    const offset = y - box.top - box.height / 2;

    if (offset < 0) {
        options.value = options.value.map((listItem) => {
            if (!listItem.position) {
                return listItem;
            }
            if (listItem?.position > item.position) {
                listItem.position = listItem.position + 1;

                return listItem;
            } else if (listItem.position >= currentDraggedStartPosition.value) {
                return listItem;
            }

            return listItem;
        });

        // @ts-ignore
        options.value.find(object => object === currentDragged.value).position = item.position;

        item.position += 1;
    }

    if (offset > 0) {
        options.value = options.value.map((listItem) => {
            if (!listItem.position) {
                return listItem;
            }
            if (listItem?.position < item.position) {
                listItem.position = listItem.position - 1;

                return listItem;
            }

            return listItem;
        });

        // @ts-ignore
        options.value.find(object => object === currentDragged.value).position = item.position;

        item.position -= 1;
    }

    // @ts-ignore
    options.value.sort((a, b) => a.position - b.position);

    options.value.forEach((value, i) => {
        value.position = i;
    });

    emit('update:columnOrder', options.value);
};

function handleSaveClick () {
    sortingMode.value = false;
    emit('update:saveColumns', options.value);
    visibilityChanges.value = false;
}

watch(() => props.items, (newValue) => {
    if (!setValue.value) {
        options.value = newValue;
        currentArray.value = mapArrayKeyToValue(props.modelValue, newValue) || null;
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

.multiselect--disabled {
  background: white;
  & > * {
    opacity: 0.8;
  }
}
</style>
