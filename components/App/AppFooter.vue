<template>
  <footer class="flex h-32 w-full bg-primary mt-auto justify-between px-4 md:px-12">
    <div class="flex flex-col gap-4 items-start justify-center">
      <p class="copyrights text-sm md:text-base-plus text-white text-wrap self-center">
        &copy; Ēriks Lapiņš. All rights reserved
      </p>
      <!-- <div class="flex flex-row gap-2">
        <a href="/policies/privacy" class="text-white hover:text-secondary text-sm">Privacy Policy</a>
        <a href="/policies/cookie" class="text-white hover:text-secondary text-sm">Cookie Policy</a>
      </div> -->
    </div>
    <ul class="socials flex text-sm md:text-base-plus text-white flex-col md:flex-row md:gap-2 lg:gap-4 self-center md:justify-evenly">
      <li>
        <a
          class="text-white hover:text-gray-text"
          href="https://github.com/eriksLapins"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB
        </a>
      </li>
      <li>
        <a
          class="text-white hover:text-gray-text"
          href="https://www.linkedin.com/in/%C4%93riks-lapi%C5%86%C5%A1/"
          target="_blank"
          rel="noreferrer"
        >
          LINKEDIN
        </a>
      </li>
      <li>
        <a
          class="text-white hover:text-gray-text"
          href="https://www.facebook.com/eriks.lapins.9/"
          target="_blank"
          rel="noreferrer"
        >
          FACEBOOK
        </a>
      </li>
      <li>
        <a
          class="text-white hover:text-gray-text"
          href="https://www.instagram.com/lapinslv/"
          target="_blank"
          rel="noreferrer"
        >
          INSTAGRAM
        </a>
      </li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppFooter'
});

</script>
