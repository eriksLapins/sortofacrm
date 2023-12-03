<template>
  <div class="w-full overflow-x-scroll">
    <table>
      <thead>
        <td v-for="(title, i) in tableHeadOptions" :key="i" class="font-semibold p-2">
          {{ title }}
        </td>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in table"
          :key="i"
          class="py-2 hover:bg-secondary hover:cursor-pointer"
          @click.prevent="navigateTo(`/${module}/${findItemId(item)}/view`)"
        >
          <td
            v-for="(key, z) in item"
            :key="z"
            class="min-w-[100px]"
          >
            {{ key.data }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

defineOptions({
  name: 'TablePreview'
});

const props = defineProps({
  dataJson: {
    type: Array as PropType<{
      title: string,
      data: any;
      position: number | undefined;
    }[][]>,
    required: true
  },
  module: {
    type: String,
    required: true
  }
});

const table = ref(props.dataJson);

function findItemId (item: typeof table.value[0]) {
  return item.find(object => object.title === 'id')?.data;
}

const tableHeadOptions = computed(() => {
  if (table.value) {
    console.log('sorting computed');
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

watch(() => props.dataJson, (newData) => {
  table.value = newData;
});

</script>
