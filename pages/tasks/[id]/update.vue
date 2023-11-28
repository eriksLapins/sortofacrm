<template>
  <div>
    <TaskForm v-if="task" :task-id="(id as string)" :task-details="task" />
    <div v-else class="pt-48 mx-auto">
      <LoadingAnimation large-size />
    </div>
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
  const { data: tasks } = await $fetch('/api/data/tasks/get', {
    method: 'POST',
    body: {
      clientId: useUserStore().currentCompany,
      id
    }
  });

  const jsonResponse = JSON.parse(JSON.stringify(tasks));

  task.value = jsonResponse[0];
}

onBeforeMount(async () => {
  await fetchTaskById();
});

</script>

<style scoped>

</style>
