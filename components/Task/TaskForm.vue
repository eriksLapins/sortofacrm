<template>
  <div class="w-full sm:max-w-[350px] flex flex-col justify-center items-center p-4">
    <form ref="taskForm" class="grid gap-6 items-start w-full" @submit.prevent="handleSubmit">
      <InputsSelect
        v-model:model-value="form.activityTypeId"
        :items="['something', 'something2', 'somethin']"
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
      <button class="border border-primary text-primary px-2 py-1 rounded hover:bg-primary focus-within:bg-primary hover:text-white focus-within:text-white outline-none" @click.prevent="handleSubmit">
        Login
      </button>
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

const handleSubmit = () => {
  console.log(form.value);
};

</script>

<style scoped>

</style>
