<template>
  <LoadingAnimation v-if="loading" large-size />
  <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <template v-for="(file, key) in existingFiles" :key>
      <button
        class="size-36 rounded-3xl overflow-hidden relative"
        @click.prevent="handleClick(file)"
      >
        <div
          class="
          absolute w-full h-full z-10 bg-white opacity-40 flex justify-center items-center
          border-2 border-solid border-primary rounded-3xl"
          :class="selectedFiles.includes(file) ? '' : 'hidden'"
        />
        <NuxtImg
          :src="file.fileType==='images' ? file.url || undefined : undefined"
          class="w-full h-full object-cover"
        />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Files } from '@prisma/client';
import type { FileQuery } from '~/types';

defineOptions({
    name: 'UiFileWindow'
});

const props = defineProps<{
    modelValue?: Files[];
    query: FileQuery;
}>();

const selectedFiles = computed({
    get: () => props.modelValue || [],
    set: payload => emit('update:modelValue', payload)
});

const emit = defineEmits<{
    'update:modelValue': [files: Files[]];
}>();

const existingFiles = ref<Files[]>([]);
const loading = ref(false);

function handleClick (file: Files) {
    const foundIndex = selectedFiles.value.findIndex(item => item.id === file.id);
    if (foundIndex > -1) {
        selectedFiles.value.splice(foundIndex, 1);
    } else {
        selectedFiles.value.push(file);
    }
    emit('update:modelValue', selectedFiles.value);
}

const { data } = await useLazyAsyncData(async () => {
    loading.value = true;
    const files = await $fetch('/api/files', {
        query: props.query
    });

    const returnFiles = jsonParse(files.files);
    loading.value = false;

    return returnFiles;
});

if (data.value) {
    existingFiles.value = data.value;
}

</script>
