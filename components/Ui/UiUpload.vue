<template>
  <div>
    <UiButton
      @click.prevent="open"
    >
      <slot />
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core';
import { useUserStore } from '~/store/userStore';
import type { FileReturnUser } from '~/types';

defineOptions({
    name: 'UiUpload'
});

const userStore = useUserStore();

const responseFiles = ref<FileReturnUser>();

const { open, onChange } = useFileDialog({
    accept: 'image/*'
});

const image = defineModel<string | null>();

onChange(async (files) => {
    if (!files) {
        return;
    }
    if (files.length) {
        const formData = new FormData();

        for (const file of files) {
            formData.append(file.name, file);
        }

        const res = await $fetch(`/api/files/upload/${userStore.currentUserId}`, {
            method: 'POST',
            body: formData,
            query: {
                type: 'images'
            }
        });

        responseFiles.value = jsonParse(res.files)[0];
        image.value = responseFiles.value.url;
    }
});

</script>
