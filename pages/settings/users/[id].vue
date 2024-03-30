<template>
  <div>
    Hi {{ user }}
  </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'UserIdIndex'
});

const route = useRoute();
const userId = route.params.id;

const { data: user } = await useAsyncData(async () => {
    const response = await $fetch(`/api/data/users/${userId}`);

    const data = jsonParse(response.data);

    return {
        ...data
    };
});
</script>
