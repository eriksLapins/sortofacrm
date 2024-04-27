<template>
  <div v-if="user" class="lg:container mx-auto py-8 px-6 md:px-8 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="w-full flex justify-between">
        <h1 class="text-l font-bold">
          <span class="text-gray-text">ID: {{ user.id }}</span> {{ user.name }} {{ user.lastname }} [{{ user.initials }}]
        </h1>
        <UiButton
          :href="`/settings/users/${user.id}/edit`"
          text="Edit"
          as-link-button
        />
      </div>
      <div class="flex gap-2 text-sm text-gray-text">
        <span>{{ user.email }}</span>
        <span v-if="user.emailVerified" class="text-primary">{{ format(new Date(user.emailVerified), 'yyyy-MM-dd') }}</span>
        <span v-else class="text-error-border bg-error-background rounded-lg px-1">Unverified</span>
      </div>
    </div>
    <hr>
    <div class="flex gap-4">
      <div class="rounded-full size-20 overflow-hidden">
        <NuxtImg
          :src="user.image || undefined"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p>Department: {{ department }}</p>
        <p>Position: {{ user.position }}</p>
        <p>Phone: {{ formattedPhone }}</p>
      </div>
    </div>
    <hr>
    <div class="flex flex-col gap-4">
      Company: {{ company }}
    </div>
  </div>
  <div v-else class="pt-48 mx-auto">
    <LoadingAnimation large-size />
  </div>
</template>

<script setup lang="ts">
import type { User } from '@prisma/client';
import { format } from 'date-fns';
import { useClientCompanyStore } from '~/store/companyStore';
import { useDepartmentStore } from '~/store/departmentStore';

defineOptions({
    name: 'UserIdIndex'
});

const route = useRoute();
const departmentStore = useDepartmentStore();
const companyStore = useClientCompanyStore();

const { data: user } = await useAsyncData(async () => {
    const response = await $fetch(`/api/data/users/${route.params.id}`);

    const data = jsonParse<Omit<User, 'password'> | undefined>(response);

    return data;
});

const formattedPhone = computed(() => {
    if (user.value) {
        if (user.value.phoneExtension && user.value.phoneExtension.startsWith('00')) {
            const extension = user.value.phoneExtension.replace('00', '+');

            return `${extension} ${user.value.phoneNumber}`;
        }
    }
});

const department = computed(() => {
    const currentUser = user.value;
    if (currentUser) {
        return departmentStore.departments.find(item => item.id === currentUser.departmentId)?.name;
    }
});

const company = computed(() => {
    const currentUser = user.value;
    if (currentUser) {
        return companyStore.companies.find(item => item.id === currentUser.clientCompanyId)?.legalName;
    }
});

onMounted(() => {
    departmentStore.fetchAvailableDepartments();
    companyStore.fetchAvailableCompanies();
});

</script>
