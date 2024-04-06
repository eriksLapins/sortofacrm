<template>
  <div v-if="loading || !userStore" class="py-20">
    <LoadingAnimation large-size />
  </div>
  <div v-else class="h-[700px] xl:container mx-auto px-4 flex flex-col gap-4 justify-between">
    <form class="flex flex-col gap-4 py-20" @submit.prevent="onSubmit">
      <UiTextInput
        v-model="form.id"
        name="id"
        label="ID"
        class="max-w-12"
        disabled
      />
      <div class="flex gap-4 items-center">
        <NuxtLink
          class="size-20 rounded-full overflow-hidden flex justify-center items-center flex-shrink-0"
          :href="form.image || undefined"
          external
          target="_blank"
        >
          <img
            :src="form.image || undefined"
            class="object-cover w-full h-full"
          >
        </NuxtLink>
        <UiButton @click.prevent="showFileModal = true">
          Select Image
        </UiButton>
        <AppModal v-model="showFileModal">
          <template #header>
            <div class="flex justify-end">
              <button @click.prevent="showFileModal = false">
                <IClose class="size-6" />
              </button>
            </div>
          </template>
          <template #default>
            <div class="overflow-y-auto scrollbar-track max-h-[500px]">
              <UiFileWindow
                v-model="profileImages"
                :query="{
                  userId: userStore.currentUserId,
                  fileType: 'images'
                }"
                @update:model-value="handleImageUpdate"
              />
            </div>
          </template>
          <template #footer>
            <div class="pt-4 flex justify-center">
              <UiUpload
                v-model="profileImages"
                @update:model-value="handleImageUpdate"
              >
                Upload and use new image
              </UiUpload>
            </div>
          </template>
        </AppModal>
      </div>
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
      <UiSelect
        v-if="userStore.isAdmin"
        v-model="form.role"
        name="role"
        label="CRM Role"
        :items="roleSelection"
      />
    </form>
    <div class="flex justify-start gap-4">
      <UiButton
        @click.prevent="onSubmit"
      >
        Save
      </UiButton>
      <UiButton
        secondary
        as-link-button
        :href="`/settings/users/${route.params.id}`"
      >
        Cancel
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ERole, type Files, type User } from '@prisma/client';
import UiFileWindow from '~/components/Ui/UiFileWindow.vue';
import { useUserStore } from '~/store/userStore';
import type { MultiSelect } from '~/types';

defineOptions({
    name: 'UserIdEdit'
});

const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const errors = ref<Record<string, any>>({});
const showFileModal = ref(false);

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

const profileImages = ref<Files[]>([]);

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

function handleImageUpdate (files: Files[]) {
    form.value.image = files[0].url;
    showFileModal.value = false;
    profileImages.value = [];
}

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
