<template>
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
            :class="{
              hidden: index < 6
            }"
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
            v-model="field.position"
            label="Position"
            :name="`field-position-${index}`"
            disabled
          />
          <UiTextInput
            v-model="field.title"
            label="Field name"
            :name="`field-name-${index}`"
            :errors="assertKeyInErrors(field.key) && formErrors.data?.fields[field.key]?.title"
            :disabled="index < 6"
            @update:model-value="setFieldKey(index)"
          />
          <UiTextInput
            v-model="field.key"
            label="Field key"
            :name="`module-key-${index}`"
            :errors="assertKeyInErrors(field.key) && formErrors.data?.fields[field.key]?.key"
            disabled
          />
          <!-- @vue-ignore -->
          <UiSelect
            v-model="field.type"
            :items="fieldTypeItems"
            :name="`field-type-${index}`"
            label="Field type"
            :errors="assertKeyInErrors(field.key) && formErrors.data?.fields[field.key]?.type"
            :disabled="index < 6"
            @update:model-value="field.valueType = undefined; form.fields[index].additional = {}; getFieldValueItems(field.type, index)"
          />
          <UiSelect
            :ref="`fieldValue${index}`"
            v-model="field.valueType"
            :items="getFieldValueItems(field.type, index)"
            :name="`field-value-type-${index}`"
            label="Field value type"
            :disabled="index < 6 || !field.type || fieldValueTypeMap[field.type].length === 1"
            :hide-cross="!field.type || fieldValueTypeMap[field.type].length === 1"
            :errors="assertKeyInErrors(field.key) && formErrors.data?.fields[field.key]?.valueType"
          />
          <div v-if="getAdditionalFieldType(field.type, field.valueType)?.name === 'arrayValueType'" class="flex flex-col gap-2">
            <UiSelect
              v-model="field.additional.arrayValueType"
              :items="fieldValueItemsArrayType"
              :name="`field-addditionals-${field.type}-${field.valueType}-${index}`"
              :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
              :disabled="index < 6"
            />
            <UiCheckbox
              v-model="field.additional.multiselect"
              :name="`field-addditionals-${field.type}-${field.valueType}-multiselect-${index}`"
              label="Multiselect?"
              :disabled="index < 6"
            />
          </div>
          <div
            v-else-if="getAdditionalFieldType(field.type, field.valueType)?.name === 'defaultValue'"
            class="flex flex-col gap-2"
          >
            <UiSelect
              v-if="field.type === 'checkbox' || field.type === 'switch'"
              v-model="field.additional.defaultValue"
              :items="fieldValueItemsCheckboxDefaults"
              :name="`field-addditionals-${field.type}-${field.valueType}-${index}`"
              :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
              :disabled="index < 6"
            />
            <UiTextInput
              v-else
              v-model="(field.additional.defaultValue as string | number | undefined)"
              :name="`field-addditionals-${field.type}-${field.valueType}-multiselect-${index}`"
              :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
              :disabled="index < 6"
            />
          </div>
          <div v-else-if="field.type === 'fileUpload' || field.type === 'imageUpload'" class="flex gap-4">
            <UiTextInput
              v-model="field.additional.maxFileSizeMb"
              :name="`field-addditionals-${field.type}-${field.valueType}-max-size-${index}`"
              :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
              type="number"
              :disabled="index < 6"
            />
            <UiTextInput
              v-model="field.additional.buttonTitle"
              :name="`field-addditionals-${field.type}-${field.valueType}-button-title-${index}`"
              label="Button title"
              :disabled="index < 6"
            />
            <UiCheckbox
              v-model="field.additional.multipleFiles"
              :name="`field-addditionals-${field.type}-${field.valueType}-multiple-${index}`"
              label="Multiple?"
              :disabled="index < 6"
            />
          </div>

          <!-- @vue-ignore -->
          <UiTextInput
            v-else-if="
              getAdditionalFieldType(field.type, field.valueType)
                &&
                getAdditionalFieldType(field.type, field.valueType)!.name !== 'multiselect'
            "
            v-model="field.additional[getAdditionalFieldType(field.type, field.valueType)!.name]"
            :name="`field-addditionals-${field.type}-${field.valueType}-${index}`"
            :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
            :disabled="index < 6"
          />
          <UiTextInput
            v-else-if="getAdditionalFieldType(field.type, field.valueType)"
            v-model="(field.additional[getAdditionalFieldType(field.type, field.valueType)!.name] as string | number | undefined | null)"
            :name="`field-addditionals-${field.type}-${field.valueType}-${index}`"
            :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
            :disabled="index < 6"
          />
        </div>
        <UiCheckbox
          v-model="field.required"
          label="Required"
          :name="`field-required-${index}`"
          :disabled="index < 6"
        />
        <div class="separator" />
      </li>
    </ul>
    <UiButton text="Add field" secondary class="w-full md:w-[300px]" @click="addField" />
  </div>
</template>

<script setup lang="ts">
import type { EFieldType } from '@prisma/client';
import type { ModuleFieldsAdjusted, MultiSelect, ResponseError } from '~/types';

defineOptions({
    name: 'ModuleSettingsForm'
});

type ModuleSettingsForm = {
        name: string,
        key: string,
        fields: ModuleFieldsAdjusted[],
    };

const props = defineProps<{
    modelValue: ModuleSettingsForm,
    errors: ResponseError,
    generalError?: {
        main: string,
        field: string,
    },
}>();
const emit = defineEmits<{
    'update:modelValue': [ModuleSettingsForm],
    'update:errors': [ResponseError]
}>();
const form = computed({
    get: () => props.modelValue,
    set: payload => emit('update:modelValue', payload)
});

const formErrors = computed({
    get: () => props.errors,
    set: payload => emit('update:errors', payload)
});

const fieldValueItemsArrayType = [
    {
        key: 'string',
        title: 'STRING',
        position: 0,
        visible: true
    },
    {
        key: 'number',
        title: 'NUMBER',
        position: 1,
        visible: true
    }
];

const fieldValueItemsCheckboxDefaults = [
    {
        key: true,
        title: 'Yes',
        position: 0,
        visible: true
    },
    {
        key: false,
        title: 'No',
        position: 1,
        visible: true
    }
];

const fieldList = ref();

function getFieldValueItems (fieldType: EFieldType, index: number): MultiSelect[] {
    if (!fieldType) {
        return [];
    }
    const currentArray = fieldValueTypeMap[fieldType];

    if (currentArray.length === 1) {
        form.value.fields[index].valueType = currentArray[0];
    }

    return currentArray.map((value, index) => {
        return {
            key: value as string,
            title: value.toUpperCase(),
            visible: true,
            position: index
        };
    });
}

function setModuleKey () {
    form.value.key = sanitizeTitleToKey(form.value.name);
}

function addField () {
    form.value.fields.push({
        ...fieldTemplate,
        position: form.value.fields.length
    });
}

function setFieldKey (index: number) {
    form.value.fields[index].key = sanitizeTitleToKey(form.value.fields[index].title);
}

function assertKeyInErrors (key: string) {
    if (formErrors.value.data?.fields) {
        return key in formErrors.value.data.fields;
    }
}

function deleteField (index: number) {
    form.value.fields.splice(index, 1);
}
</script>
