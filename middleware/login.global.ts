import { useUserStore } from '~/store/userStore';

export default defineNuxtRouteMiddleware(async (to) => {
    const token = ref<string | null>(null);
    if (process.client) {
        token.value = localStorage.getItem('auth-token');

        if (token.value) {
            try {
                await useUserStore().loginUser(token.value);

                if (to.path === '/') {
                    return navigateTo('/dashboard', {
                        replace: true,
                        external: true
                    });
                }
            } catch {
                if (to.path !== '/') {
                    return navigateTo('/?invalidToken', {
                        replace: true,
                        external: true
                    });
                }
            }
        } else if (to.path !== '/') {
            return navigateTo('/', {
                replace: true,
                external: true
            });
        }
    }
});
