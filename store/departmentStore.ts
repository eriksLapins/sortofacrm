import type { Department } from '@prisma/client';

export const useDepartmentStore = defineStore('department', () => {
    const departments = ref<Department[]>([]);

    async function fetchAvailableDepartments () {
        const data = await $fetch('/api/data/settings/department');
        departments.value = data;
    };

    return {
        departments,
        fetchAvailableDepartments
    };
});
