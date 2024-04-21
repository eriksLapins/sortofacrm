<template>
  <div v-if="loading" class="pt-48 mx-auto">
    <LoadingAnimation large-size />
  </div>
  <div v-else-if="item" class="lg:container mx-auto py-8 px-6 md:px-8">
    <PageContent
      :title="`${module} - ${item.id}`"
    >
      <ItemHeader
        :module-name="($route.params.module as string)"
        :item="item"
      />
      <PageBlockStatic class="flex flex-col gap-4 lg:w-1/2 lg:border border-solid border-primary p-4">
        {{ moduleFields }}
      </PageBlockStatic>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import type { ModuleFieldsAdjusted, ModuleItemsAdjusted } from '~/types';

defineOptions({
    name: 'ModuleItemsIdViewIndex'
});

const route = useRoute();
const id = route.params.id;
const module = route.params.module;

const item = ref<ModuleItemsAdjusted>();
const moduleFields = ref<ModuleFieldsAdjusted[]>([]);
const loading = ref(true);

async function fetchItemById () {
    try {
        const response = await $fetch(`/api/data/${module}/items`, {
            query: {
                id
            }
        });

        const jsonResponse = jsonParse(response);
        let jsonData;
        if ('data' in jsonResponse) {
            jsonData = jsonParse(jsonResponse.data);
        }
        if (jsonData) {
            item.value = jsonData[0] as unknown as ModuleItemsAdjusted;
        }
    } catch (e) {
        throw new Error('Sorry, something went wrong');
    }
}

async function fetchModuleFields () {
    const data = await $fetch(`/api/data/${module}/field`);

    const jsonResponse = jsonParse(data);
    if (!jsonResponse || !('data' in jsonResponse)) {
        return;
    }

    moduleFields.value = jsonResponse.data.filter(field => !(field.key in defaultFieldsList));
}

onBeforeMount(async () => {
    await fetchItemById();
    await fetchModuleFields();

    loading.value = false;
});

</script>
