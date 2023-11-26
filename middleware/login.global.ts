import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware(async (to) => {
  const router = useRouter();
  const token = ref<string | null>(null);
  if (process.client) {
    token.value = localStorage.getItem('auth-token');
  }

  if (token.value) {
    try {
      await useUserStore().loginUser(token.value);

      if (to.path === '/login') {
        router.push('/');
      }
    } catch {
      if (to.path !== '/login') {
        router.push('/login?invalidToken');
      }
    }
  } else if (to.path !== '/login') {
    router.push('/login');
  }
});
