<template>
  <div v-for="item in options">
    {{ option }}
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TableHead'
});

defineProps({
  options: {
    type: Array as PropType<String[]>,
    required: true
  }
});

</script>

<style scoped>

</style>
