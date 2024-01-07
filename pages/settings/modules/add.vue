<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - Add
    </h1>
    <div v-if="generalError" class="text-error-border text-left w-full">
      {{ generalError.main }}
    </div>
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
          <div class="flex gap-4 w-full">
            <UiButton
              class="w-max text-sm"
              error-variant
              @click.prevent="deleteField(index)"
            >
              Remove field
            </UiButton>
            <div v-if="generalError && field.key === ''" class="text-error-border text-left">
              {{ generalError.field }}
            </div>
          </div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <UiTextInput
              v-model="field.title"
              label="Field name"
              :name="`field-name-${index}`"
              :errors="formErrors.data?.fields[field.key]?.title"
              @update:model-value="setFieldKey(index)"
            />
            <UiTextInput
              v-model="field.key"
              label="Field key"
              :name="`module-key-${index}`"
              :errors="formErrors.data?.fields[field.key]?.key"
              disabled
            />
            <!-- @vue-ignore -->
            <UiSelect
              v-model="field.type"
              :items="fieldTypeItems"
              :name="`field-type-${index}`"
              label="Field type"
              :errors="formErrors.data?.fields[field.key]?.type"
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
              :errors="formErrors.data?.fields[field.key]?.valueType"
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
      <UiButton text="Add field" secondary class="w-full md:w-[300px]" @click="addField" />
      <div class="separator" />
      <UiButton
        v-if="!loading"
        class="self-center w-full md:w-[300px]"
        secondary
        @click="submit"
      >
        <span>Save</span>
      </UiButton>
      <LoadingAnimation v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EFieldType } from '@prisma/client';
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
const generalError = ref();
const loading = ref(false);

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

function addField () {
    form.value.fields.push({ ...fieldTemplate });
}

function deleteField (index: number) {
    form.value.fields.splice(index, 1);
}

function setModuleKey () {
    form.value.key = sanitizeTitleToKey(form.value.name);
}

function setFieldKey (index: number) {
    form.value.fields[index].key = sanitizeTitleToKey(form.value.fields[index].title);
}

async function submit () {
    loading.value = true;
    formErrors.value = {};
    generalError.value = undefined;
    form.value.fields.forEach((field) => {
        if (field.title === '') {
            generalError.value = {
                main: 'Some fields are missing titles',
                field: 'Field is missing a title, please remove or input a title'
            };
        }
        field.module = form.value.key;
    });
    if (generalError.value) {
        return;
    }
    try {
        const response = await $fetch('/api/data/modules/create', {
            method: 'POST',
            body: {
                name: form.value.name,
                key: form.value.key,
                fields: form.value.fields
            }
        });

        if (response.success) {
            loading.value = false;
            navigateTo('/settings/modules', {
                external: true
            });
        }
    } catch (e: any) {
        if (e.status === 400) {
            formErrors.value = { ...e.data.data.errors };
        } else if (e.status === 500) {
            error500(e.data.message);
        } else {
            error500('Something went wrong during module creation');
        }
    }
    loading.value = false;
}

</script>

<style scoped>

</style>
