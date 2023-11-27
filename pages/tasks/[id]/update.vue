<template>
  <div>
    <TaskForm :task-id="(id as string)" :task-details="task" />
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';

defineOptions({
  name: 'UpdateTasksIndex'
});

const route = useRoute();
const id = route.params.id;
const task = ref<Tasks>();

async function fetchTaskById () {
  const response = await $fetch('/api/data/tasks/get', {
    method: 'POST',
    body: {
      clientId: useUserStore().currentCompany,
      id
    }
  });

  const jsonResponse = JSON.parse(JSON.stringify(response.tasks));

  task.value = jsonResponse[0];
}

onMounted(async () => {
  await fetchTaskById();
});

</script>

<style scoped>

</style>
