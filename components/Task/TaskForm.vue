<template>
  <div class="w-full sm:max-w-[350px] flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="handleSubmit">
      <InputsSelect
        v-model:model-value="form.activityTypeId"
        :items="options"
        name="activity-type"
        label="Activity Type"
      />
      <InputsText
        v-model:model-value="form.title"
        name="title"
        label="Title"
      />
      <InputsText
        v-model:model-value="form.description"
        name="description"
        label="Description"
      />
      <UiButton text="Create" class="w-full" @click.prevent="handleSubmit" />
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

</script>

<style scoped>

</style>
