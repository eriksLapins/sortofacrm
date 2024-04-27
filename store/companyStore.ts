import type { ClientCompany } from '@prisma/client';

export const useClientCompanyStore = defineStore('clientCompany', () => {
    const companies = ref<ClientCompany[]>([]);

    async function fetchAvailableCompanies () {
        const data = await $fetch('/api/data/settings/company');
        if (data) {
            companies.value = data;
        }
    };

    return {
        companies,
        fetchAvailableCompanies
    };
});
