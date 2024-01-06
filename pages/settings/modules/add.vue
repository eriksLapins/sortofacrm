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
          :errors="formErrors.data?.name"
          label="Module name"
          name="module-name"
          @update:model-value="setModuleKey"
        />
        <UiTextInput
          v-model="form.key"
          :errors="formErrors.data?.key"
          label="Module key"
          name="module-key"
          disabled
        />
      </div>
      <div class="separator" />
      <h2 class="font-bold text-base-plus">
        Fields
      </h2>
      <ul
        ref="fieldList"
        class="grid gap-4 border-solid border-primary rounded-lg"
        :class="{'border p-4': form.fields.length}"
      >
        <li v-for="(field, index) in form.fields" :key="index" class="grid gap-4">
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <UiTextInput
              v-model="field.title"
              label="Field name"
              :name="`field-name-${index}`"
              :errors="formErrors.data[field.key]?.title"
              @update:model-value="setFieldKey(index)"
            />
            <UiTextInput
              v-model="field.key"
              label="Field key"
              :name="`module-key-${index}`"
              :errors="formErrors.data[field.key]?.key"

              disabled
            />
            <!-- @vue-ignore -->
            <UiSelect
              v-model="field.type"
              :items="fieldTypeItems"
              :name="`field-type-${index}`"
              label="Field type"
              :errors="formErrors.data[field.key]?.type"
              @update:model-value="field.valueType = undefined; form.fields[index].additional = {}; getFieldValueItems(field.type, index)"
            />
            <UiSelect
              :ref="`fieldValue${index}`"
              v-model="field.valueType"
              :items="getFieldValueItems(field.type, index)"
              :name="`field-value-type-${index}`"
              label="Field value type"
              :disabled="!field.type || fieldValueTypeMap[field.type].length === 1"
              :hide-cross="!field.type || fieldValueTypeMap[field.type].length === 1"
              :errors="formErrors.data[field.key]?.valueType"
            />
            <UiTextInput
              v-if="getAdditionalFieldType(field.type, field.valueType)"
              v-model="field.additional[getAdditionalFieldType(field.type, field.valueType)!.name]"
              :name="`field-addditionals-${field.type}-${field.valueType}-${index}`"
              :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
            />
          </div>
          <UiCheckbox v-model="field.required" label="Required" :name="`field-required-${index}`" />
          <div class="separator" />
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
import { EFieldType, EFieldValueType } from '@prisma/client';
import { UiSelect, UiTextInput } from '#components';
import type { ModuleFieldsAdjusted, ResponseError } from '~/types';

defineOptions({
    name: 'ModulesAdd'
});

definePageMeta({
    layout: 'settings'
});

const form = ref({
    name: '',
    key: '',
    fields: [] as ModuleFieldsAdjusted[]
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

const fieldTemplate: ModuleFieldsAdjusted = {
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

function getAdditionalFieldType (fieldType: EFieldType, fieldValueType: EFieldValueType) {
    if (!fieldType || !fieldValueType) {
        return;
    }

    return additionalsTypeMap[fieldType][fieldValueType];
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
    formErrors.value = {};
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
        if (e.status === 400) {
            formErrors.value = { ...e.data.data.errors };
        } else if (e.status === 500) {
            error500(e.data.message);
        }

        error500('Something went wrong during module creation');
    }
}

</script>

<style scoped>

</style>
