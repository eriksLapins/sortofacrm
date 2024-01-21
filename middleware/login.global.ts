import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware(async (to) => {
    const token = ref<string | null>(null);
    if (process.client) {
        token.value = localStorage.getItem('auth-token');

        if (token.value) {
            try {
                await useUserStore().loginUser(token.value);

                if (to.path === '/login') {
                    return navigateTo('/', {
                        replace: true,
                        external: true
                    });
                }
            } catch {
                if (to.path !== '/login') {
                    return navigateTo('/login?invalidToken', {
                        replace: true,
                        external: true
                    });
                }
            }
        } else if (to.path !== '/login') {
            return navigateTo('/login', {
                replace: true,
                external: true
            });
        }
    }
});
