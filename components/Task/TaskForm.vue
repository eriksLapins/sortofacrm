<template>
  <div class="w-full flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="createTask">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-2/3 flex flex-col gap-6">
          <div class="flex flex-col md:flex-row gap-6">
            <UiSelect
              v-model:model-value="form.activityTypeId"
              :items="options"
              name="activity-type"
              label="Activity Type"
              class="w-full md:w-1/2"
            />
            <UiDateSelect
              :model-value="(form.dueDate as unknown as string || null )"
              name="due-date"
              label="Due date"
              class="w-full md:w-1/2"
              @update:model-value="value => form.dueDate = value"
            />
          </div>
          <div class="flex flex-col md:flex-row gap-6">
            <UiCheckbox
              v-model:model-value="form.done"
              name="is-done"
              label="Done"
              class="w-full md:w-1/2"
            />
            <UiDateSelect
              :model-value="(form.doneOn as unknown as string || null)"
              name="done-on"
              label="Done on"
              class="w-full md:w-1/2"
              @update:model-value="value => form.doneOn = value"
            />
          </div>
          <UiTextInput
            v-model:model-value="form.title"
            name="title"
            label="Title"
          />
          <UiTextInputArea
            :model-value="(form.description as string || undefined)"
            name="description"
            label="Description"
            class="h-[300px]"
            @update:model-value="value => form.description = value"
          />
        </div>
        <div class="w-full md:w-1/3 flex flex-col gap-6">
          <UiSelect
            v-model:model-value="form.managerId"
            :items="options"
            name="manager-id"
            label="Manager"
          />
          <UiSelect
            v-model:model-value="form.quoteId"
            :items="options"
            name="quote-id"
            label="Quote No"
          />
          <UiSelect
            v-model:model-value="form.invoiceId"
            :items="options"
            name="invoice-id"
            label="Invoice No"
          />
          <UiSelect
            v-model:model-value="form.companyId"
            :items="options"
            name="company-id"
            label="Company"
          />
          <UiSelect
            v-model:model-value="form.personId"
            :items="options"
            name="person-id"
            label="Person"
          />
          <UiSelect
            v-model:model-value="form.projectId"
            :items="options"
            name="project-id"
            label="Project No"
          />
        </div>
      </div>
      <UiButton text="Save" class="w-full md:max-w-[350px]" @click.prevent="createTask" />
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';

defineOptions({
  name: 'TaskForm'
});

const props = defineProps({
  taskId: {
    type: String,
    default: undefined
  },
  taskDetails: {
    type: Object as PropType<Tasks>,
    default: undefined
  }
});

const userStore = useUserStore();

const form = ref<Omit<Tasks, 'id' | 'clientId' | 'createdOn' | 'updatedOn'>>({
  // @ts-ignore
  createdById: props.taskDetails?.createdById,
  // @ts-ignore
  dueDate: formatDate(props.taskDetails?.dueDate) || null,
  done: props.taskDetails?.done || false,
  // @ts-ignore
  doneOn: formatDate(props.taskDetails?.doneOn) || null,
  managerId: props.taskDetails?.managerId || '',
  quoteId: props.taskDetails?.quoteId || '',
  invoiceId: props.taskDetails?.invoiceId || '',
  companyId: props.taskDetails?.companyId || '',
  personId: props.taskDetails?.personId || '',
  projectId: props.taskDetails?.projectId || '',
  title: props.taskDetails?.title || '',
  description: props.taskDetails?.description || '',
  activityTypeId: props.taskDetails?.activityTypeId || ''
});

const options = computed(() => {
  return [
    {
      title: 'something',
      key: '1'
    },
    {
      title: 'something2',
      key: '2'
    },
    {
      title: 'somethin',
      key: '3'
    }
  ];
});

function formatDate (date: Date | undefined | null) {
  if (!date) {
    return null;
  }

  const dateFormatted = new Date(date);

  return (`${dateFormatted.getFullYear()}-${dateFormatted.getMonth() + 1}-${dateFormatted.getDate()}`);
}

watch(form.value, (newValue) => {
  if (newValue.done && newValue.doneOn === null) {
    const date = new Date();
    const dateFormatted = formatDate(date);
    form.value.doneOn = dateFormatted;
  }
}, { deep: true });

async function createTask () {
  if (props.taskId) {
    const data = await $fetch('/api/data/tasks/update', {
      method: 'POST',
      body: {
        id: props.taskId,
        clientId: userStore.currentCompany,
        userId: userStore.currentUserId,
        ...form.value
      }
    });
    console.log(data);
  } else {
    const data = await $fetch('/api/data/tasks/create', {
      method: 'POST',
      body: {
        clientId: userStore.currentCompany,
        userId: userStore.currentUserId,
        ...form.value
      }
    });

    console.log(data);
  }
}

</script>

<style scoped>

</style>
