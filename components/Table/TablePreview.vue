<template>
  <table>
    <TableHead :options="tableHeadOptions" />
    <tbody>
      <TableRow />
    </tbody>
  </table>
</template>

<script setup lang="ts">

defineOptions({
  name: 'TablePreview'
});

const props = defineProps({
  dataJson: {
    type: Array as PropType<Record<string, any>[]>,
    required: true
  }
});

const tableHeadOptions = computed(() => {
  return Object.keys(props.dataJson);
});

</script>

<style scoped>

</style>
