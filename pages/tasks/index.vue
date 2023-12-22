<template>
  <div v-if="loading">
    <LoadingAnimation />
  </div>
  <div v-else class="lg:container mx-auto py-8 px-6 md:px-8">
    <div class="flex w-full justify-end">
      <UiButton href="/tasks/create" as-link-button text="Create" />
    </div>
    <PageContent
      title="Tasks"
    >
      <div class="flex gap-4 flex-col md:flex-row justify-between">
        <ClientOnly>
          <UiMultiSelect
            v-if="columns.length"
            v-model:model-value="columns"
            :items="columnList"
            :initial-items="initialColumns"
            label="Columns"
            name="task-columns"
            :disabled="columnsSaving"
            draggable
            @update:column-order="handleColumnOrderUpdate"
            @update:save-columns="handleSaveColumns"
          />
        </ClientOnly>
        <UiTextInput
          v-model="searchText"
          name="search-text-field"
          label="Search by title/description"
          class="md:max-w-xs"
          @update:model-value="fetchTasksByText"
        />
      </div>
      <TablePreview
        v-if="tableTasks.length"
        :data-json="tableTasks"
        module="tasks"
      />
      <div v-else>
        No tasks matching the criteria
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { type Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';
import type { MultiSelect, Preferences, TableTasks } from '~/types';
const userStore = useUserStore();

const tasks = ref<Tasks[]>();
const loading = ref(false);
const columnsSaving = ref(false);
const initialColumns = ref<MultiSelect[]>([]);
const searchText = ref('');
const previousQuery = ref('');

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

async function fetchTasksByText (searchQuery: string) {
  if (searchQuery.length === 0) {
    await fetchTasks();

    return;
  }
  if (searchQuery.length < 3 && previousQuery.value.length < searchQuery.length) { return; }
  if (!tasks.value?.length && previousQuery.value.length < searchQuery.length) { return; }

  previousQuery.value = searchQuery;

  const { data } = await $fetch('/api/data/tasks/search/text', {
    method: 'POST',
    body: {
      clientId: userStore.currentCompany
    },
    params: {
      searchQuery
    }
  });

  const jsonTasks = JSON.parse(JSON.stringify(data));

  tasks.value = jsonTasks;
}

const columns = ref<string[]>([]);

const columnList = ref<MultiSelect[]>([]);

const tableTasks = computed(() => {
  if (tasks.value?.length) {
    const newTasks = tasks.value?.map((task: Record<string, any>) => {
      const id = task.id;
      const object: TableTasks[] = [];
      columns.value.forEach((value) => {
        object.push({
          ref_id: id,
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

function handleColumnOrderUpdate (items: MultiSelect[]) {
  items.forEach((item) => {
    columnList.value[columnList.value.findIndex(column => item.key === column.key)].position = item.position;
  });
  columnList.value.sort((a, b) => a.position - b.position);
}

async function handleSaveColumns (items: MultiSelect[]) {
  columnsSaving.value = true;
  initialColumns.value = [...items];
  columnList.value = [...items];
  const mappedItems = items.map((column) => {
    if (columns.value.includes(column.title)) {
      return {
        ...column,
        visible: true
      };
    } else {
      return {
        ...column,
        visible: false
      };
    }
  });
  try {
    await $fetch('/api/data/users/preferences/create', {
      method: 'POST',
      body: {
        clientId: userStore.currentCompany,
        userId: userStore.currentUserId,
        module: 'tasks',
        preferenceType: 'Columns',
        preferences: mappedItems
      }
    });
  } catch (e) {
    console.log(e);
  }
  columnsSaving.value = false;
}

onBeforeMount(async () => {
  loading.value = true;
  await fetchTasks();
  await userStore.fetchUserPreferences('tasks');
  if (tasks.value) {
    columns.value = Object.keys(tasks.value[0]);
    if (tasks.value) {
      const taskItems = Object.keys(tasks.value[0]);

      columnList.value = taskItems.map((item) => {
        const index = taskItems.findIndex(value => value === item);

        return {
          key: item,
          title: item,
          position: index,
          visible: columns.value.includes(item)
        };
      });
      initialColumns.value = columnList.value.map(item => item);
    }
  }
  if (userStore.userPreferences.tasks?.Columns?.length) {
    columnList.value = userStore.userPreferences.tasks.Columns;
    columns.value = columnList.value.filter((item: Preferences) => item.visible).map(item => item.title);
    initialColumns.value = columnList.value.map(item => item);
  }
  loading.value = false;
});

</script>

<style scoped>

</style>
