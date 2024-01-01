<template>
  <div class="h-[100dvh]">
    <AppHeader
      :nav-items="NavItems"
    />
    <div class="settings-layout container mx-auto p-4 md:p-8 flex flex-col gap-8">
      <h1 class="text-l font-bold">
        Settings {{ currentModule === 'General' ? '' : `- ${currentModule}` }}
      </h1>
      <div class="flex flex-col lg:flex-row gap-4 justify-center">
        <UiButton
          v-for="item in settingsPaths"
          :key="item.name"
          :href="item.path"
          as-link-button
          :text="item.name"
          :secondary="item.path !== $route.fullPath"
          @click="currentModule = item.name"
        />
      </div>
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types';

defineOptions({
    name: 'SettingsLayout'
});

const NavItems = computed<NavItem[]>(() => [
    {
        name: 'Main',
        path: '/'
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

const settingsPaths = [
    {
        name: 'General',
        path: '/settings'
    },
    {
        name: 'Modules',
        path: '/settings/modules'
    },
    {
        name: 'Users',
        path: '/settings/users'
    }
];

const currentModule = ref('General');

</script>

<style lang="scss">
.settings-layout {
    min-height: calc(100dvh - 8rem - 4rem);
}
</style>
