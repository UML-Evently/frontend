<script setup lang="ts">
import type { EventResponseDto } from '~/composables/generated/Api'

const props = defineProps<{
  event: EventResponseDto
}>()

function parseDate(date: Date) {
  return (
    new Date(date).toLocaleDateString({
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    + ' '
    + new Date(date).toLocaleTimeString('en-CA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )
}

const { event } = toRefs(props)
</script>

<template>
  <ULandingCard
    :title="event.name"
    :description="event.description"
    :to="`/events/${event._id}`"
    class="col-span-4"
  >
    <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <UIcon name="i-mdi-calendar-month" />
      <p>
        {{ parseDate(event.startDate) }} - {{ parseDate(event.endDate) }}
      </p>
    </div>
  </ULandingCard>
</template>

<style scoped>

</style>
