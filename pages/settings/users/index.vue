<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-l font-bold">
      Users
    </h1>
    <ClientOnly>
      <table>
        <TableHead>
          <tr>
            <td class="text-center">
              ID
            </td>
            <td class="w-[100px] text-center">
              Image
            </td>
            <td>
              Name
            </td>
            <td>
              Lastname
            </td>
            <td>
              Position
            </td>
            <td>
              Department
            </td>
          </tr>
        </TableHead>
        <tbody>
          <TableRow v-for="user in companyUsers" :key="user.id" :link="`/settings/users/${user.id}`">
            <TableData class="text-center w-12">
              {{ user.id }}
            </TableData>
            <TableData>
              <div class="size-12 rounded-full mx-auto overflow-hidden">
                <NuxtImg v-if="user.image" :src="user.image" width="50" height="50" class="object-cover h-full w-full" />
              </div>
            </TableData>
            <TableData>
              {{ user.name }}
            </TableData>
            <TableData>
              {{ user.lastname }}
            </TableData>
            <TableData>
              {{ user.position }}
            </TableData>
            <TableData>
              {{ findDepartmentName(user.departmentId) }}
            </TableData>
          </TableRow>
        </tbody>
      </table>
      <template #fallback>
        <LoadingAnimation />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@prisma/client';
import { useDepartmentStore } from '~/store/departmentStore';

defineOptions({
    name: 'SettingsUsers'
});
definePageMeta({
    layout: 'settings'
});

const { data: users } = await useAsyncData(async () => {
    const response = await $fetch('/api/data/users');

    const data = jsonParse<User[] | undefined>(response);

    return {
        data
    };
});

const departments = useDepartmentStore().departments;

function findDepartmentName (id: number) {
    return departments.find(department => department.id === id)?.name || 'None';
}

const companyUsers = computed(() => {
    return users.value?.data;
});

onMounted(async () => {
    await useDepartmentStore().fetchAvailableDepartments();
});

</script>

<style scoped>

</style>
