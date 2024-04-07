<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - {{ $route.params.module }} - edit
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
            <!-- @vue-ignore - due to field.valueType = undefined -->
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
            <div v-if="getAdditionalFieldType(field.type, field.valueType)?.name === 'arrayValueType'" class="flex flex-col gap-2">
              <UiSelect
                v-model="field.additional.arrayValueType"
                :items="fieldValueItemsArrayType"
                :name="`field-addditionals-${field.type}-${field.valueType}-${index}`"
                :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
              />
              <UiCheckbox
                v-model="field.additional.multiselect"
                :name="`field-addditionals-${field.type}-${field.valueType}-multiselect-${index}`"
                label="Multiselect?"
              />
            </div>
            <div v-if="field.type === 'fileUpload' || field.type === 'imageUpload'" class="flex gap-4">
              <UiTextInput
                v-model="field.additional.maxFileSizeMb"
                :name="`field-addditionals-${field.type}-${field.valueType}-max-size-${index}`"
                :label="getAdditionalFieldType(field.type, field.valueType)?.inputLabel"
                type="number"
              />
              <UiTextInput
                v-model="field.additional.buttonTitle"
                :name="`field-addditionals-${field.type}-${field.valueType}-button-title-${index}`"
                label="Button title"
              />
              <UiCheckbox
                v-model="field.additional.multipleFiles"
                :name="`field-addditionals-${field.type}-${field.valueType}-multiple-${index}`"
                label="Multiple?"
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
            />
          </div>
          <UiCheckbox v-model="field.required" label="Required" :name="`field-required-${index}`" />
          <div class="separator" />
        </li>
      </ul>
      <UiButton text="Add field" secondary class="w-full md:w-[300px]" @click="addField" />
      <div class="separator" />
      <div v-if="!loading" class="flex justify-between">
        <UiButton
          class="self-center w-full md:w-[300px]"
          secondary
          @click="submit"
        >
          <span>Save</span>
        </UiButton>
        <UiButton popovertarget="before-delete" text="Delete Module" :error-variant="true" />
      </div>
      <LoadingAnimation v-else />
    </div>
    <div id="before-delete" popover class="border-2 border-primary border-solid w-[500px] p-6 backdrop:bg-[#00000099]">
      <div class="grid gap-4 items-center justify-center">
        <h2 class="font-bold">
          Are you sure you want to delete this module?
        </h2>
        <div>
          <p>
            Deleting this module also means deleting any and all data related to this module.
          </p>
          <UiButton
            :error-variant="true"
            text="Delete"
            @click="deleteModule"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EFieldType } from '@prisma/client';
import { UiSelect, UiTextInput } from '#components';
import type { ModuleFieldsAdjusted, ResponseError } from '~/types';

defineOptions({
    name: 'SettingsModuleEdit'
});

definePageMeta({
    layout: 'settings'
});

const route = useRoute();
const oldName = ref<string>();
const oldKey = ref<string>();
const oldFields = ref<ModuleFieldsAdjusted[]>([]);

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
            title: value.toUpperCase(),
            position: 0,
            visible: true
        };
    });
}

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

async function getModuleWithFields () {
    const { data } = await $fetch('/api/data/modules/getOne', {
        query: {
            module: route.params.module
        }
    });

    if (data) {
        oldKey.value = data.key;
        oldName.value = data.name;
        form.value.key = data.key;
        form.value.name = data.name;

        const { data: response } = await $fetch(`/api/data/${data.key}/field`);

        const jsonResponse = jsonParse(response);
        oldFields.value = jsonParse(jsonResponse) as ModuleFieldsAdjusted[];
        form.value.fields = jsonResponse;
    }
}

