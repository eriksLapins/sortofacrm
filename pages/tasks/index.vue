<template>
  <div v-if="!tasks?.length">
    <LoadingAnimation />
  </div>
  <div v-else class="lg:container mx-auto py-8 px-6 md:px-8">
    <div class="flex w-full justify-end">
      <UiButton href="/tasks/create" as-link-button text="Create" />
    </div>
    <PageContent
      title="Tasks"
    >
      <UiMultiSelect
        v-model:model-value="columns"
        :items="columnList"
        label="Columns"
        name="task-columns"
        draggable
        @update:column-order="handleColumnOrderUpdate"
        @update:save-column-order="handleSaveColumnOrder"
      />
      <TablePreview
        v-if="tableTasks.length"
        :data-json="tableTasks"
        module="tasks"
      />
    </PageContent>
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

  tasks.value = jsonTasks.tasks;
}

const columns = ref<string[]>([]);

const columnList = ref<{key:string, title: string, position: number}[]>([]);

const tableTasks = computed(() => {
  if (tasks.value?.length) {
    const newTasks = tasks.value?.map((task: Record<string, any>) => {
      const object: {title: string, data: string, position: number | undefined}[] = [];
      columns.value.forEach((value) => {
        object.push({
          title: value,
          data: task[value],
          position: columnList.value.find(item => item.title === value)?.position
        });
      });

      return object;
    });

    return newTasks;
  }

  return [];
});

function handleColumnOrderUpdate (items: typeof columnList.value) {
  items.forEach((item) => {
    columnList.value[columnList.value.findIndex(column => item.key === column.key)].position = item.position;
  });
  columnList.value.sort((a, b) => a.position - b.position);
}

function handleSaveColumnOrder (items: typeof columnList.value) {
  console.log(items);
}

onBeforeMount(async () => {
  await fetchTasks();
  if (tasks.value) {
    columns.value = Object.keys(tasks.value[0]);
    if (tasks.value) {
      const taskItems = Object.keys(tasks.value[0]);

      columnList.value = taskItems.map((item) => {
        const index = taskItems.findIndex(value => value === item);

        return {
          key: item,
          title: item,
          position: index
        };
      });
    }
  }
});

</script>

<style scoped>

</style>
