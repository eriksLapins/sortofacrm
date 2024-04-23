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
      <draggable v-model="form.fields" item-key="position">
        <template #item="{ element, index }">
          <li class="grid gap-4 pt-4">
            <div class="flex gap-4 w-full">
              <UiButton
                class="w-max text-sm"
                :class="{
                  hidden: defaultFieldsList.includes(element.key)
                }"
                error-variant
                @click.prevent="deleteField(index)"
              >
                Remove field
              </UiButton>
              <div v-if="generalError && element.key === ''" class="text-error-border text-left">
                {{ generalError.field }}
              </div>
            </div>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <UiTextInput
                v-model="element.position"
                label="Position"
                :name="`field-position-${index}`"
                disabled
              />
              <UiTextInput
                v-model="element.title"
                label="Field name"
                :name="`field-name-${index}`"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.title"
                :disabled="defaultFieldsList.includes(element.key)"
                @update:model-value="setFieldKey(index)"
              />
              <UiTextInput
                v-model="element.key"
                label="Field key"
                :name="`module-key-${index}`"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.key"
                disabled
              />
              <!-- @vue-ignore -->
              <UiSelect
                v-model="element.type"
                :items="fieldTypeItems"
                :name="`field-type-${index}`"
                label="Field type"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.type"
                :disabled="defaultFieldsList.includes(element.key)"
                @update:model-value="element.valueType = undefined; form.fields[index].additional = {}; getFieldValueItems(element.type, index)"
              />
              <UiSelect
                :ref="`fieldValue${index}`"
                v-model="element.valueType"
                :items="getFieldValueItems(element.type, index)"
                :name="`field-value-type-${index}`"
                label="Field value type"
                :disabled="defaultFieldsList.includes(element.key) || !element.type || fieldValueTypeMap[element.type as EFieldType].length === 1"
                :hide-cross="!element.type || fieldValueTypeMap[element.type as EFieldType].length === 1"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.valueType"
              />
              <div v-if="getAdditionalFieldType(element.type, element.valueType)?.name === 'arrayValueType'" class="flex flex-col gap-2">
                <UiSelect
                  v-model="element.additional.arrayValueType"
                  :items="fieldValueItemsArrayType"
                  :name="`field-addditionals-${element.type}-${element.valueType}-${index}`"
                  :label="getAdditionalFieldType(element.type, element.valueType)?.inputLabel"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
                <UiCheckbox
                  v-model="element.additional.multiselect"
                  :name="`field-addditionals-${element.type}-${element.valueType}-multiselect-${index}`"
                  label="Multiselect?"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
              </div>
              <div
                v-else-if="getAdditionalFieldType(element.type, element.valueType)?.name === 'defaultValue'"
                class="flex flex-col gap-2"
              >
                <UiSelect
                  v-if="element.type === 'checkbox' || element.type === 'switch'"
                  v-model="element.additional.defaultValue"
                  :items="fieldValueItemsCheckboxDefaults"
                  :name="`field-addditionals-${element.type}-${element.valueType}-${index}`"
                  :label="getAdditionalFieldType(element.type, element.valueType)?.inputLabel"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
                <UiTextInput
                  v-else
                  v-model="(element.additional.defaultValue as string | number | undefined)"
                  :name="`field-addditionals-${element.type}-${element.valueType}-multiselect-${index}`"
                  :label="getAdditionalFieldType(element.type, element.valueType)?.inputLabel"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
              </div>
              <div v-else-if="element.type === 'fileUpload' || element.type === 'imageUpload'" class="flex gap-4">
                <UiTextInput
                  v-model="element.additional.maxFileSizeMb"
                  :name="`field-addditionals-${element.type}-${element.valueType}-max-size-${index}`"
                  :label="getAdditionalFieldType(element.type, element.valueType)?.inputLabel"
                  type="number"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
                <UiTextInput
                  v-model="element.additional.buttonTitle"
                  :name="`field-addditionals-${element.type}-${element.valueType}-button-title-${index}`"
                  label="Button title"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
                <UiCheckbox
                  v-model="element.additional.multipleFiles"
                  :name="`field-addditionals-${element.type}-${element.valueType}-multiple-${index}`"
                  label="Multiple?"
                  :disabled="defaultFieldsList.includes(element.key)"
                />
              </div>

              <!-- @vue-ignore -->
              <UiTextInput
                v-else-if="
                  getAdditionalFieldType(element.type, element.valueType)
                    &&
                    getAdditionalFieldType(element.type, element.valueType)!.name !== 'multiselect'
                "
                v-model="element.additional[getAdditionalFieldType(element.type, element.valueType)!.name]"
                :name="`field-addditionals-${element.type}-${element.valueType}-${index}`"
                :label="getAdditionalFieldType(element.type, element.valueType)?.inputLabel"
                :disabled="defaultFieldsList.includes(element.key)"
              />
              <UiTextInput
                v-else-if="getAdditionalFieldType(element.type, element.valueType)"
                v-model="(element.additional[getAdditionalFieldType(element.type, element.valueType)!.name] as string | number | undefined | null)"
                :name="`field-addditionals-${element.type}-${element.valueType}-${index}`"
                :label="getAdditionalFieldType(element.type, element.valueType)?.inputLabel"
                :disabled="defaultFieldsList.includes(element.key)"
              />
            </div>
            <UiCheckbox
              v-model="element.required"
              label="Required"
              :name="`field-required-${index}`"
              :disabled="defaultFieldsList.includes(element.key)"
            />
            <div class="separator" />
          </li>
        </template>
      </draggable>
    </ul>
    <UiButton :loading text="Add field" secondary class="w-full md:w-[300px]" @click="addField" />
  </div>
</template>

<script setup lang="ts">
import type { EFieldType } from '@prisma/client';
import draggable from 'vuedraggable';
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
    modelValue: ModuleSettingsForm;
    errors: ResponseError;
    generalError?: {
        main: string,
        field: string,
    };
    loading?: boolean;
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
    const [splicedField] = form.value.fields.splice(index, 1);
    for (const field of form.value.fields) {
        if (field.position > splicedField.position) {
            field.position -= 1;
        }
    }
}
</script>
