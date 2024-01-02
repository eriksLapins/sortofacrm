<template>
  <div class="h-[100dvh]">
    <AppHeader
      :nav-items="NavItems"
    />
    <div class="main-layout">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types';

defineOptions({
    name: 'DefaultLayout'
});

const NavItems = computed<NavItem[]>(() => [
    {
        name: 'Main',
        path: '/'
    },
    {
        name: 'Data',
        path: useRuntimeConfig().public.defaultModulePath
    },
    {
        name: 'Settings',
        path: '/settings'
    }
]);

</script>

<style lang="scss">
.main-layout {
    min-height: calc(100dvh - 8rem - 4rem);
}
</style>
