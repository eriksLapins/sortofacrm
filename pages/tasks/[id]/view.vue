<template>
  <div v-if="loading" class="pt-48 mx-auto">
    <LoadingAnimation large-size />
  </div>
  <div v-else-if="task" class="container mx-auto pt-8">
    <ItemHeader
      module-name="tasks"
      :item="headerItem!"
    />
    <PageContent
      :title="task.title"
      :subtitle="task.description || undefined"
      :title-append="task.done ? 'Done' : undefined"
    >
      <div>
        {{ task }}
      </div>
    </PageContent>
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
const loading = ref(true);

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

    task.value = jsonTask[0];
    loading.value = false;
  } catch {
    throw new Error('Sorry, something went wrong');
  }
}

const headerItem = computed(() => {
  if (task.value) {
    return {
      id: task.value.id,
      updatedOn: task.value.updatedOn,
      createdBy: task.value.createdById,
      updatedBy: task.value.updatedById
    };
  }

  return undefined;
});

onBeforeMount(async () => {
  await fetchTaskById();
});

</script>

<style scoped>

</style>
