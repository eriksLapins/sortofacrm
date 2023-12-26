<template>
  <div class="w-full flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="createModuleItem">
      <div class="flex flex-col md:flex-row gap-6">
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
import type { ModuleItems, Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';

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
    default: ''
  }
});

const errors = ref<Record<string, any>>({
  form: {}
});

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

onBeforeMount(() => {
  if (props.itemDetails) {
    form.value = {
      ...props.itemDetails
    };
  }
});

const userOptions = ref<{key: string, title: string}[]>([]);

async function createModuleItem () {
  if (props.itemId) {
    try {
      const { data } = await $fetch(`/api/data/${props.module}/update`, {
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
      const data = await $fetch('/api/data/tasks/create', {
        method: 'POST',
        body: {
          ...form.value,
          clientId: userStore.currentCompany,
          createdById: userStore.currentUserId,
          updatedById: userStore.currentUserId
        }
      });
      form.value = data as unknown as Tasks;
    } catch (e: any) {
      errors.value = e.data.data.errors;
    }
  }
}

onBeforeMount(async () => {
  if (!userStore.availableUsers.length) {
    await userStore.fetchUsers();
  }
  userOptions.value = userStore.availableUsers?.map((user) => {
    return {
      key: user.id,
      title: `${user.name} ${user.lastname}`
    };
  });
});

</script>

<style scoped>

</style>
