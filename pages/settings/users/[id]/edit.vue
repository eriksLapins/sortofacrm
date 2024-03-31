<template>
  <form class="xl:container mx-auto px-4 flex flex-col gap-4 py-20">
    <UiTextInput
      v-model="form.id"
      name="id"
      label="ID"
      class="max-w-12"
      disabled
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.name"
        name="name"
        label="Name"
      />
      <UiTextInput
        v-model="form.lastname"
        name="lastname"
        label="Lastname"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.username"
        name="username"
        label="Username"
      />
      <UiTextInput
        v-model="form.email"
        name="email"
        label="E-mail"
      />
    </div>
    <UiTextInput
      v-model="form.phoneNumber"
      name="phone-number"
      label="Phone"
    />
    <UiTextInput
      v-model="form.position"
      name="position"
      label="Position"
    />
    <ClientOnly>
      <UiSelect
        v-if="userStore.isAdmin"
        v-model="form.role"
        name="role"
        label="CRM Role"
        :items="roleSelection"
      />
    </ClientOnly>
    <UiButton
      @click.prevent="onSubmit"
    >
      Save
    </UiButton>
  </form>
</template>

<script setup lang="ts">
import { ERole, type User } from '@prisma/client';
import { useUserStore } from '~/store/userStore';
import type { MultiSelect } from '~/types';

defineOptions({
    name: 'UserIdEdit'
});

const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const errors = ref<Record<string, any>>({});

const { execute } = await useAsyncData(async () => {
    const response = await $fetch(`/api/data/users/${route.params.id}`);

    const data = jsonParse(response.data) as Omit<User, 'password'> | undefined;

    if (data) {
        form.value = {
            ...data,
            id: data.id.toString() as unknown as number
        };
    }

    return data;
});

const form = ref<Omit<User, 'password'>>({
    id: route.params.id as unknown as number,
    username: '',
    name: '',
    lastname: '',
    initials: '',
    email: '',
    emailVerified: null,
    departmentId: null as unknown as number,
    clientCompanyId: null as unknown as number,
    phoneExtension: '',
    phoneNumber: '',
    position: '',
    role: ERole.USER,
    image: ''
});

const roleSelection = computed((): MultiSelect[] => {
    return [
        {
            key: ERole.USER,
            title: ERole.USER,
            position: 0,
            visible: true
        },
        {
            key: ERole.ADMIN,
            title: ERole.ADMIN,
            position: 1,
            visible: true
        },
        {
            key: ERole.SUPERADMIN,
            title: ERole.SUPERADMIN,
            position: 2,
            visible: true
        }
    ];
});

const onSubmit = async () => {
    loading.value = true;

    try {
        await $fetch(`/api/data/users/${route.params.id}`, {
            method: 'PUT',
            body: {
                ...form.value,
                id: +form.value.id
            }
        });
    } catch (e: any) {
        errors.value = e.data.data.errors.data;
    }

    loading.value = false;
};

onMounted(() => execute());

</script>
