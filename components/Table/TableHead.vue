<template>
  <div v-for="item in options" :key="item">
    {{ item }}
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TableHead'
});

defineProps({
  options: {
    type: Array as PropType<string[]>,
    required: true
  }
});

</script>

<style scoped>

</style>
