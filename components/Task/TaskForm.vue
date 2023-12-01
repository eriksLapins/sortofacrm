<template>
  <div class="w-full flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="createTask">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-2/3 flex flex-col gap-6">
          <div class="flex flex-col gap-6">
            <UiSelect
              v-model:model-value="form.activityTypeId"
              :items="options"
              name="activity-type"
              label="Activity Type"
              class="w-full md:w-1/2"
            />
            <div class="flex flex-col md:flex-row gap-6">
              <UiDateSelect
                v-model:model-value="form.startDate"
                name="start-date"
                label="Start date"
                class="w-full md:w-1/2"
              />
              <UiDateSelect
                v-model:model-value="form.dueDate"
                name="due-date"
                label="Due date"
                class="w-full md:w-1/2"
              />
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-6">
            <UiCheckbox
              v-model:model-value="form.done"
              name="is-done"
              label="Done"
              class="w-full md:w-1/2"
            />
            <UiDateSelect
              v-model:model-value="form.doneOn"
              name="done-on"
              label="Done on"
              class="w-full md:w-1/2"
            />
          </div>
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
        <div class="w-full md:w-1/3 flex flex-col gap-6">
          <UiSelect
            v-model:model-value="form.managerId"
            :items="userOptions"
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
      <UiButton
        v-if="props.taskId"
        text="Back"
        class="w-full md:max-w-[350px]"
        as-link-button
        secondary
        :href="`/tasks/${props.taskId}/view`"
      />
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

const errors = ref<Record<string, any>>({
  form: {}
});

const userStore = useUserStore();

const form = ref<Omit<Tasks, 'id' | 'clientId'>>({
  createdOn: new Date(),
  updatedOn: new Date(),
  createdById: '',
  updatedById: '',
  // @ts-ignore
  startDate: null,
  dueDate: null,
  done: false,
  // @ts-ignore
  doneOn: null,
  managerId: null,
  quoteId: null,
  invoiceId: null,
  companyId: null,
  personId: null,
  projectId: null,
  title: '',
  description: '',
  activityTypeId: null
});

onBeforeMount(() => {
  if (props.taskDetails) {
    form.value = {
      ...props.taskDetails
    };
  }
});

const userOptions = ref<{key: string, title: string}[]>([]);

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

watch(() => form.value, (newValue) => {
  if (!newValue.done) {
    newValue.doneOn = null;
  } else if (newValue.doneOn === null) {
    // @ts-ignore
    form.value.doneOn = new Date().toISOString();
  }
}, { deep: true, immediate: true });

async function createTask () {
  if (props.taskId) {
    try {
      const { data } = await $fetch('/api/data/tasks/update', {
        method: 'POST',
        body: {
          ...form.value,
          id: props.taskId,
          clientId: userStore.currentCompany,
          updatedById: userStore.currentUserId,
          updatedOn: new Date().toISOString()
        }
      });

      form.value = data as unknown as Tasks;
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
