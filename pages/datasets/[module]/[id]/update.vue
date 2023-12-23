<template>
  <div>
    <ModuleForm v-if="task" :item-id="(id as string)" :item-details="task" />
    <div v-else class="pt-48 mx-auto">
      <LoadingAnimation large-size />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tasks } from '@prisma/client';
import { useUserStore } from '~/store/userStore';

defineOptions({
  name: 'UpdateModuleIndex'
});

const route = useRoute();
const id = route.params.id;
const task = ref<Tasks>();

async function fetchTaskById () {
  const { data } = await $fetch('/api/data/tasks/get', {
    method: 'POST',
    body: {
      clientId: useUserStore().currentCompany,
      id
    }
  });

  const jsonResponse = JSON.parse(JSON.stringify(data));

  task.value = jsonResponse.tasks[0];
}

onBeforeMount(async () => {
  await fetchTaskById();
});

</script>

<style scoped>

</style>
