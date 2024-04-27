<template>
  <LoadingAnimation v-if="loading" large-size />
  <div v-else class="flex flex-col gap-4 w-full">
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
      <draggable v-model="form.fields" item-key="position" @update="reorder">
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
                class="hidden"
              />
              <UiTextInput
                v-model="element.title"
                label="Field name"
                :name="`field-name-${index}`"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.title"
                :disabled="defaultFieldsList.includes(element.key)"
                @focusout="setFieldKey(index)"
              />
              <UiTextInput
                v-model="element.key"
                label="Field key"
                :name="`module-key-${index}`"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.key"
                disabled
              />
              <UiSelect
                v-model="element.type"
                :items="fieldTypeItems"
                :name="`field-type-${index}`"
                label="Field type"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.type"
                :disabled="defaultFieldsList.includes(element.key)"
                @update:model-value="(value) => {
                  element.valueType = undefined;
                  form.fields[index].additional = {};
                  getFieldValueItems(element.type, index)
                  if (value === 'dropdown') {
                    form.fields[index].additional = {
                      arrayValuesFrom: {
                        module: '',
                        keyField: '',
                        titleField: ''
                      }
                    }
                  }
                }
                "
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
              <UiSelect
                :ref="`fielWidth${index}`"
                v-model="element.width"
                :items="fieldWidthArray"
                :name="`field-width-${index}`"
                label="Field width"
                :disabled="defaultFieldsList.includes(element.key)"
                :hide-cross="!element.type || fieldValueTypeMap[element.type as EFieldType].length === 1"
                :errors="assertKeyInErrors(element.key) && formErrors.data?.fields[element.key]?.width"
              />
              <div class="flex flex-col gap-4">
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
                  v-if="getAdditionalFieldType(element.type, element.valueType)?.name === 'arrayValuesFrom'"
                  class="flex flex-col gap-2"
                >
                  <p class="font-semibold">
                    {{ getAdditionalFieldType(element.type, element.valueType)?.inputLabel }}
                  </p>
                  <template v-if="element.additional.arrayValuesFrom">
                    <UiSelect
                      v-model="element.additional.arrayValuesFrom.module"
                      :items="modulesList"
                      :name="`field-addditionals-array-values-from-module-${index}`"
                      label="Module"
                      :disabled="defaultFieldsList.includes(element.key)"
                      @update:model-value="(value) => {
                        if (['companies', 'users', 'departments'].includes(value)) {
                          element.additional.arrayValuesFrom.keyField = 'id';
                        }
                        if (value === 'companies') {
                          element.additional.arrayValuesFrom.titleField = 'shortname';
                        } else if (value === 'users') {
                          element.additional.arrayValuesFrom.titleField = 'initials';
                        } else if (value === 'departments') {
                          element.additional.arrayValuesFrom.titleField = 'name';
                        } else {
                          getAvailableModuleFields(value);
                          element.additional.arrayValuesFrom.keyField = '';
                          element.additional.arrayValuesFrom.titleField = '';
                        }
                      }"
                    />
                    <template
                      v-if="!['companies', 'users', 'departments'].includes(element.additional.arrayValuesFrom.module)"
                    >
                      <UiSelect
                        v-model="element.additional.arrayValuesFrom.keyField"
                        :items="availableModuleFields.find(item => item.module === element.additional.arrayValuesFrom.module)?.data || []"
                        :name="`field-addditionals-array-values-from-key-field-${index}`"
                        label="Key field"
                        :disabled="defaultFieldsList.includes(element.key)"
                      />
                      <UiSelect
                        v-model="element.additional.arrayValuesFrom.titleField"
                        :items="availableModuleFields.find(item => item.module === element.additional.arrayValuesFrom.module)?.data || []"
                        :name="`field-addditionals-array-values-from-title-field-${index}`"
                        label="Title field"
                        :disabled="defaultFieldsList.includes(element.key)"
                      />
                    </template>
                    <UiCheckbox
                      v-model="element.additional.multiselect"
                      :name="`field-addditionals-${element.type}-${element.valueType}-multiselect-${index}`"
                      label="Multiselect?"
                      :disabled="defaultFieldsList.includes(element.key)"
                    />
                  </template>
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
    <UiButton text="Add field" secondary class="w-full md:w-[300px]" @click="addField" />
  </div>
