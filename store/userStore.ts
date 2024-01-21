import { ERole, type User, type UserPreferences } from '@prisma/client';
import { defineStore } from 'pinia';
import type { PreferenceWrapper, Preferences, UserData } from '~/types';
import { EPreferenceTypesDefault } from '~/types/enum/preferenceTypes';

export const useUserStore = defineStore('users', () => {
    const currentUser = ref<Omit<User, 'password'>>();
    const currentUserId = ref<number>();
    const isSuperAdmin = ref(false);
    const isAdmin = ref(false);
    const isLoggedIn = ref(false);
    const availableUsers = ref<UserData[]>([]);
    const userPreferences = ref<PreferenceWrapper>({});
    const defaultDataset = ref('tasks');

    const fetchUsers = async () => {
        const data = await $fetch('/api/data/users');

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
            currentUserId.value = Number(verified.userId);
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
        isAdmin.value = false;
        isSuperAdmin.value = false;
        isLoggedIn.value = false;

        localStorage.removeItem('auth-token');
    };

    const fetchUserPreferences = async (moduleName: string) => {
        if (currentUserId.value) {
            try {
                const data = await $fetch('/api/data/users/preferences', {
                    params: {
                        userId: currentUserId.value,
                        module: moduleName
                    }
                });

                const jsonData = JSON.parse(JSON.stringify(data.data)) as UserPreferences[];

                const fullPreferences: PreferenceWrapper = {} as PreferenceWrapper;

                // @ts-ignore
                fullPreferences[moduleName] = {};
                Object.values(EPreferenceTypesDefault).forEach((value) => {
                    fullPreferences[moduleName][value] = [];
                });

                jsonData.forEach((value) => {
                    const preferences = value.preferences as unknown as Preferences;
                    fullPreferences[moduleName][value.preferenceType].push(preferences);
                });

                Object.values(EPreferenceTypesDefault).forEach((value) => {
                    if (fullPreferences[moduleName][value].length) {
                        fullPreferences[moduleName][value].sort((a, b) => a.position - b.position);
                    }
                });

                userPreferences.value[moduleName] = fullPreferences[moduleName];
            } catch (e) {
                console.log(e);
            }
        }
    };

    return {
        currentUser,
        currentUserId,
        setUser,
        destroyUser,
        isAdmin,
        isLoggedIn,
        loginUser,
        fetchUsers,
        availableUsers,
        userPreferences,
        fetchUserPreferences,
        defaultDataset
    };
});
