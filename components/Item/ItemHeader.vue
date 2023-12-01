<template>
  <div class="flex justify-between gap-6 w-full items-center">
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <p class="text-gray-text">
          created by: {{ matchUserById(item.createdBy.toString()) }}
        </p>
        <p class="text-gray-text">
          last updated by: {{ matchUserById(item.updatedBy.toString()) }}
        </p>
      </div>

      <p class="text-gray-text">
        last updated on: {{ format(new Date(item.updatedOn), 'yyyy-MM-dd') }}
      </p>
    </div>
    <div class="flex justify-end gap-6 items-center my-4">
      <UiButton
        :href="`/${moduleName}/${item.id}/update`"
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

defineOptions({
  name: 'ItemHeader'
});

const userStore = useUserStore();

const props = defineProps({
  item: {
    type: Object as PropType<{id: String, createdBy: String, updatedBy: String, updatedOn: Date}>,
    required: true
  },
  moduleName: {
    type: String,
    required: true
  }
});

async function deleteItem () {
  await $fetch(`/api/data/${props.moduleName}/delete`, {
    method: 'POST',
    body: {
      clientId: userStore.currentCompany,
      id: props.item.id
    }
  });
  navigateTo(`/${props.moduleName}`);
}

</script>

<style scoped>

</style>
