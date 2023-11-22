import { ERole, type User } from '@prisma/client';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('users', () => {
  const currentUser = ref<Omit<User, 'password'>>();
  const isSuperAdmin = ref(false);
  const isAdmin = ref(false);
  const isLoggedIn = ref(false);

  const loginUser = async (token: string | null) => {
    if (!token) {
      return;
    }
    const verified = await $fetch('/api/auth/verify/token', {
      method: 'POST',
      body: {
        token
      }
    });

    if (verified) {
      isAdmin.value = verified.role === (ERole.ADMIN || ERole.SUPERADMIN);
      isSuperAdmin.value = verified.role === ERole.SUPERADMIN;
      isLoggedIn.value = true;
    } else {
      throw new Error('Invalid token, please log in again');
    }
  };

  const setUser = (user: Omit<User, 'password'>) => {
    currentUser.value = user;
    isAdmin.value = currentUser.value.role === (ERole.ADMIN || ERole.SUPERADMIN);
    isSuperAdmin.value = currentUser.value.role === ERole.SUPERADMIN;
    isLoggedIn.value = true;
  };

  const destroyUser = () => {
    currentUser.value = undefined;
    isAdmin.value = false;
    isSuperAdmin.value = false;
    isLoggedIn.value = false;

    const token = useCookie('auth-token');
    token.value = null;
  };

  return {
    currentUser,
    setUser,
    destroyUser,
    isAdmin,
    isLoggedIn,
    loginUser
  };
});
