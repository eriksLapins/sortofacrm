<template>
  <td v-if="to">
    <NuxtLink :to="to" class="w-full block">
      <slot />
    </NuxtLink>
  </td>
  <td v-else>
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
