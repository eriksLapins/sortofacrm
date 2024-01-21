import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware(() => {
  return navigateTo(`/datasets/${useUserStore().defaultDataset}`);
});
