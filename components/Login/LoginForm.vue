<template>
  <div class="w-full sm:max-w-[350px] flex flex-col justify-center items-center p-4">
    <form class="grid gap-6 items-start w-full" @submit.prevent="handleLogin">
      <UiTextInput
        v-model:model-value="form.username"
        name="username"
        autocomplete="username"
        label="Username"
      />
      <UiTextInput
        v-model:model-value="form.password"
        name="password"
        autocomplete="current-password"
        label="Password"
        type="password"
      />
      <button class="border border-primary text-primary px-2 py-1 rounded hover:bg-primary focus-within:bg-primary hover:text-white focus-within:text-white outline-none" @click.prevent="handleLogin">
        Login
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">

const config = useRuntimeConfig();

defineOptions({
    name: 'LoginForm'
});

const initialForm = {
    username: '',
    password: ''
};

const form = ref(initialForm);

async function handleLogin () {
    const response = await $fetch('/api/auth/credentials', {
        method: 'POST',
        body: {
            username: form.value.username,
            password: form.value.password
        }
    }).catch((e) => {
        console.log(e.data);
    });

    if (response) {
        localStorage.setItem('auth-token', response.token);
        navigateTo(config.public.base_url);
    }
}

</script>

<style>
  .clean-layout {
    height: calc(100dvh - 4rem - 3.5rem);
  }
</style>
