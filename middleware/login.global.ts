import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth-token');

  if (token.value) {
    try {
      await useUserStore().loginUser(token.value);

      if (to.path === '/login') {
        return navigateTo('/');
      }
    } catch {
      if (to.path !== '/login') {
        return navigateTo('/login?invalidToken');
      }
    }
  } else if (to.path !== '/login') {
    return navigateTo('/login');
  }
});
