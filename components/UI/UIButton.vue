<template>
  <NuxtLink
    v-if="asLinkButton"
    :href="href"
    class="border-2 px-2 py-1 rounded hover:text-white focus-within:text-white outline-none text-center"
    :class="{
      'border-primary text-primary hover:bg-primary focus-within:bg-primary' : !secondary && !errorVariant,
      'border-error-border text-error-border bg-error-background hover:bg-error-border focus-within:bg-error-border': errorVariant,
      'border-primary text-primary hover:bg-primary hover:bg-opacity-50 focus-within:bg-primary' : secondary,
    }"
  >
    {{ text }}
  </NuxtLink>
  <NuxtLink
    v-else-if="asLink"
    :href="href"
    class="font-semibold rounded hover:underline text-center"
    :class="{
      'text-primary' : secondary || !errorVariant,
      'text-error-border': errorVariant
    }"
  >
    {{ text }}
  </NuxtLink>
  <button
    v-else
    class="border-2 px-2 py-1 rounded hover:text-white focus-within:text-white outline-none text-center"
    :class="{
      'border-primary text-primary hover:bg-primary focus-within:bg-primary' : !secondary && !errorVariant,
      'border-error-border text-error-border bg-error-background hover:bg-error-border focus-within:bg-error-border': errorVariant,
      'border-primary text-primary hover:bg-primary hover:bg-opacity-50 focus-within:bg-primary' : secondary,
    }"
  >
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'UIButton'
});

defineProps({
  text: {
    type: String,
    required: true
  },
  secondary: {
    type: Boolean
  },
  errorVariant: {
    type: Boolean
  },
  asLinkButton: {
    type: Boolean
  },
  asLink: {
    type: Boolean
  },
  href: {
    type: String,
    default: undefined
  }
});
</script>
