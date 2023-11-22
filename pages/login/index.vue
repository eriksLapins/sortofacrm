<template>
  <div class="h-full flex justify-center items-center px-4 sm:p-0">
    <LoginForm />
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/store/userStore';

defineOptions({
  name: 'LoginIndex'
});

definePageMeta({
  layout: 'clean'
});

onBeforeMount(() => {
  if (useUserStore().isLoggedIn) {
    navigateTo('/');
  }
});
</script>
