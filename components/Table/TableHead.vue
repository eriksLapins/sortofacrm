<template>
  <thead class="table-head">
    <slot />
  </thead>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
@import "~/scss/theme/variables";

.table-head {
    td {
        font-weight: bold;
        padding: 0.5rem;
        border-bottom: 0.125rem $color-primary solid;
    }
}

</style>
