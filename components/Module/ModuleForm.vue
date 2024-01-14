<template>
  <div class="w-full flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="createModuleItem">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex gap-4">
          <UiSelect
            v-model="form.createdById"
            :items="userOptions"
            name="created-by"
          />
          <UiSelect
            v-model="form.updatedById"
            :items="userOptions"
            disabled
            name="updated-by"
          />
        </div>
        <div class="w-full md:w-2/3 flex flex-col gap-6">
          <UiTextInput
            v-model:model-value="form.title"
            name="title"
            label="Title"
            :errors="errors.form.title"
          />
          <UiTextInputArea
            :model-value="(form.description as string || undefined)"
            name="description"
            label="Description"
            class="h-[300px]"
            @update:model-value="value => form.description = value"
          />
        </div>
      </div>
      <UiButton text="Save" class="w-full md:max-w-[350px]" @click.prevent="createModuleItem" />
      <UiButton
        v-if="props.itemId"
        text="Back"
        class="w-full md:max-w-[350px]"
        as-link-button
        secondary
        :href="`/datasets/tasks/${props.itemId}/view`"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ModuleItems } from '@prisma/client';
import { useUserStore } from '~/store/userStore';
import type { ModuleFieldsAdjusted, MultiSelect } from '~/types';

defineOptions({
    name: 'ModuleForm'
});

const props = defineProps({
    itemId: {
        type: String,
        default: undefined
    },
    itemDetails: {
        type: Object as PropType<ModuleItems>,
        default: undefined
    },
    module: {
        type: String,
        required: true
    }
});

const errors = ref<Record<string, any>>({
    form: {}
});
const moduleFields = ref<Prettify<ModuleFieldsAdjusted>[]>([]);

const userStore = useUserStore();

const form = ref<Omit<ModuleItems, 'id'>>({
    createdOn: new Date(),
    updatedOn: new Date(),
    createdById: 0,
    updatedById: 0,
    title: '',
    description: '',
    module: props.module,
    data: {}
});

const userOptions = ref<MultiSelect[]>([]);

async function createModuleItem () {
    if (props.itemId) {
        try {
            const { data } = await $fetch(`/api/data/${props.module}/items/update`, {
                method: 'POST',
                body: {
                    ...form.value,
                    id: props.itemId,
                    updatedById: userStore.currentUserId,
                    updatedOn: new Date().toISOString(),
                    title: form.value.title,
                    description: form.value.description,
                    module: props.module
                }
            });

            form.value = data as unknown as ModuleItems;
        } catch (e: any) {
            console.log(e);
            errors.value = e.data.data.errors;
        }
    } else {
        try {
            const data = await $fetch(`/api/data/${props.module}/items/create`, {
                method: 'POST',
                body: {
                    ...form.value,
                    createdById: userStore.currentUserId,
                    updatedById: userStore.currentUserId
                }
            });
            form.value = data as unknown as ModuleItems;
        } catch (e: any) {
            errors.value = e.data.data.errors;
        }
    }
}

async function getModuleFields (module: string) {
    const data = await $fetch(`/api/data/${module}/field/get`);

    const jsonFields = jsonParse(data.data);

    moduleFields.value = jsonFields;
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
        form.value.createdById = userStore.currentUserId;
        form.value.updatedById = userStore.currentUserId;
    }
});

</script>

<style scoped>

</style>
