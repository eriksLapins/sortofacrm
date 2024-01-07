<template>
  <div class="flex flex-col gap-4">
    <div class="w-full flex justify-between">
      <h1 class="text-l font-bold">
        Module - {{ $route.params.module }}
      </h1>
      <UiButton
        :href="`/settings/modules/${$route.params.module}/edit`"
        text="Edit"
        as-link-button
      />
    </div>
    <div class="separator" />
    <ClientOnly>
      <table v-if="availableFields.length">
        <thead>
          <tr>
            <td class="font-bold text-base-plus text-center w-12">
              ID
            </td>
            <td class="font-bold text-base-plus">
              Title
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in availableFields" :key="item.key" class="hover:bg-gray-text-disabled hover:bg-opacity-30">
            <TableData class="text-center w-12">
              {{ item.id }}
            </TableData>
            <TableData>
              {{ item.title }}
            </TableData>
          </tr>
        </tbody>
      </table>
      <div v-else class="font-bold text-md">
        No fields found
      </div>
      <template #fallback>
        <LoadingAnimation />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">

defineOptions({
    name: 'SettingsModuleView'
});

definePageMeta({
    layout: 'settings'
});

const route = useRoute();
const currentModule = route.params.module;

const { data } = useAsyncData(async () => {
    const { data } = await $fetch(`/api/data/${currentModule}/field/get`);

    const jsonResponse = jsonParse(data);

    return {
        jsonResponse
    };
});

const availableFields = computed(() => {
    return data.value?.jsonResponse || [];
});

</script>

<style scoped>

</style>
