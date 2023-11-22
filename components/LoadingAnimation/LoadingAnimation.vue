<template>
  <div className="loading-animation h-9">
    <div className="lds-dual-ring" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoadingAnimation'
});
</script>

<style lang="scss">
  @import "~/scss/theme/variables";

.loading-animation {
    display: flex;
    width: 100%;
    height: 104px;
    justify-content: center;
    align-items: center;

    @media (min-width: 420px)  {
      height: 44px;
    }
}

.lds-dual-ring {
    display: inline-block;
    width: 44px;
    height: 44px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 6px solid $color-primary;
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
