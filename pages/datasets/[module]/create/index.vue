<template>
  <div>
    <ModuleForm :module="($route.params.module as string)" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'CreateModuleIndex'
});

</script>

<style scoped>

</style>
