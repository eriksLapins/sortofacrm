<template>
  <div class="grid gap-4">
    <UiCheckbox v-model="form.isMain" name="company-is-main" label="Is main company" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.legalName"
        name="company-legalname"
        label="Legal name"
      />
      <UiTextInput
        v-model="form.alternateName"
        name="company-alternate-name"
        label="Alternate (public) name"
      />
      <UiTextInput
        v-model="form.shortName"
        name="company-short-name"
        label="Short name"
        disabled
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.regNo"
        name="company-reg-no"
        label="Reg No"
      />
      <UiTextInput
        v-model="form.taxNo"
        name="company-tax-no"
        label="Tax No"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.city"
        name="company-city"
        label="City"
      />
      <UiTextInput
        v-model="form.country"
        name="company-country"
        label="Country"
      />
      <UiTextInput
        v-model="form.street"
        name="company-street"
        label="Street"
      />
      <UiTextInput
        v-model="form.streetNo"
        name="company-street-no"
        label="Street No"
      />
      <UiTextInput
        v-model="form.apartmentNo"
        name="company-apartment-no"
        label="Apartment No"
      />
      <UiTextInput
        v-model="form.fullAddress"
        name="company-full-address"
        label="Full address"
        disabled
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.email"
        name="company-email"
        label="E-mail"
      />
      <UiTextInput
        v-model="form.phone"
        name="company-phone"
        label="Phone"
      />
      <UiTextInput
        v-model="form.phoneExtension"
        name="company-phone-extension"
        label="Phone extension"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiTextInput
        v-model="form.bankAccount"
        name="company-bank-acc"
        label="Bank account"
      />
      <UiTextInput
        v-model="form.swift"
        name="company-swift"
        label="Swift"
      />
      <UiTextInput
        v-model="form.additionalBankAccount"
        name="company-add-bank-acc"
        label="Additional bank account"
      />
      <UiTextInput
        v-model="form.additionalSwift"
        name="company-add-swift"
        label="Additional swift"
      />
    </div>
    <div class="grid gap-4">
      <UiTextInput
        v-model="form.uploadDirectory"
        name="company-upload-directory"
        label="Upload directory"
      />
      <UiTextInput
        v-model="form.webpage"
        name="company-webpage"
        label="Webpage URL"
      />
      <UiTextInput
        v-model="form.logo"
        name="company-logo"
        label="Logo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientCompany } from '@prisma/client';

defineOptions({
    name: 'SettingsSectionCompany'
});

defineEmits(['submit']);

const currentData = ref<ClientCompany[]>();

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
    const { data } = await $fetch('/api/data/settings/company');
    currentData.value = jsonParse(data);
}

onMounted(async () => {
    await getCompanyData();
});
</script>

<style scoped>

</style>
