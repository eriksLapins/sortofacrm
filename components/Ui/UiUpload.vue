<template>
  <div>
    <LoadingAnimation v-if="loading" />
    <UiButton
      v-else
      @click.prevent="open"
    >
      <span v-if="label">{{ label }}</span>
      <div v-else>
        <slot />
      </div>
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { Files } from '@prisma/client';
import { useFileDialog } from '@vueuse/core';
import { useUserStore } from '~/store/userStore';

defineOptions({
    name: 'UiUpload'
});
const props = defineProps<{
  modelValue: Files[];
  userId?: number;
  multiple?: boolean;
  acceptedFileTypes?: string;
  label?: string;

}>();

const emit = defineEmits<{
  'update:modelValue': [files: Files[]]
}>();

const userStore = useUserStore();
const loading = ref(false);

const { open, onChange } = useFileDialog({
    accept: props.acceptedFileTypes || 'image/*',
    multiple: props.multiple || false
});

const syncedFiles = computed({
    get: () => props.modelValue,
    set: payload => emit('update:modelValue', payload)
});
const fileList = ref<FileList | null>(null);

onChange(async (files) => {
    fileList.value = files;
    await onSubmit(false);
});

async function onSubmit (overwrite: boolean) {
    loading.value = true;
    if (!fileList.value) {
        return;
    }
    if (fileList.value.length) {
        const formData = new FormData();

        for (const file of fileList.value) {
            formData.append(file.name, file);
        }

        try {
            const res = await $fetch(`/api/files/upload/${props.userId || userStore.currentUserId}`, {
                method: 'POST',
                body: formData,
                query: {
                    type: 'images',
                    overwrite: overwrite && true
                }
            });
            syncedFiles.value = jsonParse(res.files);
        } catch (e) {
            console.log(e);
        }
    }
    loading.value = false;
}
</script>
