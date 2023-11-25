import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware(async (to) => {
  const token = ref<string | null>(null);
  if (process.client) {
    token.value = localStorage.getItem('auth-token');
  }

  if (token.value) {
    try {
      await useUserStore().loginUser(token.value);

      if (to.path === '/login') {
        navigateTo('/');
      }
    } catch {
      if (to.path !== '/login') {
        navigateTo('/login?invalidToken');
      }
    }
  } else if (to.path !== '/login') {
    navigateTo('/login');
  }
});
