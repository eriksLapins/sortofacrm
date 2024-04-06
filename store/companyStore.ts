import type { ClientCompany } from '@prisma/client';

export const useClientCompanyStore = defineStore('clientCompany', () => {
    const companies = ref<ClientCompany[]>([]);

    async function fetchAvailableCompanies () {
        const { data } = await $fetch('/api/data/settings/company');
        companies.value = jsonParse(data);
    };

    return {
        companies,
        fetchAvailableCompanies
    };
});
