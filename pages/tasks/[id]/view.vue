<template>
  <div>
    <a :href="`/tasks/${id}/update`">Update</a>
    <button class="border-2 border-error-border p-2" @click.prevent="deleteTask">
      Delete task
    </button>
    <div>
      {{ task }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';

defineOptions({
  name: 'ViewTasksIndex'
});

const route = useRoute();
const id = route.params.id;

const userStore = useUserStore();
const task = ref<Tasks>();

async function fetchTaskById () {
  try {
    const { data } = await $fetch('/api/data/tasks/get', {
      method: 'POST',
      body: {
        clientId: userStore.currentCompany,
        createdById: userStore.currentUserId,
        id
      }
    });

    const jsonTask = JSON.parse(JSON.stringify(data));

    task.value = jsonTask;
  } catch {
    throw new Error('Sorry, something went wrong');
  }
}

async function deleteTask () {
  await $fetch('/api/data/tasks/delete', {
    method: 'POST',
    body: {
      clientId: userStore.currentCompany,
      id
    }
  });
  navigateTo('/tasks');
}

onBeforeMount(async () => {
  await fetchTaskById();
});

</script>

<style scoped>

</style>
