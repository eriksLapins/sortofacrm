<template ref="settingsLayout">
  <div class="h-[100dvh]">
    <AppHeader
      :nav-items="NavItems"
    />
    <div class="settings-layout container mx-auto p-4 md:p-8 flex flex-col gap-4">
      <h1 class="text-l font-bold">
        Settings
      </h1>
      <div class="flex flex-col lg:flex-row gap-4 justify-center">
        <UiButton
          v-for="item in settingsPaths"
          :key="item.name"
          :href="item.path"
          as-link-button
          :text="item.name"
          :secondary="!isCurrentPath(item.path)"
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

defineEmits(['change-page-name']);

const route = useRoute();
const settingsLayout = ref();

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
const isCurrentPath = (path: string) => {
    const routePath = route.path.replace('/settings', '');
    const itemPath = path.replace('/settings', '');

    if (routePath === '' && itemPath === '') {
        return true;
    }

    if (itemPath !== '' && routePath.includes(itemPath)) {
        return true;
    }

    return false;
};

</script>

<style lang="scss">
.settings-layout {
    height: calc(100dvh - 4rem - 3.5rem);
}
</style>
