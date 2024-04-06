<template>
  <dialog
    ref="dialog"
    class="rounded-lg backdrop:opacity-50 backdrop:bg-black overflow-hidden"
    @keydown="(key) => key.key === 'Escape' ? modelValue = false : ''"
  >
    <div class="bg-white p-4 flex flex-col">
      <div v-if="$slots.header" class="h-12">
        <slot name="header" />
      </div>
      <slot name="default" />
      <div v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
defineOptions({
    name: 'AppModal'
});

const dialog = ref<HTMLDialogElement>();

function openCloseModal () {
    if (modelValue.value) {
        dialog.value?.showModal();
    } else {
        dialog.value?.close();
    }
}

const modelValue = defineModel<boolean>({ default: false });

watch(() => modelValue.value, () => {
    openCloseModal();
});

onMounted(() => {
    openCloseModal();
});

</script>
