<template>
  <div class="h-[100dvh]">
    <AppHeader
      remove-navigation
    />
    <div class="clean-layout">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">

defineOptions({
  name: 'DefaultLayout'
});

</script>

<style lang="scss">
.clean-layout {
    height: calc(100dvh - 8rem - 4rem);
}
</style>
