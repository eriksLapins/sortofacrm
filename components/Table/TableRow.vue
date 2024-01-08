<template>
  <tr class="hover:bg-gray-text-disabled hover:bg-opacity-30">
    <slot />
  </tr>
</template>

<script setup lang="ts">
defineOptions({
    name: 'TableRow'
});

</script>

<style scoped>

</style>
