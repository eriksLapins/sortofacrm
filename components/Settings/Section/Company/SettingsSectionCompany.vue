<template>
  <div class="border w-full relative rounded-lg border-solid border-gray-text-disabled">
    <table v-if="currentData?.length">
      <TableHead>
        <tr>
          <td class="text-center w-12">
            ID
          </td>
          <td>
            isMain
          </td>
          <td>
            legalName
          </td>
          <td>
            alternateName
          </td>
        </tr>
      </TableHead>
      <tbody>
        <tr v-for="item in currentData" :key="item.id" class="hover:bg-gray-text-disabled hover:bg-opacity-30">
          <TableData class="text-center w-12">
            {{ item.id }}
          </TableData>
          <TableData>
            {{ item.isMain }}
          </TableData>

          <TableData>
            {{ item.legalName }}
          </TableData>
          <TableData>
            {{ item.alternateName }}
          </TableData>
        </tr>
      </tbody>
    </table>
    <div class="p-2">
      <div class="w-full flex gap-4 items-center">
        <AppModal v-model="openCompanyModal">
          <SettingsSectionCompanyForm />
        </AppModal>
        <UiButton
          class="text-nowrap"
          @click="openCompanyModal = true"
        >
          Add new
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientCompany } from '@prisma/client';

defineOptions({
    name: 'SettingsSectionCompany'
});

defineEmits(['submit']);

const currentData = ref<ClientCompany[]>();
const openCompanyModal = ref(false);

async function getCompanyData () {
    const { data } = await $fetch('/api/data/settings/company');
    currentData.value = jsonParse(data);
}

onMounted(async () => {
    await getCompanyData();
});
</script>

<style scoped>

</style>
