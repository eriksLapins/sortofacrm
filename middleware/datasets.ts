import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware((to) => {
  if (to.fullPath === '/datasets') {
    return navigateTo(`/datasets/${useUserStore().defaultDataset}`);
  }
});
