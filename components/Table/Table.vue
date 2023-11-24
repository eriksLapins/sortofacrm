<template>
  <table>
    <thead>
      <div v-for="item in tableHeadOptions" :key="item">
        {{ item }}
      </div>
    </thead>
    <tbody>
      <TableRow />
    </tbody>
  </table>
</template>

<script setup lang="ts">

defineOptions({
  name: 'TableComponent'
});

defineProps({
  dataJson: {
    type: Array as PropType<Record<string, any>[]>,
    required: true
  }
});

const tableHeadOptions = computed(() => {
  return Object.keys(dataJson);
});

</script>

<style scoped>

</style>
