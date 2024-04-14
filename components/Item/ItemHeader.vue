<template>
  <div class="flex justify-between gap-6 w-full items-center">
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <p class="text-gray-text">
          created by: {{ createdBy?.initials }}
        </p>
        <p class="text-gray-text">
          last updated by: {{ updatedBy?.initials }}
        </p>
      </div>

      <p class="text-gray-text">
        last updated on: {{ format(new Date(item.updatedOn), 'yyyy-MM-dd') }}
      </p>
    </div>
    <div class="flex justify-end gap-6 items-center my-4">
      <UiButton
        :href="`/datasets/${moduleName}/${item.id}/update`"
        text="Update"
        as-link-button
      />
      <UiButton
        text="Delete"
        error-variant
        @click.prevent="deleteItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import format from 'date-fns/format';
import { useUserStore } from '~/store/userStore';
import type { ModuleItemsAdjusted } from '~/types';

defineOptions({
    name: 'ItemHeader'
});

const props = defineProps<{
  item: ModuleItemsAdjusted;
  moduleName: string;
}>();

const userStore = useUserStore();

function matchUserById (id: number) {
    return userStore.availableUsers.find(user => user.id === id);
}

const createdBy = computed(() => {
    const id = props.item.createdById;

    return matchUserById(id);
});

const updatedBy = computed(() => {
    const id = props.item.updatedById;

    return matchUserById(id);
});

async function deleteItem () {
    await $fetch(`/api/data/${props.moduleName}/items`, {
        method: 'DELETE',
        body: {
            id: props.item.id
        }
    });
    navigateTo(`/${props.moduleName}`);
}

onMounted(async () => {
    await userStore.fetchUsers();
});

</script>
