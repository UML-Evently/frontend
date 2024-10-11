<script setup lang="ts">
const route = useRoute()

const pageName = computed(() => {
  return route.name
})

useHead(computed(() => {
  return {
    title: pageName.value + ' - Evently'
  }
}))
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications class="pointer-events-none" />
  </div>
</template>
