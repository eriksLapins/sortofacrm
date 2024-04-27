<template>
  <div class="grid gap-4">
    <UiCheckbox
      v-model="form.isMain"
      name="company-is-main"
      label="Is main company"
      :errors="errors.isMain"
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.legalName"
        name="company-legalname"
        label="Legal name"
        :errors="errors.legalName"
      />
      <UiTextInput
        v-model="form.alternateName"
        name="company-alternate-name"
        label="Alternate (public) name"
        :errors="errors.alternateName"
      />
      <UiTextInput
        v-model="form.shortName"
        name="company-short-name"
        label="Short name"
        disabled
        :errors="errors.shortName"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.regNo"
        name="company-reg-no"
        label="Reg No"
        :errors="errors.regNo"
      />
      <UiTextInput
        v-model="form.taxNo"
        name="company-tax-no"
        label="Tax No"
        :errors="errors.taxNo"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.city"
        name="company-city"
        label="City"
        :errors="errors.city"
      />
      <UiTextInput
        v-model="form.country"
        name="company-country"
        label="Country"
        :errors="errors.country"
      />
      <UiTextInput
        v-model="form.street"
        name="company-street"
        label="Street"
        :errors="errors.street"
      />
      <UiTextInput
        v-model="form.streetNo"
        name="company-street-no"
        label="Street No"
        :errors="errors.streetNo"
      />
      <UiTextInput
        v-model="form.apartmentNo"
        name="company-apartment-no"
        label="Apartment No"
        :errors="errors.apartmentNo"
      />
      <UiTextInput
        v-model="form.fullAddress"
        name="company-full-address"
        label="Full address"
        disabled
        :errors="errors.fullAddress"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.email"
        name="company-email"
        label="E-mail"
        :errors="errors.email"
      />
      <UiTextInput
        v-model="form.phone"
        name="company-phone"
        label="Phone"
        :errors="errors.phone"
      />
      <UiTextInput
        v-model="form.phoneExtension"
        name="company-phone-extension"
        label="Phone extension"
        :errors="errors.phoneExtension"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.bankAccount"
        name="company-bank-acc"
        label="Bank account"
        :errors="errors.bankAccount"
      />
      <UiTextInput
        v-model="form.swift"
        name="company-swift"
        label="Swift"
        :errors="errors.swift"
      />
      <UiTextInput
        v-model="form.additionalBankAccount"
        name="company-add-bank-acc"
        label="Additional bank account"
        :errors="errors.additionalBankAccount"
      />
      <UiTextInput
        v-model="form.additionalSwift"
        name="company-add-swift"
        label="Additional swift"
        :errors="errors.additionalSwift"
      />
    </div>
    <div class="grid gap-4">
      <UiTextInput
        v-model="form.uploadDirectory"
        name="company-upload-directory"
        label="Upload directory"
        :errors="errors.uploadDirectory"
      />
      <UiTextInput
        v-model="form.webpage"
        name="company-webpage"
        label="Webpage URL"
        :errors="errors.webpage"
      />
      <UiTextInput
        v-model="form.logo"
        name="company-logo"
        label="Logo"
        :errors="errors.logo"
      />
    </div>
    <UiButton
      @click="addCompany"
    >
      Add company
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { ClientCompany } from '@prisma/client';

defineOptions({
    name: 'SettingsSectionCompany'
});

defineEmits(['submit']);

const currentData = ref<ClientCompany[]>();
const errors = ref<Record<string, any>>({});

const form = ref<Omit<ClientCompany, 'id'>>({
    isMain: false,
    legalName: '',
    alternateName: '',
    shortName: '',
    regNo: '',
    taxNo: '',
    city: '',
    country: '',
    street: '',
    streetNo: null as unknown as number,
    apartmentNo: null,
    fullAddress: '',
    email: '',
    phone: '',
    phoneExtension: '',
    logo: '',
    bankAccount: '',
    swift: '',
    additionalBankAccount: '',
    additionalSwift: '',
    uploadDirectory: '',
    webpage: ''
});

async function getCompanyData () {
    const data = await $fetch('/api/data/settings/company');
    currentData.value = data;
}

async function addCompany () {
    try {
        await $fetch('/api/data/settings/company', {
            method: 'POST',
            body: {
                ...form.value
            }
        });
    } catch (e: any) {
        errors.value = e.data.data.errors.data;
    }
}

onMounted(async () => {
    await getCompanyData();
});
</script>

<style scoped>

</style>
