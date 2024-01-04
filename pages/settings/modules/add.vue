<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - Add
    </h1>
    <div class="flex flex-col gap-4 w-full">
      <UiTextInput v-model="form.name" label="Module name" name="module-name" @update:model-value="setModuleKey" />
      <UiTextInput v-model="form.key" label="Module key" name="module-key" disabled />
      <ul ref="fieldList" class="grid gap-4">
        <li v-for="(field, index) in form.fields" :key="index" class="grid gap-4">
          <div class="flex gap-4">
            <UiSelect v-model="field.type" :items="fieldTypeItems" :name="`field-type-${index}`" label="Field type" @update:model-value="field.valueType = null; getFieldValueItems(field.type, index)" />
            <UiSelect
              :ref="`fieldValue${index}`"
              v-model="field.valueType"
              :items="getFieldValueItems(field.type, index)"
              :name="`field-value-type-${index}`"
              label="Field value type"
              :disabled="!field.type || fieldValueTypeMap[field.type].length === 1"
              :hide-cross="!field.type || fieldValueTypeMap[field.type].length === 1"
            />
          </div>
          <UiCheckbox v-model="field.required" label="Required" :name="`field-required-${index}`" />
        </li>
      </ul>
      <UiButton text="Add field" secondary @click="addField" />
      <UiButton
        class="self-center w-full md:w-[300px]"
        text="Save"
        secondary
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EFieldType, type ModuleFields } from '@prisma/client';
import type { AdditionalsJson } from '~/types/AdditionalsJson';

defineOptions({
    name: 'ModulesAdd'
});

definePageMeta({
    layout: 'settings'
});

const form = ref({
    name: '',
    key: '',
    fields: [] as Omit<ModuleFields, 'id'>[]
});

const fieldList = ref();

const fieldTypeItems = Object.keys(fieldValueTypeMap).map((value) => {
    return {
        key: value,
        title: value.toUpperCase()
    };
});

function getFieldValueItems (fieldType: EFieldType, index: number) {
    if (!fieldType) {
        return [];
    }
    const currentArray = fieldValueTypeMap[fieldType];

    if (currentArray.length === 1) {
        form.value.fields[index].valueType = currentArray[0];
    }

    return currentArray.map((value) => {
        return {
            key: value,
            title: value.toUpperCase()
        };
    });
}

const fieldTemplate: Omit<ModuleFields, 'id'> = {
    key: '',
    module: '',
    required: false,
    title: '',
    // @ts-ignore
    type: undefined,
    // @ts-ignore
    valueType: undefined,
    additional: {} as AdditionalsJson
};

function addField () {
    form.value.fields.push({ ...fieldTemplate });
}

function sanitizeTitleToKey (stringToAlter: string) {
    let tempKey = stringToAlter.toLowerCase();
    tempKey = tempKey.replaceAll(' ', '_');
    for (const key in characterReplacementMap) {
        if (!tempKey.includes(key)) {
            continue;
        }

        tempKey = tempKey.replaceAll(key, characterReplacementMap[key]);
    }

    return tempKey;
}

function setModuleKey () {
    form.value.key = sanitizeTitleToKey(form.value.name);
}

async function submit () {
    form.value.fields.forEach((field) => {
        field.module = form.value.key;
    });
    await $fetch('/api/data/modules/create', {
        method: 'POST',
        body: {
            name: form.value.name,
            key: form.value.key,
            fields: form.value.fields
        }
    });
}

</script>

<style scoped>

</style>
