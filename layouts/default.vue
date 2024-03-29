<template>
  <div class="min-h-[100dvh]">
    <AppHeader
      :nav-items="NavItems"
    />
    <div class="main-layout">
      <slot />
    </div>
    <DevOnly>
      <UiButton href="/_nitro/swagger" target="_blank" secondary as-link-button class="absolute bottom-20 right-10">
        OpenAPI
      </UiButton>
    </DevOnly>
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
        path: '/dashboard'
    },
    {
        name: 'Data',
        path: '/datasets'
    },
    {
        name: 'Settings',
        path: '/settings'
    }
]);

</script>

<style lang="scss">
.main-layout {
    min-height: calc(100dvh - 4rem - 3.5rem);
}
</style>
