<script setup lang="ts">
definePageMeta({
  name: 'Home',
  middleware: 'no-auth'
})
</script>

<template>
  <div>
    <ULandingHero
      title="Evently"
      description="Evently is an AI-powered event management app that helps users discover and attend events based on their preferences. It offers personalized event recommendations using artificial intelligence, allowing users to explore concerts, workshops, festivals, and more. Users can browse, book, and manage tickets effortlessly through the app, ensuring a seamless event experience tailored to their interests."
      orientation="horizontal"
    >
      <div class="flex justify-center">
        <UColorModeImage
          light="/logo_black.png"
          dark="/logo_white.png"
          class="h-96"
        />
      </div>
    </ULandingHero>
  </div>
</template>

<style scoped>

</style>
