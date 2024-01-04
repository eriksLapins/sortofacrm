<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - Add
    </h1>
    <div class="flex flex-col gap-4 w-full md:w-[500px]">
      <UiTextInput v-model="form.name" label="Module name" name="module-name" />
      <ul>
        <li v-for="(field, index) in form.fields" :key="index">
          <UiSelect v-model="field.valueType" :items="fieldTypeItems" :name="`field-type-${index}`" />
          <UiCheckbox v-model="field.required" label="Required" :name="`field-required-${index}`" />
        </li>
      </ul>
      <UiButton text="Add field" secondary @click="addField" />
      <UiButton
        class="self-center w-full md:w-[300px]"
        text="Save"
        secondary
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EFieldType, type ModuleFields } from '@prisma/client';

defineOptions({
    name: 'ModulesAdd'
});

definePageMeta({
    layout: 'settings'
});

const form = ref({
    name: '',
    key: '',
    fields: [] as Omit<ModuleFields, 'id'>[]
});

const fieldTypeItems = Object.values(EFieldType).map((value) => {
    return {
        key: value,
        title: value
    };
});

const fieldTemplate: Omit<ModuleFields, 'id'> = {
    key: '',
    module: '',
    required: false,
    title: '',
    type: 'text',
    valueType: 'string',
    additional: {}
};

function addField () {
    form.value.fields.push({ ...fieldTemplate });
}
async function submit () {
    await $fetch('/api/data/modules/create', {
        method: 'POST',
        body: {
            name: form.value.name,
            key: form.value.key,
            fields: form.value.fields
        }
    });
}

</script>

<style scoped>

</style>
