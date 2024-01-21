<template>
  <td v-if="to" class="p-2 separator">
    <NuxtLink :to="to" class="w-full block">
      <slot />
    </NuxtLink>
  </td>
  <td v-else class="p-2 separator">
    <slot />
  </td>
</template>

<script setup lang="ts">

defineOptions({
    name: 'TableData'
});

defineProps<{
    to?: string,
}>();

</script>

<style scoped>

</style>
