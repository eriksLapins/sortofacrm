<template>
  <div>
    <div v-if="loading" class="pt-48 mx-auto">
      <LoadingAnimation large-size />
    </div>
    <ModuleForm
      v-else-if="item"
      :module="($route.params.module as string)"
      :item-id="(id as string)"
      :item-details="item"
    />
    <div v-else class="w-full  py-12 flex flex-col gap-4 justify-center items-center text-lg font-semibold">
      No item found
      <UiButton
        class="w-[200px]"
        secondary
        as-link-button
        :href="`/datasets/${$route.params.module}`"
      >
        Back
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModuleItemsAdjusted } from '~/types';

defineOptions({
    name: 'UpdateModuleIndex'
});

const route = useRoute();
const id = route.params.id;
const item = ref<ModuleItemsAdjusted>();
const loading = ref(true);

async function fetchTaskById () {
    try {
        const data = await $fetch(`/api/data/${route.params.module}/items`, {
            query: {
                id
            }
        });

        const jsonResponse = jsonParse<ModuleItemsAdjusted[]>(data);

        item.value = jsonResponse[0];
    } catch (e) {
        console.log(e);
        loading.value = false;
    }
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchTaskById();
});

</script>
