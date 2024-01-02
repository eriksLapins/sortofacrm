<template>
  <div class="loading-animation w-full flex justify-center items-center" :class="largeSize ? 'h-32' : 'h-28 sm:h-10'">
    <div class="lds-dual-ring inline-block" :class="largeSize ? 'h-32 w-32 after:h-32 after:w-32 after:border-8' : 'h-9 w-9 after:h-9 after:w-9 after:border-4'" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'LoadingAnimation'
});

defineProps({
    largeSize: {
        type: Boolean
    }
});
</script>

<style lang="scss">
  @import "~/scss/theme/variables";

.lds-dual-ring:after {
  content: " ";
  display: block;
  border-radius: 50%;
  border-style: solid;
  border-color: $color-primary;
  border-color: $color-primary transparent $color-primary transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
