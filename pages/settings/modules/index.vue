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
        <TableHead>
          <tr>
            <td class="text-center w-12">
              ID
            </td>
            <td>
              Name
            </td>
          </tr>
        </TableHead>
        <tbody>
          <tr v-for="item in availableModules" :key="item.key" class="hover:bg-gray-text-disabled hover:bg-opacity-30">
            <TableData class="text-center w-12" :to="`/settings/modules/${item.key}`">
              {{ item.id }}
            </TableData>
            <TableData :to="`/settings/modules/${item.key}`">
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

defineOptions({
    name: 'SettingsModules'
});

definePageMeta({
    layout: 'settings'
});

const { data } = useAsyncData(async () => {
    const { data } = await $fetch('/api/data/modules');

    const jsonResponse = jsonParse(data);

    return {
        jsonResponse
    };
});

const availableModules = computed(() => {
    return data.value?.jsonResponse || [];
});
</script>

<style scoped>

</style>
