<template>
  <div class="table-preview w-full overflow-x-auto">
    <table>
      <thead>
        <td
          v-for="title in tableHeadOptions"
          :key="title"
          class="font-semibold p-2 text-nowrap border-b-2 border-t border-solid border-y-primary"
        >
          {{ title }}
        </td>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in table"
          :key="i"
          class="py-2 hover:bg-gray-background hover:cursor-pointer"
          @click.prevent="navigateTo(`/datasets/${module}/${item[0].ref_id}/view`)"
        >
          <td
            v-for="(key, z) in item"
            :key="z"
            class="min-w-[100px] p-2"
          >
            {{ key.data }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { TableItems } from '~/types';

defineOptions({
    name: 'TablePreview'
});

const props = defineProps<{
  dataJson: TableItems[][];
  module: string;
}>();
const emit = defineEmits<{
  'update:dataJson': [data: TableItems[][]]
}>();

const table = computed({
    get: () => props.dataJson,
    set: payload => emit('update:dataJson', payload)
});

const tableHeadOptions = computed(() => {
    if (table.value) {
        table.value.forEach((row) => {
            row.sort((a, b) => {
                if (a.position === undefined || b.position === undefined) {
                    return -1;
                }

                return a.position - b.position;
            });
        });
        const headOptions = table.value[0].map(item => item.title);

        return headOptions;
    }

    return [];
});
</script>

<style lang="scss">
@import "~/scss/theme/variables";

  ::-webkit-scrollbar {
    height: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    height: 0.5rem;
  }

  ::-webkit-scrollbar-thumb {
    height: 0.5rem;
    background-color: $color-gray-primary;
    border-radius: 0.25rem;
  }

</style>
