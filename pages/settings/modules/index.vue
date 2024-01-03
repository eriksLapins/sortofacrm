<template>
  <div class="flex flex-col gap-8">
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
    <div class="border-b border-solid border-primary" />
    <ul v-if="availableModules.length">
      <li v-for="item in availableModules" :key="item.key">
        <a :href="`/settings/modules/${item.key}/edit`">
          <div class="flex gap-4">
            <div class="w-12">{{ item.id }}</div>
            <div>{{ item.name }}</div>
          </div>
        </a>
      </li>
    </ul>
    <div v-else class="font-bold text-md">
      No modules found
    </div>
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

const { data } = useAsyncData(async () => {
    const { data } = await $fetch('/api/data/modules/get');

    const jsonResponse = jsonParse(data);

    return {
        jsonResponse
    };
});
availableModules.value = data.value?.jsonResponse || [];
</script>

<style scoped>

</style>
