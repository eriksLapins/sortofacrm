<template>
  <NuxtLink
    v-if="asLinkButton"
    :href="href"
    class="border-2 px-2 py-1 rounded outline-none text-center"
    :class="{
      'border-primary bg-primary hover:bg-opacity-90 focus-within:bg-opacity-90 text-white' : !secondary && !errorVariant,
      'border-error-border text-error-border bg-error-background hover:bg-error-border focus-within:bg-error-border hover:text-white focus-within:text-white': errorVariant,
      'border-primary text-primary hover:bg-primary hover:bg-opacity-30 focus-within:bg-primary focus-within:bg-opacity-30 hover:text-white focus-within:text-white' : secondary,
    }"
  >
    <span v-if="loading">loading</span>
    <span v-else-if="text">{{ text }}</span>
    <slot v-else />
  </NuxtLink>
  <NuxtLink
    v-else-if="asLink"
    :to="href"
    :external
    class="font-semibold rounded hover:underline text-center"
    :class="{
      'text-primary' : secondary || !errorVariant,
      'text-error-border': errorVariant
    }"
  >
    <span v-if="loading">loading</span>
    <span v-else-if="text">{{ text }}</span>
    <slot v-else />
  </NuxtLink>
  <button
    v-else
    class="border-2 px-2 py-1 rounded outline-none text-center"
    :class="{
      'border-primary bg-primary hover:bg-opacity-90 focus-within:bg-opacity-90 text-white' : !secondary && !errorVariant,
      'border-error-border text-error-border bg-error-background hover:bg-error-border focus-within:bg-error-border hover:text-white focus-within:text-white': errorVariant,
      'border-primary text-primary hover:bg-primary hover:bg-opacity-30 focus-within:bg-primary focus-within:bg-opacity-30 hover:text-white focus-within:text-white' : secondary,
    }"
  >
    <span v-if="loading">loading</span>
    <span v-else-if="text">{{ text }}</span>
    <slot v-else />
  </button>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'UIButton'
});

defineProps({
    text: {
        type: String,
        default: undefined
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
    },
    external: {
        type: Boolean
    },
    loading: {
        type: Boolean
    }
});
</script>
