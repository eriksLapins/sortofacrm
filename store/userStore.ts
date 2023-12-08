import { ERole, type User, type UserPreferences } from '@prisma/client';
import { defineStore } from 'pinia';
import type { UserData } from '~/types';

export const useUserStore = defineStore('users', () => {
  const currentUser = ref<Omit<User, 'password'>>();
  const currentUserId = ref<String>();
  const isSuperAdmin = ref(false);
  const isAdmin = ref(false);
  const isLoggedIn = ref(false);
  const currentCompany = ref<Number>();
  const availableUsers = ref<UserData[]>([]);
  const userPreferences = ref<UserPreferences[]>([]);

  const fetchUsers = async () => {
    const data = await $fetch('/api/data/users/get', {
      method: 'POST',
      body: {
        clientId: currentCompany.value
      }
    });

    const jsonData = JSON.parse(JSON.stringify(data));

    availableUsers.value = jsonData.data;
  };

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
      currentCompany.value = verified.companyId;
      currentUserId.value = verified.userId;
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
    currentUserId.value = undefined;
    currentCompany.value = undefined;
    isAdmin.value = false;
    isSuperAdmin.value = false;
    isLoggedIn.value = false;

    localStorage.removeItem('auth-token');
  };

  const fetchUserPreferences = async () => {
    if (currentUser.value) {
      try {
        const data = await $fetch('/api/data/users/preferences/get', {
          method: 'POST',
          body: {
            clientId: currentCompany.value,
            userId: currentUserId.value
          }
        });

        const jsonData = JSON.parse(JSON.stringify(data));

        userPreferences.value = jsonData;
      } catch (e) {
        console.log(e);
      }
    }
  };

  return {
    currentUser,
    currentCompany,
    currentUserId,
    setUser,
    destroyUser,
    isAdmin,
    isLoggedIn,
    loginUser,
    fetchUsers,
    availableUsers,
    userPreferences,
    fetchUserPreferences
  };
});
