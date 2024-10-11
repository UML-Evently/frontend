<script setup lang="ts">
import type { EventResponseDto } from '~/composables/generated/Api.ts'

definePageMeta({
  name: 'Discover'
})

const discoverableEvents = ref<EventResponseDto[]>([])
const discoverableEventsFailed = ref(false)
const loading = ref(true)
const search = ref('')
const loadingDots = ref('.')

const showSearchResults = computed(() => search.value.length >= 3)
const searchedEvents = ref<EventResponseDto[]>([])

async function refreshSearchResults(event: Event) {
  if (search.value.length < 3) {
    return
  }
  try {
    searchedEvents.value = await useApi().event.eventControllerSearchEvents(event.target.value)
  } catch (e) {
    console.error(e)
    searchedEvents.value = []
  }
}

onMounted(async () => {
  loadingDots.value = loadingDots.value.length < 3 ? loadingDots.value + '.' : '.'
  const interval = setInterval(() => {
    loadingDots.value = loadingDots.value.length < 3 ? loadingDots.value + '.' : '.'
  }, 200)
  try {
    discoverableEvents.value = await useApi().user.userControllerGetUserSuggestions().then(res => res.suggestions)
  } catch (e) {
    console.error(e)
    discoverableEventsFailed.value = true
  }
  loading.value = false
  clearInterval(interval)
})
</script>

<template>
  <div class="flex flex-col items-center">
    <ULandingSection
      title="Discover events"
      description="Find events that you can join and participate in."
      class="w-full"
    >
      <div class="flex flex-col gap-1">
        <UInput
          v-model="search"
          placeholder="Search for an event"
          icon="i-mdi-magnify"
          class="w-full md:w-1/2 mx-auto"
          @input="refreshSearchResults"
        />
        <UCard
          v-if="showSearchResults"
          class="w-full md:w-1/2 mx-auto"
        >
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <UIcon name="i-mdi-magnify" />
              <p>Search results</p>
            </div>
            <UButton
              v-for="(event, index) in searchedEvents"
              :key="index"
              :to="`/events/${event._id}`"
              color="blue"
              variant="soft"
            >
              {{ event.name }}
            </UButton>
          </div>
        </UCard>
      </div>
      <div v-if="discoverableEventsFailed">
        <div class="w-full md:w-1/2 mx-auto h-36 flex flex-col justify-center items-center text-center gap-2">
          <UAlert
            title="Failed to load recommendations"
            description="We couldn't load AI recommendations for you. Please try again later."
            icon="i-mdi-alert-circle"
            variant="subtle"
            color="red"
          />
        </div>
      </div>
      <div v-else-if="loading">
        <div class="text-xl text-gray-500 w-full h-36 flex justify-center items-center text-center gap-2">
          <UIcon name="i-mdi-brain" />
          <p>Recommendations are loading{{ loadingDots }}</p>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-start gap-4"
      >
        <div class="flex items-center gap-1 text-primary-600 dark:text-primary-400">
          <p>Generated with AI</p>
          <UIcon name="i-mdi-brain" />
        </div>
        <ULandingGrid>
          <DiscoverCard
            v-for="event in discoverableEvents"
            :key="event.id"
            :event="event"
          />
        </ULandingGrid>
      </div>
    </ULandingSection>
  </div>
</template>

<style scoped>

</style>
