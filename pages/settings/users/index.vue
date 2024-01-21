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
          <TableRow v-for="user in companyUsers" :key="user.id">
            <TableData class="text-center w-12">
              {{ user.id }}
            </TableData>
            <TableData>
              <NuxtImg v-if="user.image" :src="user.image" width="50" height="50" class="bg-cover rounded-full mx-auto" />
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
              {{ user.departmentId }}
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

defineOptions({
    name: 'SettingsUsers'
});
definePageMeta({
    layout: 'settings'
});

const { data: users } = await useAsyncData(async () => {
    const response = await $fetch('/api/data/users');

    const data = jsonParse(response.data);

    return {
        data
    };
});

const companyUsers = computed(() => {
    return users.value?.data;
});

</script>

<style scoped>

</style>
