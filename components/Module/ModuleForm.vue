<template>
  <div class="w-full flex flex-col gap-4 justify-center items-center p-4">
    <form
      ref="taskForm"
      class="grid gap-6 items-start w-full"
      @submit.prevent="createModuleItem"
    >
      <div class="grid gap-6">
        <div v-if="form.id" class="flex flex-col gap-4">
          <div class="flex gap-4 justify-between max-md:flex-col">
            <div class="flex gap-4 order-2 md:order-1 max-sm:flex-col">
              <div class="flex gap-4">
                <div class="text-gray-text-disabled">
                  ID: {{ form.id }}
                </div>
                <div class="text-gray-text-disabled">
                  Created by: {{ matchUserById(form.createdById) }}
                </div>
              </div>
              <div class="text-gray-text-disabled">
                Created on: {{ format(new Date(form.createdOn), 'yyyy-MM-dd HH:MM') }}
              </div>
            </div>
            <UiButton
              v-if="props.itemId"
              text="Back"
              class="w-full max-w-[200px] h-max order-1 md:order-2 max-md:self-end"
              as-link-button
              secondary
              :href="`/datasets/tasks/${props.itemId}/view`"
            />
          </div>
          <div class="flex gap-4 max-sm:flex-col">
            <div class="text-gray-text-disabled">
              Last updated by: {{ matchUserById(form.updatedById) }}
            </div>
            <div class="text-gray-text-disabled">
              Last updated on: {{ format(new Date(form.updatedOn), 'yyyy-MM-dd HH:MM') }}
            </div>
          </div>
        </div>
      </div>
      <template v-for="field in moduleFields" :key="field.key">
        <div
          v-if="!(defaultFieldsList.includes(field.key as any))"
        >
          <component
            :is="getFieldComponent(field)?.component"
            v-bind="getFieldComponent(field)?.props"
            v-model="form.data[field.key]"
          />
        </div>
      </template>
    </form>
    <UiButton text="Save" class="w-full md:max-w-[350px]" @click.prevent="createModuleItem" />
  </div>
</template>

<script setup lang="ts">
import format from 'date-fns/format';

import {
    UiCheckbox,
    UiDateSelect,
    UiMultiSelect,
    UiSelect,
    UiTextInput,
    UiTextInputArea,
    UiUpload
} from '#components';
import { useUserStore } from '~/store/userStore';
import type { ModuleFieldsAdjusted, ModuleItemsAdjusted, MultiSelect } from '~/types';

defineOptions({
    name: 'ModuleForm'
});

const props = defineProps<{
    itemId?: string;
    itemDetails?: ModuleItemsAdjusted;
    module: string;
}>();

const errors = ref<Record<string, any>>({
    form: {}
});
const moduleFields = ref<Prettify<ModuleFieldsAdjusted>[]>([]);

const userStore = useUserStore();

const form = ref<ModuleItemsAdjusted>({
    createdOn: new Date(),
    updatedOn: new Date(),
    createdById: 0,
    updatedById: 0,
    module: props.module,
    data: {} as Record<string, ModuleFieldsAdjusted>
});

const userOptions = ref<MultiSelect[]>([]);

async function createModuleItem () {
    if (props.itemId) {
        try {
            const data = await $fetch(`/api/data/${props.module}/items`, {
                method: 'PUT',
                body: {
                    ...form.value,
                    id: props.itemId,
                    updatedById: userStore.currentUserId,
                    updatedOn: new Date().toISOString(),
                    module: props.module
                }
            });

            form.value = data as unknown as ModuleItemsAdjusted;
        } catch (e: any) {
            if (e.data) {
                errors.value = e.data.data.errors;
            }
        }
    } else {
        try {
            const data = await $fetch(`/api/data/${props.module}/items`, {
                method: 'POST',
                body: {
                    ...form.value,
                    createdById: userStore.currentUserId,
                    updatedById: userStore.currentUserId
                }
            });
            form.value = data as unknown as ModuleItemsAdjusted;
        } catch (e: any) {
            errors.value = e.data.data.errors;
        }
    }
}

async function getModuleFields (module: string) {
    const data = await $fetch(`/api/data/${module}/field`);

    const jsonFields = jsonParse<ModuleFieldsAdjusted[]>(data);
    jsonFields.sort((a, b) => a.position - b.position);

    moduleFields.value = jsonFields;
}

function getFieldComponent (field: ModuleFieldsAdjusted) {
    let component;
    let props;
    if (field.type === 'checkbox') {
        component = UiCheckbox;
        props = {
            name: 'Checkbox'
        };
    }

    if (field.type === 'text') {
        component = UiTextInput;
        props = {
            name: field.key,
            label: field.title,
            maxLength: field.additional.maxTextLength
        };
    }

    if (field.type === 'textarea') {
        component = UiTextInputArea;
        props = {
            name: field.key,
            label: field.title,
            maxLength: field.additional.maxTextLength
        };
    }

    if (field.type === 'checkbox') {
        component = UiCheckbox;
        props = {
            name: field.key,
            label: field.title
        };
    }

    if (field.type === 'number') {
        component = UiTextInput;
        props = {
            name: field.key,
            label: field.title,
            type: 'number'
        };
    }

    if (field.type === 'datepicker') {
        component = UiDateSelect;
        props = {
            name: field.key,
            label: field.title
        };
    }
    if (field.type === 'fileUpload') {
        component = UiUpload;
        props = {
            name: field.key,
            label: field.additional.buttonTitle,
            multiple: field.additional.multipleFiles
        };
    }
    if (field.type === 'imageUpload') {
        component = UiUpload;
        props = {
            name: field.key,
            label: field.additional.buttonTitle,
            multiple: field.additional.multipleFiles
        };
    }

    if (field.valueType === 'array' && !field.additional.multiselect) {
        component = UiSelect;
        props = {
            name: field.key,
            label: field.title,
            items: [
                {
                    key: 1,
                    title: 1,
                    position: 0,
                    visible: true
                },
                {
                    key: 2,
                    title: 2,
                    position: 0,
                    visible: true
                },
                {
                    key: 3,
                    title: 3,
                    position: 0,
                    visible: true
                },
                {
                    key: 4,
                    title: 4,
                    position: 0,
                    visible: true
                }
            ]

        };
    }

    if (field.valueType === 'array' && field.additional.multiselect) {
        component = UiMultiSelect;
        props = {
            name: field.key,
            label: field.title,
            items: [
                {
                    key: 1,
                    title: 1,
                    position: 0,
                    visible: true
                },
                {
                    key: 2,
                    title: 2,
                    position: 0,
                    visible: true
                },
                {
                    key: 3,
                    title: 3,
                    position: 0,
                    visible: true
                },
                {
                    key: 4,
                    title: 4,
                    position: 0,
                    visible: true
                }
            ]

        };
    }

    if (component) {
        return {
            component,
            props
        };
    }
}

onBeforeMount(() => {
    if (props.itemDetails) {
        form.value = {
            ...props.itemDetails
        };
    }
});

onBeforeMount(async () => {
    await getModuleFields(props.module);
    if (!userStore.availableUsers.length) {
        await userStore.fetchUsers();
    }
    userOptions.value = userStore.availableUsers?.map((user) => {
        return {
            key: user.id,
            title: `${user.name} ${user.lastname}`,
            position: 0,
            visible: true

        };
    });
    if (userStore.currentUserId) {
        if (!form.value.createdById) {
            form.value.createdById = userStore.currentUserId;
        }
        form.value.updatedById = userStore.currentUserId;
    }
});

</script>

<style scoped>

</style>
