<template>
  <div class="flex flex-col gap-8">
    <div class="w-full flex justify-end">
      <UiButton
        href="/settings/modules/add"
        text="Add new"
      />
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

const availableModules = ref<Modules[]>();

const { data } = useAsyncData(async () => {
    const { data } = await $fetch('/api/data/modules/get');

    const jsonResponse = jsonParse(data);

    return {
        jsonResponse
    };
});
availableModules.value = data.value?.jsonResponse || undefined;
</script>

<style scoped>

</style>
