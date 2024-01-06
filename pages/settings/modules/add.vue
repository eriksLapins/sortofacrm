<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - Add
    </h1>
    <div class="flex flex-col gap-4 w-full">
      <div class="separator" />
      <h2 class="font-bold text-base-plus">
        Module
      </h2>
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <UiTextInput
          v-model="form.name"
          label="Module name"
          name="module-name"
          :errors="formErrors.data?.name"
          @update:model-value="setModuleKey"
        />
        <UiTextInput
          v-model="form.key"
          label="Module key"
          name="module-key"
          disabled
          :errors="formErrors.data?.key"
        />
      </div>
      <div class="separator" />
      <h2 class="font-bold text-base-plus">
        Fields
      </h2>
      <ul ref="fieldList" class="grid gap-4">
        <li v-for="(field, index) in form.fields" :key="index" class="grid gap-4">
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <UiTextInput
              v-model="field.title"
              label="Field name"
              :name="`field-name-${index}`"
              @update:model-value="setFieldKey(index)"
            />
            <UiTextInput v-model="field.key" label="Field key" :name="`module-key-${index}`" disabled />
            <!-- @vue-ignore -->
            <UiSelect v-model="field.type" :items="fieldTypeItems" :name="`field-type-${index}`" label="Field type" @update:model-value="field.valueType = undefined; getFieldValueItems(field.type, index)" />
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
      <UiButton text="Add field" secondary class="w-[300px]" @click="addField" />
      <div class="separator" />
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
import type { ResponseError } from '~/types';

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
const formErrors = ref<ResponseError>({});

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
    additional: {
        maxTextLength: undefined,
        maxFileCount: undefined,
        arrayValueType: undefined,
        passwordSafetyRegex: undefined,
        textPrepend: undefined
    }
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

function setFieldKey (index: number) {
    form.value.fields[index].key = sanitizeTitleToKey(form.value.fields[index].title);
}

async function submit () {
    form.value.fields.forEach((field) => {
        field.module = form.value.key;
    });
    try {
        await $fetch('/api/data/modules/create', {
            method: 'POST',
            body: {
                name: form.value.name,
                key: form.value.key,
                fields: form.value.fields
            }
        });
    } catch (e: any) {
        if ('errors' in e.data.data) {
            formErrors.value = { ...e.data.data.errors };
        }
    }
}

</script>

<style scoped>

</style>
