<template>
  <nav
    class="navbar shadow-md shadow-primary w-full px-4 flex h-16 sticky top-0 z-50 bg-white dark:bg-gray-secondary justify-between md:p-0 md:justify-start"
    :class="{'active-menu': activeMenu}"
  >
    <div class="md:w-1/4 flex md:m-0 justify-center items-center self-stretch">
      <NuxtLink href="/">
        <img src="./svg/el_logo.svg" alt="ĒL Logo" class="w-10 h-10 md:w-12 md:h-12">
      </NuxtLink>
    </div>
    <template v-if="navItems.length">
      <a
        class="w-10 h-full items-center md:hidden flex justify-center"
        :class="{hidden: !activeMenu}"
        @click.prevent="handleMenuOpenClose"
      >
        <img src="./svg/menu-close-icon.svg" class="w-8 h-8" alt="menu icon close">
      </a>
      <a
        class="w-10 h-full items-center md:hidden flex justify-center"
        :class="{hidden: activeMenu}"
        @click.prevent="handleMenuOpenClose"
      >
        <img src="./svg/menu-icon.svg" class="w-8 h-8" alt="menu icon">
      </a>
    </template>
    <ClientOnly>
      <div class="navigation-links hidden md:block bg-white dark:bg-gray-secondary md:w-3/4 w-full h-[100dvh] px-8 absolute top-16 right-0 md:relative md:h-full md:top-0">
        <ul
          class="relative flex flex-col justify-end items-center md:gap-2 mt-8 border-t-2 border-b-2 border-primary md:border-0 md:mt-0 md:flex-row md:h-full"
        >
          <template
            v-for="item in navItems"
            :key="item.name"
          >
            <li
              class="md:w-1/4 text-center md:border-2 md:border-transparent rounded-md lg:hover:border-primary"
              :class="{'active-link': isActive(item.path)}"
            >
              <NuxtLink
                :to="item.path"
                class="navlink w-full block text-l text-primary"
                :class="{'active-link': isActive(item.path)}"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </template>
          <li v-if="userStore.isLoggedIn" class="md:w-1/4 text-center md:border-2 md:border-transparent rounded-md lg:hover:border-primary">
            <NuxtLink
              class="w-full block text-l text-primary hover:cursor-pointer"
              @click="handleLogout"
            >
              Logout
            </NuxtLink>
          </li>
        </ul>
      </div>
    </ClientOnly>
  </nav>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useUserStore } from '~/store/userStore';
import type { NavItem } from '~/types';

defineOptions({
  name: 'NavBar'
});

defineProps({
  navItems: {
    type: Array as PropType<NavItem[]>,
    default: () => []
  }
});

const userStore = useUserStore();
const route = useRoute();

const activeMenu = ref(false);

function handleMenuOpenClose () {
  activeMenu.value = !activeMenu.value;
};

function handleLogout () {
  userStore.destroyUser();
  navigateTo('/login');
  activeMenu.value = false;
}

const isActive = (path: string) => {
  const actualPath = '/' + route.path.split('/')[1];

  return path === actualPath;
};

watch(() => route.path, () => {
  activeMenu.value = false;
});

</script>

<style lang="scss">
@import "~/scss/theme/variables";

.active-menu {
  .navigation-links {
      display: block;
  }
}

.active-link {
  @media (min-width: theme('screens.md')) {
    border: 2px solid $color-primary;
    background-color: $color-primary;
    color: white;
  }
}
</style>
