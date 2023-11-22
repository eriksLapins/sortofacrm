<template>
  <div>
    <h2 v-if="title">
      {{ title }}
    </h2>
    <slot name="content" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageContent'
});
defineProps({
  title: {
    type: String,
    default: undefined
  }
});
</script>

<style scoped>

</style>
