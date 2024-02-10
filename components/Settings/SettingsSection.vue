<template>
  <div class="border relative rounded-lg border-solid border-gray-text-disabled">
    <div v-for="item in existingValues" :key="item.id" class="py-2 px-4 border-b border-solid border-gray-text-disabled">
      {{ item.name }}
    </div>
    <div class="p-2">
      <div class="w-full flex gap-4 items-center">
        <UiTextInput
          v-model="newValue"
          :name="`${section}-new-item`"
        />
        <UiButton
          class="text-nowrap"
          @click.prevent="addNewValue(newValue)"
        >
          Add new
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'KeyValuesSection'
});

const props = defineProps<{
    existingValues: {id: number, name: string}[],
    section: string
}>();

const emit = defineEmits(['submit']);

const newValue = ref<string>();

async function addNewValue (value: string | undefined) {
    if (value) {
        try {
            await $fetch(`/api/data/settings/${props.section}`, {
                method: 'POST',
                body: {
                    name: value
                }
            });
            emit('submit');
        } catch (e) {
            console.log(e);
        }
    }
};
</script>

<style scoped>

</style>
