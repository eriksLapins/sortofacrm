<template>
  <dialog
    ref="dialog"
    class="max-h-[500px] overflow-y-scroll rounded-lg backdrop:opacity-50 backdrop:bg-black app-modal"
    @keydown="(key) => key.key === 'Escape' ? modelValue = false : ''"
  >
    <div class="bg-white p-4">
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

<style lang="scss">
@import "~/scss/theme/variables";
.app-modal {
  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    width: 0.25rem;
    background-color: $color-gray-primary;
    border-radius: 0.125rem;
  }
}
</style>
