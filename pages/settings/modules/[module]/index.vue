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
        <TableHead>
          <tr>
            <td class="text-center w-12">
              ID
            </td>
            <td>
              Position
            </td>
            <td>
              Title
            </td>
            <td>
              Type
            </td>
            <td>
              Value type
            </td>
            <td>
              Required?
            </td>
            <td>
              Additional
            </td>
          </tr>
        </TableHead>
        <tbody>
          <TableRow v-for="item in availableFields" :key="item.key">
            <TableData class="text-center w-12">
              {{ item.id }}
            </TableData>
            <TableData class="text-center w-12">
              {{ item.position }}
            </TableData>
            <TableData>
              {{ item.title }}
            </TableData>
            <TableData>
              {{ item.type }}
            </TableData>
            <TableData>
              {{ item.valueType }}
            </TableData>
            <TableData>
              {{ item.required ? 'required' : 'optional' }}
            </TableData>
            <TableData>
              {{ item.additional }}
            </TableData>
          </TableRow>
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
import type { ModuleFieldsAdjusted } from '~/types';

defineOptions({
    name: 'SettingsModuleView'
});

definePageMeta({
    layout: 'settings'
});

const route = useRoute();
const currentModule = route.params.module;

const { data } = useAsyncData(async () => {
    const data = await $fetch(`/api/data/${currentModule}/field`);

    const jsonResponse = jsonParse<ModuleFieldsAdjusted[] | undefined>(data);

    return jsonResponse;
});

const availableFields = computed(() => {
    if (data.value) {
        data.value.sort((a, b) => a.position - b.position);
    }

    return data.value || [];
});

</script>
