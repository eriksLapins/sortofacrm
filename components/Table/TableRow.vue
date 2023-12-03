<template>
  <div v-for="(data, i) in item" :key="i">
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineOptions({
  name: 'TableRow'
});

defineProps({
  item: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});

</script>
