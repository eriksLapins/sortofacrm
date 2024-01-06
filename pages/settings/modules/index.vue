<template>
  <div class="flex flex-col gap-4">
    <div class="w-full flex justify-between">
      <h1 class="text-l font-bold">
        Modules
      </h1>
      <UiButton
        href="/settings/modules/add"
        text="Add new"
        as-link-button
      />
    </div>
    <div class="separator" />
    <ClientOnly>
      <table v-if="availableModules.length">
        <thead>
          <tr>
            <td class="font-bold text-base-plus text-center w-12">
              ID
            </td>
            <td class="font-bold text-base-plus">
              Name
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in availableModules" :key="item.key" class="hover:bg-gray-text-disabled hover:bg-opacity-30">
            <TableData class="text-center w-12" :to="`/settings/modules/${item.key}/edit`">
              {{ item.id }}
            </TableData>
            <TableData :to="`/settings/modules/${item.key}/edit`">
              {{ item.name }}
            </TableData>
          </tr>
        </tbody>
      </table>
      <div v-else class="font-bold text-md">
        No modules found
      </div>
      <template #fallback>
        <LoadingAnimation />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Modules } from '@prisma/client';

defineOptions({
    name: 'SettingsModules'
});

definePageMeta({
    layout: 'settings'
});

const availableModules = ref<Modules[]>([]);
const loading = ref(false);

const { data } = useAsyncData(async () => {
    loading.value = true;
    const { data } = await $fetch('/api/data/modules/get');

    const jsonResponse = jsonParse(data);

    loading.value = false;

    return {
        jsonResponse
    };
});

availableModules.value = data.value?.jsonResponse || [];
</script>

<style scoped>

</style>
