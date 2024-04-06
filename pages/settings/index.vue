<template>
  <div class="flex gap-8 h-full">
    <div class="w-1/3 flex flex-col gap-2 border-r border-r-gray-text-disabled">
      <button
        v-for="section in generalSections"
        :key="section.key"
        class="text-start border-b-transparent hover:border-b-primary border-b hover:border-solid"
        @click="setSection(section.key)"
      >
        {{ section.name }}
      </button>
    </div>
    <SettingsSectionCompany
      v-if="!isSectionValues"
    />
    <SettingsSectionValues
      v-else
      :existing-values="currentSectionData"
      :section="currentSection"
      class="w-2/3"
      @submit="getCurrentSectionValues(currentSection)"
    />
  </div>
</template>

<script setup lang="ts">
import { SettingsSectionCompany, SettingsSectionValues } from '#components';

defineOptions({
    name: 'SettingsIndex'
});

definePageMeta({
    layout: 'settings'
});

const route = useRoute();

const generalSections = [
    {
        key: 'department',
        name: 'Departments'
    },
    {
        key: 'company',
        name: 'Company Details'
    }
];

const isSectionValues = computed(() => {
    return currentSection.value !== 'company';
});

const currentSection = ref(route.query.section as string || generalSections[0].key);
const currentSectionData = ref<any[]>([]);

function setSection (key: string) {
    navigateTo({
        query: {
            section: key
        }
    });
    currentSection.value = key;
}

async function getCurrentSectionValues (sectionName: string) {
    const { data } = await $fetch(`/api/data/settings/${sectionName}`);
    currentSectionData.value = jsonParse(data);
}

watch(() => currentSection.value, async (newValue) => {
    await getCurrentSectionValues(newValue);
});

onMounted(async () => {
    await getCurrentSectionValues(currentSection.value);
});

</script>
