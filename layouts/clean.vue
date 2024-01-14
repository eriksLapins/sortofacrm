<template>
  <div class="min-h-[100dvh]">
    <AppHeader />
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
    min-height: calc(100dvh - 4rem - 3.5rem);
}
</style>
