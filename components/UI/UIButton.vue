<template>
  <button class="border border-primary text-primary px-2 py-1 rounded hover:bg-primary focus-within:bg-primary hover:text-white focus-within:text-white outline-none">
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
  }
});
</script>
