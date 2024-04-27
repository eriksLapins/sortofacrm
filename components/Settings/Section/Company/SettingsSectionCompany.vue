<template>
  <div class="border w-full relative rounded-lg border-solid border-gray-text-disabled">
    <table v-if="currentData?.length" class="w-full">
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
          <template #header>
            <div class="flex justify-between">
              <p class="text-lg font-bold">
                Company info
              </p>
              <button @click="openCompanyModal = false">
                <IClose class="size-4 text-primary" />
              </button>
            </div>
          </template>
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
    const data = await $fetch('/api/data/settings/company');
    currentData.value = data;
}

onMounted(async () => {
    await getCompanyData();
});
</script>

<style scoped>

</style>
