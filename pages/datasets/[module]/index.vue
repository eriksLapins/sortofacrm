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
              v-if="columnList.length"
              v-model="columns"
              :items="columnList"
              :initial-items="initialColumns"
              label="Columns"
              :name="`${currentModule}-columns`"
              :disabled="columnsSaving"
              draggable
              hide-label
              @update:column-order="handleColumnOrderUpdate"
              @update:save-columns="handleSaveColumns"
            />
            <UiTextInput
              v-model="searchText"
              name="search-text-field"
              label="Search by title/description"
              class="md:max-w-xs"
              hide-label
              @update:model-value="(value) => fetchModuleItemsByText(value as string)"
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
import type { ModuleFieldsAdjusted, MultiSelect, TableItems } from '~/types';
import jsonParse from '~/utils/jsonParse';
const userStore = useUserStore();

const moduleItems = ref<ModuleItems[]>();
const moduleFields = ref<ModuleFieldsAdjusted[]>();
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
    const data = await $fetch(`/api/data/${currentModule.value}/items`, {
        query: {
            createdById: userStore.currentUserId
        }
    });

    const jsonData = jsonParse<ModuleItems[]>(data);

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

    const data = await $fetch(`/api/data/${currentModule.value}/search/text`, {
        params: {
            searchQuery
        }
    });

    const jsonData = jsonParse<ModuleItems[]>(data);

    moduleItems.value = jsonData;
}

async function getAvailableModules () {
    const data = await $fetch('/api/data/modules');

    const jsonModules = jsonParse<Modules[]>(data);

    modules.value = jsonModules;
}

async function fetchModuleFields () {
    const data = await $fetch(`/api/data/${currentModule.value}/field`);

    const jsonModuleFields = jsonParse<ModuleFieldsAdjusted[]>(data);

    moduleFields.value = jsonModuleFields;
}

const columns = ref<string[]>([]);

const columnList = ref<MultiSelect[]>([]);

const tableItems = computed(() => {
    if (moduleItems.value?.length) {
        const newModuleItems = moduleItems.value?.map((item: ModuleItems) => {
            const id = item.id;
            const object: TableItems[] = [];
            columns.value.forEach((value: string) => {
                if (!Object.keys(item.data as Object).includes(value)) {
                    object.push({
                        ref_id: id,
                        key: value,
                        title: columnList.value.find(field => field.key === value)!.title,
                        data: item[value as keyof ModuleItems],
                        position: columnList.value.find(field => field.key === value)?.position
                    });
                }
            });

            const itemData = item.data as Object;
            if (itemData) {
                columns.value.forEach((value: string) => {
                    if (Object.keys(itemData).includes(value)) {
                        object.push({
                            ref_id: id,
                            key: value,
                            title: columnList.value.find(field => field.key === value)!.title,
                            data: itemData[value as keyof typeof itemData],
                            position: columnList.value.find(field => field.key === value)?.position
                        });
                    }
                });
            }

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
        if (columns.value.includes(column.key as string)) {
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
    await fetchModuleFields();
    await userStore.fetchUserPreferences(currentModule.value as unknown as string);
    if (moduleFields.value) {
        columns.value = moduleFields.value.map(item => item.key);
        columnList.value = moduleFields.value.map((item, i) => {
            return {
                key: item.key,
                title: item.title,
                position: i,
                visible: columns.value.includes(item.key)
            };
        });
        initialColumns.value = columnList.value.map(item => item);
    }
    if (userStore.userPreferences[currentModule.value]?.Columns?.length) {
        columnList.value = userStore.userPreferences[currentModule.value].Columns;
        columns.value = columnList.value.filter(value => value.visible).map(item => item.key as string);
        initialColumns.value = columnList.value.map(item => item);
    }
    loading.value = false;
});

</script>