</template>

<script setup lang="ts">
import { EFieldWidth, type EFieldType, type Modules } from '@prisma/client';
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
    disableKeyUpdate?: boolean;
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

function reorder () {
    form.value.fields.forEach((field, index) => {
        field.position = index + 1;
    });
}

const loading = ref(true);

const availableModules = ref<Modules[]>([]);
const availableModuleFields = ref<{module: string; data: MultiSelect[]}[]>([
    {
        module: 'users',
        data: [
            {
                key: 'id',
                title: 'ID',
                position: 0,
                visible: true
            },
            {
                key: 'initials',
                title: 'Initials',
                position: 1,
                visible: true
            }
        ]
    },
    {
        module: 'departments',
        data: [
            {
                key: 'id',
                title: 'ID',
                position: 0,
                visible: true
            },
            {
                key: 'department',
                title: 'Name',
                position: 1,
                visible: true
            }
        ]
    },
    {
        module: 'companies',
        data: [
            {
                key: 'id',
                title: 'ID',
                position: 0,
                visible: true
            },
            {
                key: 'shortname',
                title: 'Shortname',
                position: 1,
                visible: true
            }
        ]
    }
]);

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

const fieldWidthArray: {key: keyof typeof EFieldWidth, position: number, title: string, visible: boolean}[] = [
    {
        key: 'full',
        title: 'FULL',
        position: 0,
        visible: true
    },
    {
        key: 'half',
        title: 'HALF',
        position: 1,
        visible: true
    },
    {
        key: 'third',
        title: 'THIRD',
        position: 2,
        visible: true
    },
    {
        key: 'fourth',
        title: 'HALF',
        position: 3,
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

async function getAvailableModules () {
    const modules = await $fetch('/api/data/modules');

    availableModules.value = jsonParse<Modules[]>(modules);
}

async function getAvailableModuleFields (module: string) {
    const exists = availableModuleFields.value.find(item => item.module === module);
    if (!exists) {
        const data = await $fetch(`/api/data/${module}/field`);
        const moduleFields = jsonParse<ModuleFieldsAdjusted[]>(data);

        const newData = moduleFields.map((item) => {
            return {
                key: item.key,
                title: item.title,
                position: item.position,
                visible: true
            };
        });

        availableModuleFields.value.push({
            module,
            data: newData
        });
    }
}

const modulesList = computed(() => {
    const modules: MultiSelect[] = availableModules.value.map((item, index) => {
        return {
            key: item.key,
            title: item.name,
            position: index + 2,
            visible: true
        };
    }) || [];

    return [
        {
            key: 'users',
            title: 'Users',
            position: 0,
            visible: true
        },
        {
            key: 'departments',
            title: 'Departments',
            position: 1,
            visible: true
        },
        {
            key: 'companies',
            title: 'Companies',
            position: 1,
            visible: true
        },
        ...modules
    ];
});

function setModuleKey () {
    if (!props.disableKeyUpdate) {
        form.value.key = sanitizeTitleToKey(form.value.name);
    }
}

function addField () {
    form.value.fields.push({
        ...fieldTemplate,
        position: form.value.fields.length + 1
    });
}

function setFieldKey (index: number) {
    if (!(props.disableKeyUpdate && form.value.fields[index].id)) {
        form.value.fields[index].key = sanitizeTitleToKey(form.value.fields[index].title);
    }
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

onMounted(async () => {
    await getAvailableModules();
    const dropdownFields = form.value.fields.filter(item => item.type === 'dropdown');
    if (dropdownFields.length) {
        for (const dropdown of dropdownFields) {
            await getAvailableModuleFields(dropdown.additional.arrayValuesFrom!.module);
        }
    }
    loading.value = false;
});
</script>
