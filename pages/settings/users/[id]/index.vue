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
        <span>{{ user.emailVerified ? format(new Date(user.emailVerified), 'yyyy-MM-dd') : 'Unverified' }}</span>
      </div>
    </div>
    <div class="separator" />
    <div class="flex gap-4">
      <div class="rounded-full bg-cover size-20 overflow-hidden">
        <NuxtImg
          :src="user.image || undefined"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p>Department: {{ department }}</p>
        <p>Position: {{ user.position }}</p>
        <p>Phone: {{ formattedPhone }}</p>
      </div>
    </div>
    {{ user }}
  </div>
  <div v-else class="pt-48 mx-auto">
    <LoadingAnimation large-size />
  </div>
</template>

<script setup lang="ts">
import type { User } from '@prisma/client';
import { format } from 'date-fns';
import { useDepartmentStore } from '~/store/departmentStore';

defineOptions({
    name: 'UserIdIndex'
});

const route = useRoute();
const userId = route.params.id;
const departmentStore = useDepartmentStore();

const { data: user } = await useAsyncData(async () => {
    const response = await $fetch(`/api/data/users/${userId}`);

    const data = jsonParse(response.data) as Omit<User, 'password'> | undefined;

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

onMounted(() => {
    departmentStore.fetchAvailableDepartments();
});

</script>
