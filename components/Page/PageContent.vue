<template>
  <div class="grid gap-4">
    <div>
      <h2 v-if="title" class="text-l font-bold inline-block">
        {{ title }}
        <span
          v-if="titleAppend"
          class="w-max border-2 border-solid rounded-lg px-1 text-sm"
          :class="{
            'border-primary bg-primary bg-opacity-30 text-primary': appendOption === 'success',
            'border-error-border bg-error-background text-error-border': appendOption === 'error',
            'border-accent bg-accent bg-opacity-30 text-accent': appendOption === 'pending'
          }"
        >{{ titleAppend }}</span>
      </h2>
    </div>
    <p v-if="subtitle">
      {{ subtitle }}
    </p>
    <slot />
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
  },
  subtitle: {
    type: String,
    default: undefined
  },
  titleAppend: {
    type: String,
    default: undefined
  },
  appendOption: {
    type: String as PropType<'error' | 'success' | 'pending'>,
    default: 'success'
  }
});
</script>

<style scoped>

</style>
