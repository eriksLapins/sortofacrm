<template>
  <div v-if="loading" class="pt-48 mx-auto">
    <LoadingAnimation large-size />
  </div>
  <div v-else-if="task" class="lg:container mx-auto py-8 px-6 md:px-8">
    <ItemHeader
      module-name="tasks"
      :item="headerItem!"
    />
    <PageContent
      :title="task.title"
      :title-append="task.done ? 'Done' : undefined"
    >
      <PageBlockStatic class="flex flex-col gap-4 lg:w-1/2 lg:border border-solid border-primary p-4">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <div class="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center">
              <div>Manager: {{ matchUserById(task.managerId) || 'unspecified' }}</div>
              <div class="flex gap-2">
                Task doers:
                <ul class="flex gap-2 items-center">
                  <li>doer 1</li>
                  <li>doer 2</li>
                </ul>
              </div>
            </div>
            <div>Activity type: {{ task.activityTypeId }}</div>
            <div class="text-sm">
              Starting date: {{ task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd') : 'not defined' }}
            </div>
            <div class="text-sm">
              To do until: {{ task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : 'not defined' }}
            </div>
          </div>
        </div>
        <div class="text-gray">
          {{ task.description }}
        </div>
      </PageBlockStatic>

      <pre>
          {{ task }}
        </pre>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';
import format from 'date-fns/format';
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

    task.value = jsonTask.tasks[0];
    loading.value = false;
  } catch (e) {
    console.log(e);
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
  if (!userStore.availableUsers.length) {
    await userStore.fetchUsers();
  }
});

</script>

<style scoped>

</style>
