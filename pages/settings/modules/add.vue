<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - Add
    </h1>
    <div v-if="generalError" class="text-error-border text-left w-full h-4">
      {{ generalError.main }}
    </div>
    <div class="flex flex-col gap-4 w-full">
      <ModuleSettingsForm
        v-model="form"
        :errors="formErrors"
        :general-error="generalError"
        :loading
      />
      <div class="separator" />
      <UiButton
        v-if="!loading"
        class="self-center w-full md:w-[300px]"
        secondary
        @click="submit"
      >
        <span>Save</span>
      </UiButton>
      <LoadingAnimation v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModuleSettingsForm from '~/components/Module/ModuleSettingsForm.vue';
import type { ModuleFieldsAdjusted, ResponseError } from '~/types';

defineOptions({
    name: 'ModulesAdd'
});

definePageMeta({
    layout: 'settings'
});

const form = ref<{
  name: string,
  key: string,
  fields: ModuleFieldsAdjusted[],
}>({
    name: '',
    key: '',
    fields: createDefaultFields()
});

const formErrors = ref<ResponseError>({});
const generalError = ref<{
  main: string,
  field: string,
}>();
const loading = ref(false);

async function submit () {
    loading.value = true;
    formErrors.value = {};
    generalError.value = undefined;
    form.value.fields.forEach((field) => {
        if (field.title === '') {
            generalError.value = {
                main: 'Some fields are missing titles',
                field: 'Field is missing a title, please remove or input a title'
            };
        }
        field.module = form.value.key;
    });
    if (generalError.value) {
        loading.value = false;

        return;
    }
    try {
        const response = await $fetch('/api/data/modules', {
            method: 'POST',
            body: {
                name: form.value.name,
                key: form.value.key,
                fields: form.value.fields
            }
        });

        if ('success' in response && response.success) {
            loading.value = false;
            navigateTo('/settings/modules', {
                external: true
            });
        }
    } catch (e: any) {
        if (e.status === 400) {
            formErrors.value = { ...e.data.data.errors };
        } else if (e.status === 500) {
            error500(e.data.message);
        } else {
            error500('Something went wrong during module creation');
        }
    }
    loading.value = false;
}
</script>
