<template>
  <div class="w-full flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="handleSubmit">
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
              v-model:model-value="form.dueDate"
              name="due-date"
              label="Due date"
              class="w-full md:w-1/2"
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
          />
          <UiTextInputArea
            v-model:model-value="form.description"
            name="description"
            label="Description"
            class="h-[300px]"
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
      <UiButton text="Save" class="w-full md:max-w-[350px]" @click.prevent="handleSubmit" />
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';

defineOptions({
  name: 'TaskForm'
});
const form = ref<Omit<Tasks, 'id' | 'clientId' | 'createdById' |'createdOn' | 'updatedOn'>>({
  dueDate: null,
  done: false,
  doneOn: null,
  managerId: '',
  quoteId: '',
  invoiceId: '',
  companyId: '',
  personId: '',
  projectId: '',
  title: '',
  description: '',
  activityTypeId: ''
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

const handleSubmit = () => {
  console.log(form.value);
};

watch(form.value, (newValue) => {
  if (newValue.done && newValue.doneOn === null) {
    const date = new Date();
    const dateFormatted = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    form.value.doneOn = dateFormatted;
  }
}, { deep: true });

</script>

<style scoped>

</style>
