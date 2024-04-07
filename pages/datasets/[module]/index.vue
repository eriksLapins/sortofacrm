<template>
  <div>
    <div class="flex flex-col lg:flex-row gap-4 lg:container md:mx-auto md:px-8 justify-center pt-8">
      <UiButton
        v-for="item in modules"
        :key="item.id"
        :href="`/datasets/${item.key}`"
        as-link-button
        :text="item.name"
        :secondary="currentModule !== item.key"
      />
    </div>
    <ClientOnly>
      <div class="lg:container mx-auto py-8 px-6 md:px-8">
        <div class="flex w-full justify-end">
          <UiButton :href="`/datasets/${currentModule}/create`" as-link-button text="Create" />
        </div>
        <PageContent
          :title="currentModule.toUpperCase()"
        >
          <div class="flex gap-4 flex-col md:flex-row justify-between">
            <UiMultiSelect
              v-if="columns.length"
              v-model="columns"
              :items="columnList"
              :initial-items="initialColumns"
              label="Columns"
              :name="`${currentModule}-columns`"
              :disabled="columnsSaving"
              draggable
              @update:column-order="handleColumnOrderUpdate"
              @update:save-columns="handleSaveColumns"
            />
            <UiTextInput
              v-model="searchText"
              name="search-text-field"
              label="Search by title/description"
              class="md:max-w-xs"
              @update:model-value="fetchModuleItemsByText"
            />
          </div>
          <TablePreview
            v-if="tableItems.length"
            :data-json="tableItems"
            :module="currentModule"
          />
          <div v-else>
            No items matching the criteria
          </div>
        </PageContent>
      </div>
      <template #fallback>
        <LoadingAnimation large-size class="pt-48 mx-auto" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { type ModuleItems, type Modules } from '@prisma/client';
import { useUserStore } from '~/store/userStore';
import type { MultiSelect, Preferences, TableItems } from '~/types';
import { unwrapModuleData } from '~/types/unwrapModuleData';
import jsonParse from '~/utils/jsonParse';
const userStore = useUserStore();

const moduleItems = ref<ModuleItems[]>();
const loading = ref(false);
const columnsSaving = ref(false);
const initialColumns = ref<MultiSelect[]>([]);
const searchText = ref('');
const previousQuery = ref('');
const route = useRoute();
const modules = ref<Modules[]>([]);

const currentModule = computed(() => {
    return route.params.module as string;
});

async function fetchModuleItems () {
    const { data } = await $fetch(`/api/data/${currentModule.value}/items`, {
        query: {
            createdById: userStore.currentUserId
        }
    });

    const jsonData = jsonParse(data);

    moduleItems.value = jsonData;
}

async function fetchModuleItemsByText (searchQuery: string) {
    if (searchQuery.length === 0) {
        await fetchModuleItems();

        return;
    }
    if (searchQuery.length < 3 && previousQuery.value.length < searchQuery.length) { return; }
    if (!moduleItems.value?.length && previousQuery.value.length < searchQuery.length) { return; }

    previousQuery.value = searchQuery;

    const { data } = await $fetch(`/api/data/${currentModule.value}/search/text`, {
        params: {
            searchQuery
        }
    });

    const jsonData = jsonParse(data);

    moduleItems.value = jsonData;
}

async function getAvailableModules () {
    const data = await $fetch('/api/data/modules');

    const jsonModules = jsonParse(data.data);

    modules.value = jsonModules;
}

const columns = ref<string[]>([]);

const columnList = ref<MultiSelect[]>([]);

const tableItems = computed(() => {
    if (moduleItems.value?.length) {
        const newModuleItems = moduleItems.value?.map((item: ModuleItems) => {
            const id = item.id;
            let object: TableItems[] = [];
            columns.value.forEach((value: string) => {
                if (value === 'data') {
                    const data = unwrapModuleData(item, columnList.value);
                    if (data) {
                        const tempObject = [...object];
                        object = [
                            ...tempObject,
                            ...data
                        ];
                    }
                } else {
                    object.push({
                        ref_id: id,
                        title: value,
                        data: item[value as keyof ModuleItems],
                        position: columnList.value.find(item => item.title === value)?.position
                    });
                }
            });

            return object;
        });

        return newModuleItems;
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
        await $fetch('/api/data/users/preferences', {
            method: 'POST',
            body: {
                userId: userStore.currentUserId,
                module: currentModule.value,
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
    await getAvailableModules();
    await fetchModuleItems();
    await userStore.fetchUserPreferences(currentModule.value as unknown as string);
    if (moduleItems.value) {
        columns.value = Object.keys(moduleItems.value[0]);
        if (moduleItems.value) {
            const taskItems = Object.keys(moduleItems.value[0]);

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
