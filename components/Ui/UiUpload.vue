<template>
  <div>
    <UiButton
      @click.prevent="open"
    >
      Change image
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core';

defineOptions({
    name: 'UiUpload'
});

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

        await $fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });
    }
});

</script>