async function submit () {
    loading.value = true;
    formErrors.value = {};
    generalError.value = undefined;
    const fieldKeys: string[] = [];
    const fieldTitles: string[] = [];
    form.value.fields.forEach((field) => {
        if (field.title === '') {
            generalError.value = {
                main: 'Some fields are missing titles',
                field: 'Field is missing a title, please remove or input a title'
            };
        }
        if (fieldKeys.includes(field.key)) {
            formErrors.value = {
                data: {
                    fields: {
                        [`${field.key}`]: {
                            ...formErrors.value.data?.fields[field.key],
                            key: 'Duplicated field key'
                        }
                    }
                }
            };
        }
        fieldKeys.push(field.key);
        if (fieldTitles.includes(field.title)) {
            formErrors.value = {
                data: {
                    fields: {
                        [`${field.key}`]: {
                            ...formErrors.value.data?.fields[field.key],
                            title: 'Duplicated field title'
                        }
                    }
                }
            };
        }
        fieldTitles.push(field.title);
    });
    if (generalError.value) {
        loading.value = false;

        return;
    }

    if (formErrors.value.data) {
        loading.value = false;

        return;
    }

    if (form.value.name !== oldName.value || form.value.key !== oldKey.value) {
        try {
            const response = await $fetch('/api/data/modules', {
                method: 'PUT',
                body: {
                    oldName: oldName.value,
                    newName: form.value.name,
                    oldKey: oldKey.value,
                    newKey: form.value.key
                }
            });

            if (response.success) {
                oldName.value = form.value.name;
                oldKey.value = form.value.key;
            }
        } catch (e: any) {
            if (e.status === 400) {
                formErrors.value = { ...e.data.data.errors };
            } else if (e.status === 500) {
                loading.value = false;
                error500(e.data.message);
            } else {
                loading.value = false;
                error500('Something went wrong during module update');
            }
            loading.value = false;

            return;
        }
    }

    const deletedFields = oldFields.value.filter(field => !form.value.fields
        .filter(item => !!item.id)
        .map(item => item.id)
        .includes(field.id)
    );

    const newFields = form.value.fields.filter(field => !field.id);

    const updatedFields = form.value.fields
        .filter(field => field.id)
        .filter(field => !!oldFields.value.find(item => item.id === field.id))
        .filter((field: Record<string, any>) => {
            const previous = oldFields.value.find(item => item.id === field.id) as Record<string, any>;

            if (!previous) {
                return false;
            }

            return JSON.stringify(previous) !== JSON.stringify(field);
        });

    if (updatedFields.length) {
        updatedFields.forEach(async (field) => {
            try {
                await $fetch(`/api/data/${oldKey.value}/field`, {
                    method: 'PUT',
                    body: {
                        id: field.id,
                        key: field.key,
                        module: field.module,
                        required: field.required,
                        title: field.title,
                        type: field.type,
                        valueType: field.valueType,
                        additional: field.additional
                    }
                });
            } catch (e: any) {
                if (e.status === 400) {
                    generalError.value = e.data.message;
                    formErrors.value = { ...e.data.data.errors };
                    loading.value = false;

                    return;
                }
                console.log(e);
                loading.value = false;
                error500(e.data.message);
            }
        });
    }

    if (formErrors.value.data) {
        console.log(formErrors.value.data);
        loading.value = false;

        return;
    }

    if (newFields.length) {
        const mappedNewFields = newFields.map((field) => {
            return {
                ...field,
                module: oldKey.value
            };
        });
        try {
            await $fetch(`/api/data/${oldKey.value}/field`, {
                method: 'POST',
                body: {
                    fields: mappedNewFields

                }
            });
        } catch (e: any) {
            if (e.status === 400) {
                formErrors.value = { ...e.data.data.errors };
                loading.value = false;

                return;
            }
            console.log(e);
            loading.value = false;
            error500(e.data.message);
        }
    }

    if (formErrors.value.data) {
        loading.value = false;

        return;
    }

    if (deletedFields.length) {
        deletedFields.forEach(async (field) => {
            try {
                await $fetch(`/api/data/${oldKey.value}/field`, {
                    method: 'DELETE',
                    body: {
                        key: field.key
                    }
                });
            } catch (e: any) {
                if (e.status === 400) {
                    generalError.value = e.data.message;
                    loading.value = false;

                    return;
                }
                console.log(e);
                loading.value = false;
                error500(e.data.message);
            }
        });
    }

    if (formErrors.value.data) {
        loading.value = false;

        return;
    }

    loading.value = false;
    // otherwise prisma is being lazy and takes from the cache and no values change

    await getModuleWithFields();
}

async function deleteModule () {
    await $fetch('/api/data/modules', {
        method: 'DELETE',
        body: {
            module: route.params.module
        }
    });

    navigateTo('/settings/modules');
}

onMounted(async () => {
    await getModuleWithFields();
});

</script>

<style scoped>

</style>
