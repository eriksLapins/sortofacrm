<template>
  <tr
    class="hover:bg-gray-text-disabled hover:bg-opacity-30"
    :class="{
      'hover:cursor-pointer': !!link
    }"
    @click="handleClick"
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
defineOptions({
    name: 'TableRow'
});

const props = defineProps<{
  link?: string;
}>();

function handleClick () {
    if (props.link) {
        navigateTo(props.link);
    }
}

</script>

<style scoped>

</style>
