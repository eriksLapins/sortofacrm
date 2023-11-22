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
    path: '/',
    context: 'session'
  },
  {
    name: 'Tasks',
    path: '/tasks',
    context: 'session'
  },
  {
    name: 'Invoices',
    path: '/invoices',
    context: 'session'
  },
  {
    name: 'Quotes',
    path: '/quotes',
    context: 'session'
  },
  {
    name: 'Reports',
    path: '/reports',
    context: 'session'
  },
  {
    name: 'Settings',
    path: '/settings',
    context: 'session'
  }
]);

</script>

<style lang="scss">
.main-layout {
    min-height: calc(100dvh - 8rem - 4rem);
}
</style>
