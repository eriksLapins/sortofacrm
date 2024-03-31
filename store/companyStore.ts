import type { ClientCompany } from '@prisma/client';

export const useCompanyStore = defineStore('company', () => {
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
