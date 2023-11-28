<template>
  <div>
    <a href="/tasks/create">Create Task</a>
    <div v-for="task in tasks" :key="task.id">
      <a :href="`/tasks/${task.id}/view`">{{ task.title }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';
const userStore = useUserStore();

const tasks = ref<Tasks[]>();

async function fetchTasks () {
  const { data } = await $fetch('/api/data/tasks/get', {
    method: 'POST',
    body: {
      clientId: userStore.currentCompany,
      createdById: userStore.currentUserId
    }
  });

  const jsonTasks = JSON.parse(JSON.stringify(data));

  tasks.value = jsonTasks;
}

onMounted(async () => {
  await fetchTasks();
});

</script>

<style scoped>

</style>
